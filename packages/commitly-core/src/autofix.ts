import type { AutoFixOptions, Config, ParsedCommit } from './types';
import { parseCommitMessage, reconstructCommitMessage } from './parser';
import { ConfigSchema } from './types';

// Common verb to type mappings for inference
const VERB_TO_TYPE_MAP: Record<string, string> = {
  add: 'feat',
  adding: 'feat',
  added: 'feat',
  create: 'feat',
  creating: 'feat',
  created: 'feat',
  implement: 'feat',
  implementing: 'feat',
  implemented: 'feat',
  introduce: 'feat',
  introducing: 'feat',
  introduced: 'feat',
  fix: 'fix',
  fixing: 'fix',
  fixed: 'fix',
  resolve: 'fix',
  resolving: 'fix',
  resolved: 'fix',
  correct: 'fix',
  correcting: 'fix',
  corrected: 'fix',
  patch: 'fix',
  patching: 'fix',
  patched: 'fix',
  refactor: 'refactor',
  refactoring: 'refactor',
  refactored: 'refactor',
  restructure: 'refactor',
  restructuring: 'refactor',
  restructured: 'refactor',
  update: 'chore',
  updating: 'chore',
  updated: 'chore',
  change: 'chore',
  changing: 'chore',
  changed: 'chore',
  modify: 'chore',
  modifying: 'chore',
  modified: 'chore',
  remove: 'chore',
  removing: 'chore',
  removed: 'chore',
  delete: 'chore',
  deleting: 'chore',
  deleted: 'chore',
  improve: 'perf',
  improving: 'perf',
  improved: 'perf',
  optimize: 'perf',
  optimizing: 'perf',
  optimized: 'perf',
  document: 'docs',
  documenting: 'docs',
  documented: 'docs',
};

/**
 * Attempts to infer a commit type from the subject text
 * @param subject - Commit subject
 * @returns Inferred type or null
 */
function inferTypeFromSubject(subject: string): string | null {
  const firstWord = subject.trim().toLowerCase().split(/\s+/)[0];
  if (!firstWord) return null;

  return VERB_TO_TYPE_MAP[firstWord] ?? null;
}

/**
 * Fixes the case of a subject according to configuration
 * @param subject - Subject to fix
 * @param targetCase - Target case format
 * @returns Fixed subject
 */
function fixSubjectCase(subject: string, targetCase: 'lower' | 'sentence' | 'any'): string {
  if (targetCase === 'any' || !subject) return subject;

  const firstChar = subject.charAt(0);
  const rest = subject.slice(1);

  if (targetCase === 'lower') {
    return firstChar.toLowerCase() + rest;
  } else {
    return firstChar.toUpperCase() + rest;
  }
}

/**
 * Wraps text to specified line length
 * @param text - Text to wrap
 * @param maxLength - Maximum line length
 * @returns Wrapped text
 */
function wrapText(text: string, maxLength: number): string {
  const lines: string[] = [];
  const paragraphs = text.split('\n\n');

  for (const paragraph of paragraphs) {
    const existingLines = paragraph.split('\n');

    for (const line of existingLines) {
      if (line.length <= maxLength) {
        lines.push(line);
        continue;
      }

      // Wrap line
      const words = line.split(' ');
      let currentLine = '';

      for (const word of words) {
        if (currentLine.length === 0) {
          currentLine = word;
        } else if (currentLine.length + word.length + 1 <= maxLength) {
          currentLine += ` ${word}`;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }

      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
    }

    // Add blank line between paragraphs (except after last)
    if (paragraph !== paragraphs[paragraphs.length - 1]) {
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Attempts to auto-fix common commit message issues
 * @param message - Raw commit message
 * @param options - Auto-fix options
 * @returns Fixed commit message or null if no fix possible
 */
export function autofixCommit(message: string, options: AutoFixOptions = {}): string | null {
  const config = ConfigSchema.parse(options.config ?? {});
  const parsed = parseCommitMessage(message);

  let modified = false;
  const fixed: ParsedCommit = { ...parsed };

  // Infer type if missing and requested
  if (options.inferType && !fixed.type && fixed.subject) {
    const inferredType = inferTypeFromSubject(fixed.subject);
    if (inferredType) {
      fixed.type = inferredType;
      modified = true;
    }
  }

  // Fix subject case
  if (options.fixCase && fixed.subject) {
    const fixedSubject = fixSubjectCase(fixed.subject, config.subjectCase);
    if (fixedSubject !== fixed.subject) {
      fixed.subject = fixedSubject;
      modified = true;
    }
  }

  // Fix trailing period
  if (options.fixTrailingPeriod && fixed.subject?.endsWith('.')) {
    fixed.subject = fixed.subject.slice(0, -1);
    modified = true;
  }

  // Wrap body lines if requested
  if (options.wrapLines && fixed.body) {
    const wrappedBody = wrapText(fixed.body, config.maxLineLength);
    if (wrappedBody !== fixed.body) {
      fixed.body = wrappedBody;
      modified = true;
    }
  }

  // Truncate header if too long
  if (fixed.header.length > config.maxHeaderLength && fixed.subject) {
    const headerPrefix = fixed.type
      ? `${fixed.type}${fixed.scope ? `(${fixed.scope})` : ''}${fixed.isBreaking ? '!' : ''}: `
      : '';
    const availableLength = config.maxHeaderLength - headerPrefix.length;

    if (availableLength > 10) {
      // Truncate subject and add ellipsis
      fixed.subject = `${fixed.subject.slice(0, availableLength - 3)}...`;
      modified = true;
    }
  }

  if (!modified) {
    return null;
  }

  return reconstructCommitMessage(fixed);
}

/**
 * Gets a suggested fix for a commit message with all options enabled
 * @param message - Raw commit message
 * @param config - Optional configuration
 * @returns Suggested fix or null
 */
export function suggestFix(message: string, config?: Partial<Config>): string | null {
  return autofixCommit(message, {
    inferType: true,
    fixCase: true,
    fixTrailingPeriod: true,
    wrapLines: true,
    config,
  });
}
