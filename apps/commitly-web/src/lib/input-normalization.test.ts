// Unit tests for input normalization utilities
// Comprehensive coverage of all edge cases

import { describe, it, expect } from 'vitest';
import {
  removeBOM,
  removeZeroWidthChars,
  normalizLineEndings,
  removeMarkdownLeaders,
  trimExcessWhitespace,
  collapseExcessiveBlankLines,
  normalizeCommitMessage,
  containsZeroWidthChars,
  containsBOM,
  containsCRLF,
  containsMarkdownLeaders,
  getNormalizationStats,
} from './input-normalization';

describe('removeBOM', () => {
  it('should remove BOM from start of string', () => {
    const input = '\uFEFFfeat: add new feature';
    const expected = 'feat: add new feature';
    expect(removeBOM(input)).toBe(expected);
  });

  it('should return string unchanged if no BOM', () => {
    const input = 'feat: add new feature';
    expect(removeBOM(input)).toBe(input);
  });

  it('should only remove BOM from start, not middle or end', () => {
    const input = 'feat: add \uFEFFnew feature';
    expect(removeBOM(input)).toBe(input);
  });

  it('should handle empty string', () => {
    expect(removeBOM('')).toBe('');
  });
});

describe('removeZeroWidthChars', () => {
  it('should remove zero-width space', () => {
    const input = 'feat:\u200Badd feature';
    const expected = 'feat:add feature';
    expect(removeZeroWidthChars(input)).toBe(expected);
  });

  it('should remove zero-width non-joiner', () => {
    const input = 'feat:\u200Cadd feature';
    const expected = 'feat:add feature';
    expect(removeZeroWidthChars(input)).toBe(expected);
  });

  it('should remove zero-width joiner', () => {
    const input = 'feat:\u200Dadd feature';
    const expected = 'feat:add feature';
    expect(removeZeroWidthChars(input)).toBe(expected);
  });

  it('should remove BOM as zero-width char', () => {
    const input = 'feat:\uFEFFadd feature';
    const expected = 'feat:add feature';
    expect(removeZeroWidthChars(input)).toBe(expected);
  });

  it('should remove multiple zero-width chars', () => {
    const input = 'feat:\u200B\u200C\u200Dadd feature';
    const expected = 'feat:add feature';
    expect(removeZeroWidthChars(input)).toBe(expected);
  });

  it('should return string unchanged if no zero-width chars', () => {
    const input = 'feat: add feature';
    expect(removeZeroWidthChars(input)).toBe(input);
  });

  it('should handle empty string', () => {
    expect(removeZeroWidthChars('')).toBe('');
  });
});

describe('normalizLineEndings', () => {
  it('should convert CRLF to LF', () => {
    const input = 'feat: add feature\r\n\r\nThis is the body';
    const expected = 'feat: add feature\n\nThis is the body';
    expect(normalizLineEndings(input)).toBe(expected);
  });

  it('should convert CR to LF', () => {
    const input = 'feat: add feature\r\rThis is the body';
    const expected = 'feat: add feature\n\nThis is the body';
    expect(normalizLineEndings(input)).toBe(expected);
  });

  it('should handle mixed line endings', () => {
    const input = 'feat: add feature\r\nLine 2\rLine 3\nLine 4';
    const expected = 'feat: add feature\nLine 2\nLine 3\nLine 4';
    expect(normalizLineEndings(input)).toBe(expected);
  });

  it('should return string unchanged if already LF', () => {
    const input = 'feat: add feature\n\nThis is the body';
    expect(normalizLineEndings(input)).toBe(input);
  });

  it('should handle empty string', () => {
    expect(normalizLineEndings('')).toBe('');
  });
});

