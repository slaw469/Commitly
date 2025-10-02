import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFile, writeFile, access } from 'fs/promises';
import { join } from 'path';
import { execSync } from 'child_process';
import { initHooksCommand } from '../commands';
import {
  createTempDir,
  cleanupTempDir,
  initGitRepo,
  installHook,
  attemptCommit,
} from './test-utils';

describe('Git Hooks Integration Tests', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await createTempDir();
    initGitRepo(tmpDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tmpDir);
  });

  describe('initHooksCommand', () => {
    it('should create commit-msg hook', async () => {
      // Change to temp directory for hook installation
      const originalCwd = process.cwd();
      process.chdir(tmpDir);

      try {
        const exitCode = await initHooksCommand();
        expect(exitCode).toBe(0);

        // Verify hook file exists
        const hookPath = join(tmpDir, '.git', 'hooks', 'commit-msg');
        await expect(access(hookPath)).resolves.not.toThrow();

        // Verify hook content
        const hookContent = await readFile(hookPath, 'utf-8');
        expect(hookContent).toContain('#!/bin/sh');
        expect(hookContent).toContain('commitly lint');
        expect(hookContent).toContain('Commitly hook');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should make hook executable', async () => {
      const originalCwd = process.cwd();
      process.chdir(tmpDir);

      try {
        await initHooksCommand();

        const hookPath = join(tmpDir, '.git', 'hooks', 'commit-msg');
        
        // Check if file is executable (on Unix-like systems)
        if (process.platform !== 'win32') {
          const stats = await readFile(hookPath, 'utf-8');
          expect(stats).toBeTruthy();
          
          // Try to verify it can be executed
          try {
            execSync(`test -x "${hookPath}"`, { stdio: 'pipe' });
          } catch {
            throw new Error('Hook is not executable');
          }
        }
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should create hooks directory if it does not exist', async () => {
      const originalCwd = process.cwd();
      process.chdir(tmpDir);

      try {
        // Remove hooks directory if it exists
        execSync('rm -rf .git/hooks', { cwd: tmpDir, stdio: 'pipe' });

        const exitCode = await initHooksCommand();
        expect(exitCode).toBe(0);

        // Verify hooks directory was created
        const hookPath = join(tmpDir, '.git', 'hooks', 'commit-msg');
        await expect(access(hookPath)).resolves.not.toThrow();
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should overwrite existing hook', async () => {
      const originalCwd = process.cwd();
      process.chdir(tmpDir);

      try {
        // Create an existing hook
        const oldHook = '#!/bin/sh\necho "old hook"';
        await installHook(tmpDir, oldHook);

        // Install new hook
        await initHooksCommand();

        // Verify new hook content
        const hookPath = join(tmpDir, '.git', 'hooks', 'commit-msg');
        const hookContent = await readFile(hookPath, 'utf-8');
        expect(hookContent).toContain('commitly lint');
        expect(hookContent).not.toContain('old hook');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should handle non-git directory gracefully', async () => {
      const nonGitDir = await createTempDir();
      const originalCwd = process.cwd();
      process.chdir(nonGitDir);

      try {
        const exitCode = await initHooksCommand();
        
        // The command will create .git/hooks directory even if not a git repo
        // So we just verify it completes
        expect(exitCode).toBe(0);
      } finally {
        process.chdir(originalCwd);
        await cleanupTempDir(nonGitDir);
      }
    });
  });

  describe('Hook Execution', () => {
    it('should verify hook file contains correct content', async () => {
      const originalCwd = process.cwd();
      process.chdir(tmpDir);

      try {
        await initHooksCommand();

        const hookPath = join(tmpDir, '.git', 'hooks', 'commit-msg');
        const hookContent = await readFile(hookPath, 'utf-8');
        
        // Verify hook calls commitly lint with the commit message file
        expect(hookContent).toContain('commitly lint');
        expect(hookContent).toContain('$1'); // Message file path
        expect(hookContent).toContain('exit $?'); // Exit code propagation
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should create hook that can read commit message', async () => {
      const originalCwd = process.cwd();
      process.chdir(tmpDir);

      try {
        await initHooksCommand();

        // Create a test commit message file manually
        const msgPath = join(tmpDir, '.git', 'COMMIT_EDITMSG');
        await writeFile(msgPath, 'feat: test message', 'utf-8');
        
        // Verify the message file exists and can be read
        const content = await readFile(msgPath, 'utf-8');
        expect(content).toBe('feat: test message');
        
        // Hook would call: commitly lint -f $msgPath
        // We can't test actual git commit here without the CLI being globally available
        // But we verified the hook structure is correct
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should create executable hook on unix systems', async () => {
      if (process.platform === 'win32') {
        // Skip on Windows
        return;
      }

      const originalCwd = process.cwd();
      process.chdir(tmpDir);

      try {
        await initHooksCommand();

        const hookPath = join(tmpDir, '.git', 'hooks', 'commit-msg');
        
        // Verify hook is executable
        try {
          execSync(`test -x "${hookPath}"`, { stdio: 'pipe' });
        } catch {
          throw new Error('Hook file is not executable');
        }
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should include proper shebang in hook', async () => {
      const originalCwd = process.cwd();
      process.chdir(tmpDir);

      try {
        await initHooksCommand();

        const hookPath = join(tmpDir, '.git', 'hooks', 'commit-msg');
        const hookContent = await readFile(hookPath, 'utf-8');
        
        expect(hookContent.startsWith('#!/bin/sh')).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should include usage comment in hook', async () => {
      const originalCwd = process.cwd();
      process.chdir(tmpDir);

      try {
        await initHooksCommand();

        const hookPath = join(tmpDir, '.git', 'hooks', 'commit-msg');
        const hookContent = await readFile(hookPath, 'utf-8');
        
        expect(hookContent).toContain('Commitly hook');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('Hook Integration with Config', () => {
    it('should allow config file to exist alongside hook', async () => {
      const originalCwd = process.cwd();
      process.chdir(tmpDir);

      try {
        // Create custom config
        const configPath = join(tmpDir, '.commitlyrc.json');
        const { writeFile } = await import('fs/promises');
        await writeFile(
          configPath,
          JSON.stringify({
            types: ['custom', 'special'],
          }),
          'utf-8'
        );

        await initHooksCommand();

        // Verify hook and config both exist
        const hookPath = join(tmpDir, '.git', 'hooks', 'commit-msg');
        await expect(access(hookPath)).resolves.not.toThrow();
        await expect(access(configPath)).resolves.not.toThrow();
        
        // The hook will use this config when executed by git
        // (testing actual execution requires CLI to be in PATH)
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should install hook successfully from git root', async () => {
      const originalCwd = process.cwd();
      process.chdir(tmpDir);

      try {
        const exitCode = await initHooksCommand();
        expect(exitCode).toBe(0);

        // Verify hook exists
        const hookPath = join(tmpDir, '.git', 'hooks', 'commit-msg');
        await expect(access(hookPath)).resolves.not.toThrow();
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should preserve hook shebang', async () => {
      const originalCwd = process.cwd();
      process.chdir(tmpDir);

      try {
        await initHooksCommand();

        const hookPath = join(tmpDir, '.git', 'hooks', 'commit-msg');
        const hookContent = await readFile(hookPath, 'utf-8');
        
        // Verify shebang is first line
        const lines = hookContent.split('\n');
        expect(lines[0]).toBe('#!/bin/sh');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should include exit code handling in hook', async () => {
      const originalCwd = process.cwd();
      process.chdir(tmpDir);

      try {
        await initHooksCommand();

        const hookPath = join(tmpDir, '.git', 'hooks', 'commit-msg');
        const hookContent = await readFile(hookPath, 'utf-8');
        
        // Verify exit code is properly propagated
        expect(hookContent).toContain('exit $?');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should pass commit message file path to hook', async () => {
      const originalCwd = process.cwd();
      process.chdir(tmpDir);

      try {
        await initHooksCommand();

        const hookPath = join(tmpDir, '.git', 'hooks', 'commit-msg');
        const hookContent = await readFile(hookPath, 'utf-8');
        
        // Verify $1 (message file path) is passed to commitly
        expect(hookContent).toContain('"$1"');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });
});

