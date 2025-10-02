import { describe, it, expect } from 'vitest';
import { autofixCommit, suggestFix } from './autofix';
import type { AutoFixOptions, Config } from './types';

describe('autofixCommit', () => {
  describe('type inference', () => {
    it('should infer "feat" from "add"', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('add new feature', options);

      expect(result).toBe('feat: add new feature');
    });

    it('should infer "feat" from "adding"', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('adding new feature', options);

      expect(result).toBe('feat: adding new feature');
    });

    it('should infer "feat" from "create"', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('create user profile', options);

      expect(result).toBe('feat: create user profile');
    });

    it('should infer "feat" from "implement"', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('implement authentication', options);

      expect(result).toBe('feat: implement authentication');
    });

    it('should infer "fix" from "fix"', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('fix login bug', options);

      expect(result).toBe('fix: fix login bug');
    });

    it('should infer "fix" from "resolve"', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('resolve memory leak', options);

      expect(result).toBe('fix: resolve memory leak');
    });

    it('should infer "fix" from "correct"', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('correct validation logic', options);

      expect(result).toBe('fix: correct validation logic');
    });

    it('should infer "refactor" from "refactor"', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('refactor authentication module', options);

      expect(result).toBe('refactor: refactor authentication module');
    });

    it('should infer "refactor" from "restructure"', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('restructure API layer', options);

      expect(result).toBe('refactor: restructure API layer');
    });

    it('should infer "chore" from "update"', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('update dependencies', options);

      expect(result).toBe('chore: update dependencies');
    });

    it('should infer "chore" from "remove"', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('remove unused code', options);

      expect(result).toBe('chore: remove unused code');
    });

    it('should infer "perf" from "optimize"', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('optimize query performance', options);

      expect(result).toBe('perf: optimize query performance');
    });

    it('should infer "docs" from "document"', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('document API endpoints', options);

      expect(result).toBe('docs: document API endpoints');
    });

    it('should not infer type when already present', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('feat: add feature', options);

      expect(result).toBeNull();
    });

    it('should not infer type when verb is unknown', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('something random here', options);

      expect(result).toBeNull();
    });

    it('should handle case-insensitive verb matching', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('Add new feature', options);

      expect(result).toBe('feat: Add new feature');
    });

    it('should handle past tense verbs', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('fixed the bug', options);

      expect(result).toBe('fix: fixed the bug');
    });
  });

  describe('subject case fixing', () => {
    it('should fix to lowercase when configured', () => {
      const options: AutoFixOptions = {
        fixCase: true,
        config: { subjectCase: 'lower' },
      };
      const result = autofixCommit('feat: Add feature', options);

      expect(result).toBe('feat: add feature');
    });

    it('should fix to sentence case when configured', () => {
      const options: AutoFixOptions = {
        fixCase: true,
        config: { subjectCase: 'sentence' },
      };
      const result = autofixCommit('feat: add feature', options);

      expect(result).toBe('feat: Add feature');
    });

    it('should not modify when case is already correct', () => {
      const options: AutoFixOptions = {
        fixCase: true,
        config: { subjectCase: 'lower' },
      };
      const result = autofixCommit('feat: add feature', options);

      expect(result).toBeNull();
    });

    it('should not modify when case is "any"', () => {
      const options: AutoFixOptions = {
        fixCase: true,
        config: { subjectCase: 'any' },
      };
      const result = autofixCommit('feat: Add Feature', options);

      expect(result).toBeNull();
    });

    it('should preserve rest of subject when fixing case', () => {
      const options: AutoFixOptions = {
        fixCase: true,
        config: { subjectCase: 'lower' },
      };
      const result = autofixCommit('feat: Add NEW Feature', options);

      expect(result).toBe('feat: add NEW Feature');
    });

    it('should handle single character subjects', () => {
      const options: AutoFixOptions = {
        fixCase: true,
        config: { subjectCase: 'lower' },
      };
      const result = autofixCommit('feat: A', options);

      expect(result).toBe('feat: a');
    });

    it('should handle empty subject gracefully', () => {
      const options: AutoFixOptions = { fixCase: true };
      const result = autofixCommit('feat: ', options);

      expect(result).toBeNull();
    });
  });

  describe('trailing period fixing', () => {
    it('should remove trailing period', () => {
      const options: AutoFixOptions = { fixTrailingPeriod: true };
      const result = autofixCommit('feat: add feature.', options);

      expect(result).toBe('feat: add feature');
    });

    it('should not modify when no trailing period', () => {
      const options: AutoFixOptions = { fixTrailingPeriod: true };
      const result = autofixCommit('feat: add feature', options);

      expect(result).toBeNull();
    });

    it('should handle multiple trailing periods', () => {
      const options: AutoFixOptions = { fixTrailingPeriod: true };
      const result = autofixCommit('feat: add feature...', options);

      // Should only remove one period
      expect(result).toBe('feat: add feature..');
    });

    it('should preserve periods in middle of subject', () => {
      const options: AutoFixOptions = { fixTrailingPeriod: true };
      const result = autofixCommit('feat: add v1.0 support.', options);

      expect(result).toBe('feat: add v1.0 support');
    });

    it('should work with scope', () => {
      const options: AutoFixOptions = { fixTrailingPeriod: true };
      const result = autofixCommit('feat(api): add endpoint.', options);

      expect(result).toBe('feat(api): add endpoint');
    });
  });

  describe('body line wrapping', () => {
    it('should wrap long body lines', () => {
      const longLine = 'a'.repeat(150);
      const message = `feat: add\n\n${longLine}`;
      const options: AutoFixOptions = { wrapLines: true };
      const result = autofixCommit(message, options);

      expect(result).not.toBeNull();
      expect(result).not.toContain(longLine);
      // Should be wrapped at default 100 chars
      const lines = result!.split('\n');
      const bodyLines = lines.slice(2);
      bodyLines.forEach((line) => {
        expect(line.length).toBeLessThanOrEqual(100);
      });
    });

    it('should not modify short body lines', () => {
      const message = 'feat: add\n\nShort line';
      const options: AutoFixOptions = { wrapLines: true };
      const result = autofixCommit(message, options);

      expect(result).toBeNull();
    });

    it('should respect custom max line length', () => {
      const longLine = 'a'.repeat(80);
      const message = `feat: add\n\n${longLine}`;
      const options: AutoFixOptions = {
        wrapLines: true,
        config: { maxLineLength: 50 },
      };
      const result = autofixCommit(message, options);

      expect(result).not.toBeNull();
      const lines = result!.split('\n');
      const bodyLines = lines.slice(2);
      bodyLines.forEach((line) => {
        expect(line.length).toBeLessThanOrEqual(50);
      });
    });

    it('should preserve paragraph structure', () => {
      const message = 'feat: add\n\nFirst paragraph.\n\nSecond paragraph.';
      const options: AutoFixOptions = { wrapLines: true };
      const result = autofixCommit(message, options);

      // Short lines, should not be modified
      expect(result).toBeNull();
    });

    it('should wrap multiple long lines', () => {
      const longLine1 = 'a'.repeat(150);
      const longLine2 = 'b'.repeat(150);
      const message = `feat: add\n\n${longLine1}\n${longLine2}`;
      const options: AutoFixOptions = { wrapLines: true };
      const result = autofixCommit(message, options);

      expect(result).not.toBeNull();
      const lines = result!.split('\n');
      lines.slice(2).forEach((line) => {
        expect(line.length).toBeLessThanOrEqual(100);
      });
    });

    it('should handle body with no wrapping needed', () => {
      const message = 'feat: add\n\nNormal line\nAnother line';
      const options: AutoFixOptions = { wrapLines: true };
      const result = autofixCommit(message, options);

      expect(result).toBeNull();
    });

    it('should preserve footer when wrapping body', () => {
      const longLine = 'a'.repeat(150);
      const message = `feat: add\n\n${longLine}\n\nCloses: #123`;
      const options: AutoFixOptions = { wrapLines: true };
      const result = autofixCommit(message, options);

      expect(result).toContain('Closes: #123');
    });
  });

  describe('header truncation', () => {
    it('should truncate long header', () => {
      const longSubject = 'a'.repeat(100);
      const message = `feat: ${longSubject}`;
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit(message, options);

      expect(result).not.toBeNull();
      expect(result!.split('\n')[0]!.length).toBeLessThanOrEqual(72);
      expect(result).toContain('...');
    });

    it('should not truncate short header', () => {
      const message = 'feat: add feature';
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit(message, options);

      expect(result).toBeNull();
    });

    it('should respect custom max header length', () => {
      const longSubject = 'a'.repeat(80);
      const message = `feat: ${longSubject}`;
      const options: AutoFixOptions = {
        inferType: true,
        config: { maxHeaderLength: 50 },
      };
      const result = autofixCommit(message, options);

      expect(result).not.toBeNull();
      expect(result!.split('\n')[0]!.length).toBeLessThanOrEqual(50);
    });

    it('should account for scope in truncation', () => {
      const longSubject = 'a'.repeat(100);
      const message = `feat(scope): ${longSubject}`;
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit(message, options);

      expect(result).not.toBeNull();
      expect(result).toContain('(scope)');
      expect(result!.split('\n')[0]!.length).toBeLessThanOrEqual(72);
    });

    it('should account for breaking change marker in truncation', () => {
      const longSubject = 'a'.repeat(100);
      const message = `feat!: ${longSubject}`;
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit(message, options);

      expect(result).not.toBeNull();
      expect(result).toContain('feat!');
      expect(result!.split('\n')[0]!.length).toBeLessThanOrEqual(72);
    });

    it('should not truncate if not enough space left', () => {
      const message = 'feat(very-long-scope-name): abc';
      const options: AutoFixOptions = {
        inferType: true,
        config: { maxHeaderLength: 20 },
      };
      // Should not truncate since available length would be < 10
      const result = autofixCommit(message, options);

      expect(result).toBeNull();
    });
  });

  describe('combined fixes', () => {
    it('should apply multiple fixes together', () => {
      const options: AutoFixOptions = {
        inferType: true,
        fixCase: true,
        fixTrailingPeriod: true,
        config: { subjectCase: 'lower' },
      };
      const result = autofixCommit('Add New Feature.', options);

      expect(result).toBe('feat: add New Feature');
    });

    it('should fix case and remove period', () => {
      const options: AutoFixOptions = {
        fixCase: true,
        fixTrailingPeriod: true,
        config: { subjectCase: 'lower' },
      };
      const result = autofixCommit('feat: Add feature.', options);

      expect(result).toBe('feat: add feature');
    });

    it('should infer type and fix case', () => {
      const options: AutoFixOptions = {
        inferType: true,
        fixCase: true,
        config: { subjectCase: 'lower' },
      };
      const result = autofixCommit('Add New Feature', options);

      expect(result).toBe('feat: add New Feature');
    });

    it('should apply all fixes with body wrapping', () => {
      const longLine = 'a'.repeat(150);
      const message = `Add Feature.\n\n${longLine}`;
      const options: AutoFixOptions = {
        inferType: true,
        fixCase: true,
        fixTrailingPeriod: true,
        wrapLines: true,
        config: { subjectCase: 'lower' },
      };
      const result = autofixCommit(message, options);

      expect(result).not.toBeNull();
      expect(result).toContain('feat: add Feature');
      const lines = result!.split('\n');
      lines.slice(2).forEach((line) => {
        expect(line.length).toBeLessThanOrEqual(100);
      });
    });

    it('should preserve body and footer when fixing header', () => {
      const message = 'Add Feature.\n\nBody text\n\nFooter: value';
      const options: AutoFixOptions = {
        inferType: true,
        fixTrailingPeriod: true,
      };
      const result = autofixCommit(message, options);

      expect(result).toContain('Body text');
      expect(result).toContain('Footer: value');
    });

    it('should return null when no fixes needed', () => {
      const message = 'feat: add feature';
      const options: AutoFixOptions = {
        inferType: true,
        fixCase: true,
        fixTrailingPeriod: true,
        wrapLines: true,
      };
      const result = autofixCommit(message, options);

      expect(result).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle empty message', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('', options);

      expect(result).toBeNull();
    });

    it('should handle whitespace-only message', () => {
      const options: AutoFixOptions = { inferType: true };
      const result = autofixCommit('   \n\n   ', options);

      expect(result).toBeNull();
    });

    it('should handle message with only type', () => {
      const options: AutoFixOptions = { fixTrailingPeriod: true };
      const result = autofixCommit('feat:', options);

      expect(result).toBeNull();
    });

    it('should handle non-conventional commit without fixes', () => {
      const options: AutoFixOptions = { fixTrailingPeriod: true };
      const result = autofixCommit('Random commit message', options);

      expect(result).toBeNull();
    });

    it('should handle commit with breaking change marker', () => {
      const options: AutoFixOptions = { fixTrailingPeriod: true };
      const result = autofixCommit('feat!: add feature.', options);

      expect(result).toBe('feat!: add feature');
    });

    it('should handle scope with special characters', () => {
      const options: AutoFixOptions = { fixTrailingPeriod: true };
      const result = autofixCommit('feat(api-v2): add endpoint.', options);

      expect(result).toBe('feat(api-v2): add endpoint');
    });

    it('should handle very long body without wrapping option', () => {
      const longLine = 'a'.repeat(200);
      const message = `feat: add\n\n${longLine}`;
      const options: AutoFixOptions = { fixTrailingPeriod: true };
      const result = autofixCommit(message, options);

      expect(result).toBeNull();
    });

    it('should preserve exact spacing in reconstructed message', () => {
      const message = 'feat: add feature\n\n  Indented body';
      const options: AutoFixOptions = { fixTrailingPeriod: true };
      const result = autofixCommit(message, options);

      expect(result).toBeNull();
    });
  });
});

