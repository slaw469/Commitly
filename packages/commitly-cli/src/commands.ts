import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { validateCommit, suggestFix } from '@commitly/core';
import type { Config } from '@commitly/core';
import { loadConfig } from './config';
import {
  formatValidationResult,
  formatDiff,
  printSuccess,
  printError,
  printInfo,
} from './formatter';

/**
 * Lint command - validates a commit message
 */
export async function lintCommand(options: {
  file?: string;
  message?: string;
}): Promise<number> {
  try {
    // Get message from file or option
    let message: string;
    
    if (options.message) {
      message = options.message;
    } else if (options.file) {
      message = await readFile(options.file, 'utf-8');
    } else {
      // Default: read from .git/COMMIT_EDITMSG
      const defaultPath = resolve(process.cwd(), '.git/COMMIT_EDITMSG');
      try {
        message = await readFile(defaultPath, 'utf-8');
      } catch {
        printError('No commit message file found. Use -f or -m option.');
        return 1;
      }
    }

    // Load config
    const config = (await loadConfig()) ?? undefined;

    // Validate
    const result = validateCommit(message.trim(), config);
    
    // Add suggestion
    const suggestion = suggestFix(message.trim(), config);
    result.suggestion = suggestion;

    // Output
    console.log(formatValidationResult(result));

    return result.valid ? 0 : 1;
  } catch (error) {
    if (error instanceof Error) {
      printError(`Failed to lint: ${error.message}`);
    }
    return 1;
  }
}

/**
 * Fix command - auto-fixes a commit message in place
 */
export async function fixCommand(options: {
  file?: string;
  message?: string;
}): Promise<number> {
  try {
    let message: string;
    let targetFile: string | null = null;

    if (options.message) {
      message = options.message;
    } else if (options.file) {
      targetFile = options.file;
      message = await readFile(targetFile, 'utf-8');
    } else {
      // Default: read from .git/COMMIT_EDITMSG
      const defaultPath = resolve(process.cwd(), '.git/COMMIT_EDITMSG');
      try {
        targetFile = defaultPath;
        message = await readFile(defaultPath, 'utf-8');
      } catch {
        printError('No commit message file found. Use -f or -m option.');
        return 1;
      }
    }

    // Load config
    const config = (await loadConfig()) ?? undefined;

    // Try to fix
    const fixed = suggestFix(message.trim(), config);

    if (!fixed) {
      printInfo('No fixes needed or unable to auto-fix');
      return 0;
    }

    // Show diff
    console.log(formatDiff(message.trim(), fixed));

    // Write back if file mode
    if (targetFile) {
      await writeFile(targetFile, fixed + '\n', 'utf-8');
      printSuccess(`Fixed commit message written to ${targetFile}`);
    } else {
      // Just print fixed version
      console.log('\n' + fixed);
    }

    return 0;
  } catch (error) {
    if (error instanceof Error) {
      printError(`Failed to fix: ${error.message}`);
    }
    return 1;
  }
}

/**
 * Check command - validates a message (for CI usage)
 */
export async function checkCommand(message: string): Promise<number> {
  try {
    const config = (await loadConfig()) ?? undefined;
    const result = validateCommit(message.trim(), config);
    
    result.suggestion = suggestFix(message.trim(), config);
    
    console.log(formatValidationResult(result));
    
    return result.valid ? 0 : 1;
  } catch (error) {
    if (error instanceof Error) {
      printError(`Failed to check: ${error.message}`);
    }
    return 1;
  }
}

/**
 * Init hooks command - sets up git hooks
 */
export async function initHooksCommand(): Promise<number> {
  try {
    const { writeFile, mkdir, chmod } = await import('fs/promises');
    const { join } = await import('path');

    const hooksDir = resolve(process.cwd(), '.git/hooks');
    
    // Create hooks directory if it doesn't exist
    await mkdir(hooksDir, { recursive: true });

    // Create commit-msg hook
    const commitMsgHook = `#!/bin/sh
# Commitly hook
# Auto-generated - do not edit manually

commitly lint -f "$1"
exit $?
`;

    const hookPath = join(hooksDir, 'commit-msg');
    await writeFile(hookPath, commitMsgHook, 'utf-8');
    await chmod(hookPath, 0o755);

    printSuccess('Git hooks installed successfully');
    printInfo('Hooks installed: commit-msg');
    printInfo('Commits will now be validated automatically');

    return 0;
  } catch (error) {
    if (error instanceof Error) {
      printError(`Failed to install hooks: ${error.message}`);
    }
    return 1;
  }
}