describe('removeMarkdownLeaders', () => {
  it('should remove leading > from single line', () => {
    const input = '> feat: add feature';
    const expected = 'feat: add feature';
    expect(removeMarkdownLeaders(input)).toBe(expected);
  });

  it('should remove leading | from single line', () => {
    const input = '| feat: add feature';
    const expected = 'feat: add feature';
    expect(removeMarkdownLeaders(input)).toBe(expected);
  });

  it('should remove leading > with space', () => {
    const input = '> feat: add feature';
    const expected = 'feat: add feature';
    expect(removeMarkdownLeaders(input)).toBe(expected);
  });

  it('should remove leading | with space', () => {
    const input = '| feat: add feature';
    const expected = 'feat: add feature';
    expect(removeMarkdownLeaders(input)).toBe(expected);
  });

  it('should remove from all lines', () => {
    const input = '> feat: add feature\n> \n> This is the body';
    const expected = 'feat: add feature\n\nThis is the body';
    expect(removeMarkdownLeaders(input)).toBe(expected);
  });

  it('should handle mixed > and |', () => {
    const input = '> feat: add feature\n| Line 2\n> Line 3';
    const expected = 'feat: add feature\nLine 2\nLine 3';
    expect(removeMarkdownLeaders(input)).toBe(expected);
  });

  it('should not remove > or | in middle of line', () => {
    const input = 'feat: add > feature';
    expect(removeMarkdownLeaders(input)).toBe(input);
  });

  it('should handle empty lines', () => {
    const input = '> feat: add feature\n\n> body';
    const expected = 'feat: add feature\n\nbody';
    expect(removeMarkdownLeaders(input)).toBe(expected);
  });

  it('should handle string with no leaders', () => {
    const input = 'feat: add feature\n\nThis is the body';
    expect(removeMarkdownLeaders(input)).toBe(input);
  });
});

describe('trimExcessWhitespace', () => {
  it('should remove leading empty lines', () => {
    const input = '\n\nfeat: add feature';
    const expected = 'feat: add feature';
    expect(trimExcessWhitespace(input)).toBe(expected);
  });

  it('should remove trailing empty lines', () => {
    const input = 'feat: add feature\n\n';
    const expected = 'feat: add feature';
    expect(trimExcessWhitespace(input)).toBe(expected);
  });

  it('should remove trailing whitespace from lines', () => {
    const input = 'feat: add feature   \nbody line   ';
    const expected = 'feat: add feature\nbody line';
    expect(trimExcessWhitespace(input)).toBe(expected);
  });

  it('should preserve blank lines within content', () => {
    const input = 'feat: add feature\n\nThis is the body';
    const expected = 'feat: add feature\n\nThis is the body';
    expect(trimExcessWhitespace(input)).toBe(expected);
  });

  it('should handle all empty string', () => {
    const input = '\n\n\n';
    const expected = '';
    expect(trimExcessWhitespace(input)).toBe(expected);
  });

  it('should handle string with only whitespace', () => {
    const input = '   \n   \n   ';
    const expected = '';
    expect(trimExcessWhitespace(input)).toBe(expected);
  });
});

describe('collapseExcessiveBlankLines', () => {
  it('should reduce 3 blank lines to 2', () => {
    const input = 'feat: add feature\n\n\nThis is the body';
    const expected = 'feat: add feature\n\nThis is the body';
    expect(collapseExcessiveBlankLines(input)).toBe(expected);
  });

  it('should reduce 5 blank lines to 2', () => {
    const input = 'feat: add feature\n\n\n\n\nThis is the body';
    const expected = 'feat: add feature\n\nThis is the body';
    expect(collapseExcessiveBlankLines(input)).toBe(expected);
  });

  it('should preserve 2 blank lines', () => {
    const input = 'feat: add feature\n\nThis is the body';
    expect(collapseExcessiveBlankLines(input)).toBe(input);
  });

  it('should preserve single blank line', () => {
    const input = 'feat: add feature\nThis is the body';
    expect(collapseExcessiveBlankLines(input)).toBe(input);
  });

  it('should handle multiple excessive blank line sections', () => {
    const input = 'feat\n\n\nbody\n\n\n\nfooter';
    const expected = 'feat\n\nbody\n\nfooter';
    expect(collapseExcessiveBlankLines(input)).toBe(expected);
  });
});

