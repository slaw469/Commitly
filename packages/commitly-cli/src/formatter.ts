import chalk from 'chalk';
import type { ValidationResult, ValidationIssue } from '@commitly/core';

/**
 * Formats validation issues for console output
 * @param issues - Array of validation issues
 * @param type - Type of issues (errors or warnings)
 * @returns Formatted string
 */
function formatIssues(issues: ValidationIssue[], type: 'error' | 'warning'): string {
  if (issues.length === 0) return '';

  const icon = type === 'error' ? '✖' : '⚠';
  const color = type === 'error' ? chalk.red : chalk.yellow;
  const label = type === 'error' ? 'Error' : 'Warning';

  const lines = issues.map((issue) => {
    return `  ${color(icon)} ${chalk.bold(issue.rule)}: ${issue.message}`;
  });

  return `\n${color.bold(`${label}s:`)}\n${lines.join('\n')}`;
}

/**
 * Formats a validation result for console output
 * @param result - Validation result
 * @returns Formatted string
 */
export function formatValidationResult(result: ValidationResult): string {
  const parts: string[] = [];

  // Header
  if (result.valid) {
    parts.push(chalk.green.bold('✔ Commit message is valid'));
  } else {
    parts.push(chalk.red.bold('✖ Commit message has errors'));
  }

  // Message preview
  const preview = result.parsed.header.slice(0, 80);
  parts.push(chalk.dim(`\nMessage: ${preview}${result.parsed.header.length > 80 ? '...' : ''}`));

  // Errors
  if (result.errors.length > 0) {
    parts.push(formatIssues(result.errors, 'error'));
  }

  // Warnings
  if (result.warnings.length > 0) {
    parts.push(formatIssues(result.warnings, 'warning'));
  }

  // Suggestion
  if (result.suggestion && result.suggestion !== result.parsed.raw) {
    parts.push(`\n${chalk.cyan.bold('Suggested fix:')}`);
    parts.push(chalk.cyan(result.suggestion));
  }

  // Summary
  const summary = [];
  if (result.errors.length > 0) {
    summary.push(
      chalk.red(`${result.errors.length} error${result.errors.length !== 1 ? 's' : ''}`)
    );
  }
  if (result.warnings.length > 0) {
    summary.push(
      chalk.yellow(`${result.warnings.length} warning${result.warnings.length !== 1 ? 's' : ''}`)
    );
  }

  if (summary.length > 0) {
    parts.push(`\n${summary.join(', ')}`);
  }

  return parts.join('\n');
}

/**
 * Formats a diff between original and fixed messages
 * @param original - Original message
 * @param fixed - Fixed message
 * @returns Formatted diff
 */
export function formatDiff(original: string, fixed: string): string {
  const lines: string[] = [chalk.bold('\nDiff:')];

  lines.push(chalk.red(`- ${original.split('\n').join('\n- ')}`));
  lines.push(chalk.green(`+ ${fixed.split('\n').join('\n+ ')}`));

  return lines.join('\n');
}

/**
 * Prints success message
 * @param message - Success message
 */
export function printSuccess(message: string): void {
  console.log(chalk.green('✔'), message);
}

/**
 * Prints error message
 * @param message - Error message
 */
export function printError(message: string): void {
  console.error(chalk.red('✖'), message);
}

/**
 * Prints info message
 * @param message - Info message
 */
export function printInfo(message: string): void {
  console.log(chalk.blue('ℹ'), message);
}
