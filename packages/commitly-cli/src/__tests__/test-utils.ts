import { mkdir, writeFile, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';
import { execSync } from 'child_process';

/**
 * Creates a temporary directory for testing
 */
export async function createTempDir(): Promise<string> {
  const tmpBase = tmpdir();
  const dirName = `commitly-test-${randomBytes(8).toString('hex')}`;
  const tmpPath = join(tmpBase, dirName);
  await mkdir(tmpPath, { recursive: true });
  return tmpPath;
}

/**
 * Removes a temporary directory and all its contents
 */
export async function cleanupTempDir(tmpPath: string): Promise<void> {
  try {
    await rm(tmpPath, { recursive: true, force: true });
  } catch (error) {
    // Ignore errors during cleanup
  }
}

/**
 * Initializes a git repository in the given directory
 */
export function initGitRepo(repoPath: string): void {
  execSync('git init', { cwd: repoPath, stdio: 'pipe' });
  execSync('git config user.name "Test User"', { cwd: repoPath, stdio: 'pipe' });
  execSync('git config user.email "test@example.com"', { cwd: repoPath, stdio: 'pipe' });
}

/**
 * Creates a commit message file in the git directory
 */
export async function createCommitMsgFile(repoPath: string, message: string): Promise<string> {
  const gitDir = join(repoPath, '.git');
  await mkdir(gitDir, { recursive: true });
  const msgPath = join(gitDir, 'COMMIT_EDITMSG');
  await writeFile(msgPath, message, 'utf-8');
  return msgPath;
}

/**
 * Creates a config file for commitly
 */
export async function createConfig(
  repoPath: string,
  config: Record<string, unknown>,
  format: 'json' | 'js' = 'json'
): Promise<string> {
  const filename = format === 'json' ? '.commitlyrc.json' : '.commitlyrc.js';
  const configPath = join(repoPath, filename);
  
  if (format === 'json') {
    await writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
  } else {
    await writeFile(
      configPath,
      `module.exports = ${JSON.stringify(config, null, 2)}`,
      'utf-8'
    );
  }
  
  return configPath;
}

/**
 * Installs the commit-msg hook
 */
export async function installHook(repoPath: string, hookContent: string): Promise<string> {
  const hooksDir = join(repoPath, '.git', 'hooks');
  await mkdir(hooksDir, { recursive: true });
  const hookPath = join(hooksDir, 'commit-msg');
  await writeFile(hookPath, hookContent, 'utf-8');
  execSync(`chmod +x "${hookPath}"`, { stdio: 'pipe' });
  return hookPath;
}

/**
 * Attempts a git commit and captures the result
 */
export function attemptCommit(repoPath: string, message: string): {
  success: boolean;
  stdout: string;
  stderr: string;
} {
  try {
    // Create a dummy file to commit
    const testFile = join(repoPath, 'test.txt');
    execSync(`echo "test" > "${testFile}"`, { cwd: repoPath, stdio: 'pipe' });
    execSync('git add .', { cwd: repoPath, stdio: 'pipe' });
    
    const result = execSync(`git commit -m "${message}"`, {
      cwd: repoPath,
      stdio: 'pipe',
      encoding: 'utf-8',
    });
    
    return {
      success: true,
      stdout: result.toString(),
      stderr: '',
    };
  } catch (error) {
    const execError = error as { stdout?: Buffer; stderr?: Buffer };
    return {
      success: false,
      stdout: execError.stdout?.toString() || '',
      stderr: execError.stderr?.toString() || '',
    };
  }
}