describe('normalizeCommitMessage', () => {
  it('should apply all normalizations by default', () => {
    const input = '\uFEFF> feat:\u200B add feature\r\n\r\n\r\n> This is the body   ';
    const expected = 'feat: add feature\n\nThis is the body';
    expect(normalizeCommitMessage(input)).toBe(expected);
  });

  it('should handle complex real-world paste', () => {
    const input = '> feat(auth): add OAuth login\r\n> \r\n> This implements Google OAuth for user authentication.\r\n> \r\n> BREAKING CHANGE: Requires new env vars   ';
    const expected = 'feat(auth): add OAuth login\n\nThis implements Google OAuth for user authentication.\n\nBREAKING CHANGE: Requires new env vars';
    expect(normalizeCommitMessage(input)).toBe(expected);
  });

  it('should respect removeBOM option', () => {
    const input = '\uFEFFfeat: add feature';
    expect(normalizeCommitMessage(input, { removeBOM: false })).toContain('\uFEFF');
    expect(normalizeCommitMessage(input, { removeBOM: true })).not.toContain('\uFEFF');
  });

  it('should respect removeZeroWidth option', () => {
    const input = 'feat:\u200Badd feature';
    expect(normalizeCommitMessage(input, { removeZeroWidth: false })).toContain('\u200B');
    expect(normalizeCommitMessage(input, { removeZeroWidth: true })).not.toContain('\u200B');
  });

  it('should respect normalizeLineEndings option', () => {
    const input = 'feat: add feature\r\nBody';
    expect(normalizeCommitMessage(input, { normalizeLineEndings: false })).toContain('\r\n');
    expect(normalizeCommitMessage(input, { normalizeLineEndings: true })).not.toContain('\r\n');
  });

  it('should respect removeMarkdown option', () => {
    const input = '> feat: add feature';
    expect(normalizeCommitMessage(input, { removeMarkdown: false })).toContain('>');
    expect(normalizeCommitMessage(input, { removeMarkdown: true })).not.toContain('>');
  });

  it('should be idempotent', () => {
    const input = '\uFEFF> feat:\u200B add feature\r\n\r\n> Body   ';
    const once = normalizeCommitMessage(input);
    const twice = normalizeCommitMessage(once);
    const thrice = normalizeCommitMessage(twice);
    expect(once).toBe(twice);
    expect(twice).toBe(thrice);
  });

  it('should handle empty string', () => {
    expect(normalizeCommitMessage('')).toBe('');
  });

  it('should preserve valid commit messages', () => {
    const input = 'feat(auth): add OAuth login\n\nThis implements Google OAuth.\n\nBREAKING CHANGE: Requires env vars';
    expect(normalizeCommitMessage(input)).toBe(input);
  });
});

describe('containsZeroWidthChars', () => {
  it('should detect zero-width space', () => {
    expect(containsZeroWidthChars('feat:\u200Badd')).toBe(true);
  });

  it('should detect BOM', () => {
    expect(containsZeroWidthChars('\uFEFFfeat')).toBe(true);
  });

  it('should return false for clean string', () => {
    expect(containsZeroWidthChars('feat: add feature')).toBe(false);
  });
});

describe('containsBOM', () => {
  it('should detect BOM at start', () => {
    expect(containsBOM('\uFEFFfeat')).toBe(true);
  });

  it('should return false if BOM not at start', () => {
    expect(containsBOM('feat\uFEFF')).toBe(false);
  });

  it('should return false for clean string', () => {
    expect(containsBOM('feat: add feature')).toBe(false);
  });
});

describe('containsCRLF', () => {
  it('should detect CRLF', () => {
    expect(containsCRLF('feat\r\nadd')).toBe(true);
  });

  it('should return false for LF only', () => {
    expect(containsCRLF('feat\nadd')).toBe(false);
  });

  it('should return false for clean string', () => {
    expect(containsCRLF('feat: add feature')).toBe(false);
  });
});

describe('containsMarkdownLeaders', () => {
  it('should detect leading >', () => {
    expect(containsMarkdownLeaders('> feat')).toBe(true);
  });

  it('should detect leading |', () => {
    expect(containsMarkdownLeaders('| feat')).toBe(true);
  });

  it('should detect in multiline', () => {
    expect(containsMarkdownLeaders('feat\n> body')).toBe(true);
  });

  it('should return false for no leaders', () => {
    expect(containsMarkdownLeaders('feat: add feature')).toBe(false);
  });

  it('should return false for > or | in middle', () => {
    expect(containsMarkdownLeaders('feat > add')).toBe(false);
  });
});

describe('getNormalizationStats', () => {
  it('should return stats for clean string', () => {
    const input = 'feat: add feature\n\nBody';
    const stats = getNormalizationStats(input);
    expect(stats).toEqual({
      hasBOM: false,
      hasZeroWidth: false,
      hasCRLF: false,
      hasMarkdown: false,
      originalLength: input.length,
      lineCount: 3,
      blankLines: 1,
    });
  });

  it('should detect all issues', () => {
    const input = '\uFEFF> feat:\u200Badd\r\n\r\n> body';
    const stats = getNormalizationStats(input);
    expect(stats.hasBOM).toBe(true);
    expect(stats.hasZeroWidth).toBe(true);
    expect(stats.hasCRLF).toBe(true);
    expect(stats.hasMarkdown).toBe(true);
    expect(stats.lineCount).toBe(3);
  });

  it('should count blank lines correctly', () => {
    const input = 'feat\n\nbody\n\n\nfooter';
    const stats = getNormalizationStats(input);
    expect(stats.blankLines).toBe(3);
  });
});

