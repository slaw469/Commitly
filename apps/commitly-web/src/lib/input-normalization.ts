// Input normalization utilities for commit messages
// Handles edge cases from pasting, copying, and various text sources

/**
 * Zero-width characters that should be removed from commit messages
 * These are invisible characters that can cause validation issues
 */
const ZERO_WIDTH_CHARS = [
  '\u200B', // Zero Width Space
  '\u200C', // Zero Width Non-Joiner
  '\u200D', // Zero Width Joiner
  '\uFEFF', // Zero Width No-Break Space (BOM)
  '\u2060', // Word Joiner
  '\u180E', // Mongolian Vowel Separator
] as const;

/**
 * Creates a regex pattern to match zero-width characters
 */
function createZeroWidthRegex(): RegExp {
  const escaped = ZERO_WIDTH_CHARS.map((char) => 
    `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`
  );
  return new RegExp(`[${escaped.join('')}]`, 'g');
}

const ZERO_WIDTH_REGEX = createZeroWidthRegex();

/**
 * Remove BOM (Byte Order Mark) from start of string
 * BOM is often added by Windows editors and can cause issues
 */
export function removeBOM(input: string): string {
  if (input.charCodeAt(0) === 0xFEFF) {
    return input.slice(1);
  }
  return input;
}

/**
 * Remove all zero-width characters from string
 * These are invisible characters that can cause validation issues
 */
export function removeZeroWidthChars(input: string): string {
  return input.replace(ZERO_WIDTH_REGEX, '');
}

/**
 * Convert all line endings to LF (\n)
 * Handles CRLF (\r\n) and CR (\r) from different platforms
 */
export function normalizLineEndings(input: string): string {
  return input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Remove leading markdown quote characters from each line
 * Common when pasting from markdown, GitHub, or formatted text
 * 
 * Removes:
 * - Leading `> ` (markdown quote)
 * - Leading `| ` (table or quote)
 * - Combination of both
 */
export function removeMarkdownLeaders(input: string): string {
  return input
    .split('\n')
    .map((line) => {
      // Remove leading > and | characters (with optional space after)
      return line.replace(/^[>|]\s?/, '');
    })
    .join('\n');
}

/**
 * Trim excess whitespace while preserving intentional formatting
 * - Remove trailing whitespace from each line
 * - Remove leading/trailing empty lines
 * - Preserve blank lines within the message (for body separation)
 */
export function trimExcessWhitespace(input: string): string {
  const lines = input.split('\n');
  
  // Remove trailing whitespace from each line
  const trimmedLines = lines.map((line) => line.trimEnd());
  
  // Find first non-empty line
  let start = 0;
  while (start < trimmedLines.length && trimmedLines[start]?.trim() === '') {
    start++;
  }
  
  // Find last non-empty line
  let end = trimmedLines.length - 1;
  while (end >= 0 && trimmedLines[end]?.trim() === '') {
    end--;
  }
  
  // Return trimmed content
  if (start > end) {
    return ''; // All lines were empty
  }
  
  return trimmedLines.slice(start, end + 1).join('\n');
}

/**
 * Remove multiple consecutive blank lines
 * Reduces 3+ consecutive blank lines to 2 (for readability)
 */
export function collapseExcessiveBlankLines(input: string): string {
  return input.replace(/\n{3,}/g, '\n\n');
}

/**
 * Comprehensive normalization of commit message input
 * Applies all normalization steps in the correct order
 * 
 * This function is idempotent - running it multiple times
 * produces the same result
 * 
 * @param input - Raw commit message input
 * @param options - Normalization options
 * @returns Normalized commit message
 */
export function normalizeCommitMessage(
  input: string,
  options: {
    removeBOM?: boolean;
    removeZeroWidth?: boolean;
    normalizeLineEndings?: boolean;
    removeMarkdown?: boolean;
    trimWhitespace?: boolean;
    collapseBlankLines?: boolean;
  } = {}
): string {
  const {
    removeBOM: shouldRemoveBOM = true,
    removeZeroWidth: shouldRemoveZeroWidth = true,
    normalizeLineEndings: shouldNormalizeLineEndings = true,
    removeMarkdown: shouldRemoveMarkdown = true,
    trimWhitespace: shouldTrimWhitespace = true,
    collapseBlankLines: shouldCollapseBlankLines = true,
  } = options;

  let normalized = input;

  // Step 1: Remove BOM if present
  if (shouldRemoveBOM) {
    normalized = removeBOM(normalized);
  }

  // Step 2: Remove zero-width characters
  if (shouldRemoveZeroWidth) {
    normalized = removeZeroWidthChars(normalized);
  }

  // Step 3: Normalize line endings to LF
  if (shouldNormalizeLineEndings) {
    normalized = normalizLineEndings(normalized);
  }

  // Step 4: Remove markdown leaders (>, |)
  if (shouldRemoveMarkdown) {
    normalized = removeMarkdownLeaders(normalized);
  }

  // Step 5: Collapse excessive blank lines
  if (shouldCollapseBlankLines) {
    normalized = collapseExcessiveBlankLines(normalized);
  }

  // Step 6: Trim excess whitespace (should be last)
  if (shouldTrimWhitespace) {
    normalized = trimExcessWhitespace(normalized);
  }

  return normalized;
}

/**
 * Check if input contains any zero-width characters
 * Useful for warnings or debugging
 */
export function containsZeroWidthChars(input: string): boolean {
  return ZERO_WIDTH_REGEX.test(input);
}

/**
 * Check if input contains BOM
 */
export function containsBOM(input: string): boolean {
  return input.charCodeAt(0) === 0xFEFF;
}

/**
 * Check if input contains CRLF line endings
 */
export function containsCRLF(input: string): boolean {
  return input.includes('\r\n');
}

/**
 * Check if input contains markdown leaders
 */
export function containsMarkdownLeaders(input: string): boolean {
  return /^[>|]\s?/m.test(input);
}

/**
 * Get normalization statistics for debugging
 */
export function getNormalizationStats(input: string): {
  hasBOM: boolean;
  hasZeroWidth: boolean;
  hasCRLF: boolean;
  hasMarkdown: boolean;
  originalLength: number;
  lineCount: number;
  blankLines: number;
} {
  const lines = input.split('\n');
  return {
    hasBOM: containsBOM(input),
    hasZeroWidth: containsZeroWidthChars(input),
    hasCRLF: containsCRLF(input),
    hasMarkdown: containsMarkdownLeaders(input),
    originalLength: input.length,
    lineCount: lines.length,
    blankLines: lines.filter((line) => line.trim() === '').length,
  };
}

