#!/usr/bin/env node

import { Command } from 'commander';
import { lintCommand, fixCommand, checkCommand, initHooksCommand } from './commands';

const program = new Command();

program
  .name('commitly')
  .description('Lint and auto-fix commit messages')
  .version('0.1.0');

program
  .command('lint')
  .description('Validate a commit message')
  .option('-f, --file <path>', 'Path to commit message file')
  .option('-m, --message <message>', 'Commit message to validate')
  .action(async (options: { file?: string; message?: string }) => {
    const exitCode = await lintCommand(options);
    process.exit(exitCode);
  });

program
  .command('fix')
  .description('Auto-fix a commit message')
  .option('-f, --file <path>', 'Path to commit message file')
  .option('-m, --message <message>', 'Commit message to fix')
  .action(async (options: { file?: string; message?: string }) => {
    const exitCode = await fixCommand(options);
    process.exit(exitCode);
  });

program
  .command('check')
  .description('Check a commit message (for CI)')
  .argument('<message>', 'Commit message to check')
  .action(async (message: string) => {
    const exitCode = await checkCommand(message);
    process.exit(exitCode);
  });

program
  .command('init-hooks')
  .description('Install git commit-msg hook')
  .action(async () => {
    const exitCode = await initHooksCommand();
    process.exit(exitCode);
  });

// Default command - lint
program.action(async () => {
  const exitCode = await lintCommand({});
  process.exit(exitCode);
});

program.parse();