describe('suggestFix', () => {
  it('should enable all fix options', () => {
    const result = suggestFix('Add new feature.');

    expect(result).toBe('feat: add new feature');
  });

  it('should infer type', () => {
    const result = suggestFix('fix the bug');

    expect(result).toBe('fix: fix the bug');
  });

  it('should fix case to lowercase by default', () => {
    const result = suggestFix('feat: Add Feature');

    expect(result).toBe('feat: add Feature');
  });

  it('should remove trailing period', () => {
    const result = suggestFix('feat: add feature.');

    expect(result).toBe('feat: add feature');
  });

  it('should wrap long body lines', () => {
    const longLine = 'a'.repeat(150);
    const message = `feat: add\n\n${longLine}`;
    const result = suggestFix(message);

    expect(result).not.toBeNull();
    const lines = result!.split('\n');
    lines.slice(2).forEach((line) => {
      expect(line.length).toBeLessThanOrEqual(100);
    });
  });

  it('should accept custom config', () => {
    const config: Partial<Config> = {
      subjectCase: 'sentence',
      maxLineLength: 80,
    };
    const result = suggestFix('add feature', config);

    expect(result).toBe('feat: Add feature');
  });

  it('should apply all fixes at once', () => {
    const longLine = 'a'.repeat(150);
    const message = `Add New Feature.\n\n${longLine}`;
    const result = suggestFix(message);

    expect(result).not.toBeNull();
    expect(result).toContain('feat: add New Feature');
  });

  it('should return null when no fixes needed', () => {
    const message = 'feat: add feature';
    const result = suggestFix(message);

    expect(result).toBeNull();
  });

  it('should handle non-conventional commits', () => {
    const result = suggestFix('random commit');

    expect(result).toBeNull();
  });

  it('should preserve body and footer', () => {
    const message = 'Add feature.\n\nBody\n\nFooter: value';
    const result = suggestFix(message);

    expect(result).toContain('Body');
    expect(result).toContain('Footer: value');
  });
});
