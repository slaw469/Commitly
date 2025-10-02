import type { Config, ParsedCommit, ValidationIssue, ValidationResult } from './types';
import { parseCommitMessage } from './parser';
import { ConfigSchema } from './types';

/**
 * Validates a parsed commit message against configuration rules
 * @param parsed - Parsed commit message
 * @param config - Validation configuration
 * @returns Array of validation issues
 */
function validateParsedCommit(parsed: ParsedCommit, config: Config): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Validate type exists and is allowed
  if (!parsed.type) {
    issues.push({
      level: 'error',
      rule: 'type-empty',
      message: 'Commit type is required (e.g., feat, fix, docs)',
    });
  } else if (!config.types.includes(parsed.type)) {
    issues.push({
      level: 'error',
      rule: 'type-enum',
      message: `Type "${parsed.type}" is not allowed. Use one of: ${config.types.join(', ')}`,
    });
  }

  // Validate scope if required
  if (config.requireScope && !parsed.scope) {
    issues.push({
      level: 'error',
      rule: 'scope-empty',
      message: 'Commit scope is required',
    });
  }

  // Validate subject
  if (!parsed.subject || parsed.subject.trim() === '') {
    if (config.subjectEmptyForbidden) {
      issues.push({
        level: 'error',
        rule: 'subject-empty',
        message: 'Subject is required',
      });
    }
  } else {
    // Check subject case
    if (config.subjectCase === 'lower') {
      const firstChar = parsed.subject.charAt(0);
      if (firstChar !== firstChar.toLowerCase()) {
        issues.push({
          level: 'error',
          rule: 'subject-case',
          message: 'Subject must start with lowercase letter',
        });
      }
    } else if (config.subjectCase === 'sentence') {
      const firstChar = parsed.subject.charAt(0);
      if (firstChar !== firstChar.toUpperCase()) {
        issues.push({
          level: 'error',
          rule: 'subject-case',
          message: 'Subject must start with uppercase letter',
        });
      }
    }

    // Check for trailing period
    if (config.subjectFullStopForbidden && parsed.subject.endsWith('.')) {
      issues.push({
        level: 'error',
        rule: 'subject-full-stop',
        message: 'Subject must not end with period',
      });
    }

    // Check for blocked words
    const subjectLower = parsed.subject.toLowerCase();
    for (const word of config.blockedWords) {
      if (subjectLower.includes(word.toLowerCase())) {
        issues.push({
          level: 'error',
          rule: 'blocked-words',
          message: `Subject contains blocked word: "${word}"`,
        });
      }
    }
  }

  // Validate header length
  if (parsed.header.length > config.maxHeaderLength) {
    issues.push({
      level: 'error',
      rule: 'header-max-length',
      message: `Header exceeds maximum length of ${config.maxHeaderLength} characters (current: ${parsed.header.length})`,
    });
  }

  // Validate body format
  if (parsed.body) {
    const bodyLines = parsed.body.split('\n');

    // Check for leading blank line
    if (config.bodyLeadingBlank) {
      const firstLineAfterHeader = parsed.raw.split('\n')[1];
      if (firstLineAfterHeader !== undefined && firstLineAfterHeader.trim() !== '') {
        issues.push({
          level: 'warning',
          rule: 'body-leading-blank',
          message: 'Body should be separated from header by blank line',
        });
      }
    }

    // Check line length
    for (let i = 0; i < bodyLines.length; i++) {
      const line = bodyLines[i];
      if (line && line.length > config.maxLineLength) {
        issues.push({
          level: 'warning',
          rule: 'body-max-line-length',
          message: `Body line ${i + 1} exceeds ${config.maxLineLength} characters`,
        });
      }
    }
  }

  // Validate footer format
  if (parsed.footer && config.footerLeadingBlank) {
    // Check that footer is separated by blank line
    const lines = parsed.raw.split('\n');
    const footerIndex = lines.findIndex((line) => parsed.footer?.startsWith(line));
    if (footerIndex > 0) {
      const lineBeforeFooter = lines[footerIndex - 1];
      if (lineBeforeFooter !== undefined && lineBeforeFooter.trim() !== '') {
        issues.push({
          level: 'warning',
          rule: 'footer-leading-blank',
          message: 'Footer should be separated by blank line',
        });
      }
    }
  }

  return issues;
}

/**
 * Validates a commit message and returns detailed results
 * @param message - Raw commit message
 * @param userConfig - Optional partial configuration
 * @returns Complete validation result
 */
export function validateCommit(message: string, userConfig?: Partial<Config>): ValidationResult {
  // Parse and validate config
  const config = ConfigSchema.parse({ ...userConfig });

  // Parse commit message
  const parsed = parseCommitMessage(message);

  // Validate
  const allIssues = validateParsedCommit(parsed, config);

  const errors = allIssues.filter((issue) => issue.level === 'error');
  const warnings = allIssues.filter((issue) => issue.level === 'warning');

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    parsed,
    suggestion: null, // Will be filled by autofix
  };
}
