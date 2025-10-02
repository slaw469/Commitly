import { describe, it, expect } from 'vitest';
import { validateCommit } from './validator';
import type { Config } from './types';

describe('validateCommit', () => {
  describe('type validation', () => {
    it('should pass with valid type', () => {
      const result = validateCommit('feat: add feature');
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.parsed.type).toBe('feat');
    });

    it('should fail when type is empty', () => {
      const result = validateCommit('add feature');
      
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.rule).toBe('type-empty');
      expect(result.errors[0]?.message).toContain('type is required');
    });

    it('should fail with invalid type', () => {
      const result = validateCommit('invalid: add feature');
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.rule === 'type-enum')).toBe(true);
    });

    it('should allow custom types', () => {
      const config: Partial<Config> = {
        types: ['custom', 'special'],
      };
      const result = validateCommit('custom: do something', config);
      
      expect(result.valid).toBe(true);
    });

    it('should validate all default types', () => {
      const types = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'];
      
      for (const type of types) {
        const result = validateCommit(`${type}: test`);
        expect(result.valid).toBe(true);
      }
    });
  });

  describe('scope validation', () => {
    it('should pass without scope when not required', () => {
      const result = validateCommit('feat: add feature');
      
      expect(result.valid).toBe(true);
      expect(result.parsed.scope).toBeNull();
    });

    it('should pass with scope when not required', () => {
      const result = validateCommit('feat(api): add endpoint');
      
      expect(result.valid).toBe(true);
      expect(result.parsed.scope).toBe('api');
    });

    it('should fail without scope when required', () => {
      const config: Partial<Config> = { requireScope: true };
      const result = validateCommit('feat: add feature', config);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.rule === 'scope-empty')).toBe(true);
    });

    it('should pass with scope when required', () => {
      const config: Partial<Config> = { requireScope: true };
      const result = validateCommit('feat(api): add endpoint', config);
      
      expect(result.valid).toBe(true);
    });
  });

  describe('subject validation', () => {
    it('should pass with valid subject', () => {
      const result = validateCommit('feat: add new feature');
      
      expect(result.valid).toBe(true);
      expect(result.parsed.subject).toBe('add new feature');
    });

    it('should fail with empty subject', () => {
      const result = validateCommit('feat: ');
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.rule === 'subject-empty')).toBe(true);
    });

    it('should fail with whitespace-only subject', () => {
      const result = validateCommit('feat:    ');
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.rule === 'subject-empty')).toBe(true);
    });

    it('should validate lowercase subject case', () => {
      const config: Partial<Config> = { subjectCase: 'lower' };
      const result = validateCommit('feat: add feature', config);
      
      expect(result.valid).toBe(true);
    });

    it('should fail when subject starts with uppercase (lowercase required)', () => {
      const config: Partial<Config> = { subjectCase: 'lower' };
      const result = validateCommit('feat: Add feature', config);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.rule === 'subject-case')).toBe(true);
      expect(result.errors[0]?.message).toContain('lowercase');
    });

    it('should validate sentence case subject', () => {
      const config: Partial<Config> = { subjectCase: 'sentence' };
      const result = validateCommit('feat: Add feature', config);
      
      expect(result.valid).toBe(true);
    });

    it('should fail when subject starts with lowercase (sentence case required)', () => {
      const config: Partial<Config> = { subjectCase: 'sentence' };
      const result = validateCommit('feat: add feature', config);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.rule === 'subject-case')).toBe(true);
      expect(result.errors[0]?.message).toContain('uppercase');
    });

    it('should allow any case when configured', () => {
      const config: Partial<Config> = { subjectCase: 'any' };
      
      expect(validateCommit('feat: add feature', config).valid).toBe(true);
      expect(validateCommit('feat: Add Feature', config).valid).toBe(true);
      expect(validateCommit('feat: ADD FEATURE', config).valid).toBe(true);
    });

    it('should fail with trailing period', () => {
      const result = validateCommit('feat: add feature.');
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.rule === 'subject-full-stop')).toBe(true);
      expect(result.errors[0]?.message).toContain('period');
    });

    it('should pass without trailing period', () => {
      const result = validateCommit('feat: add feature');
      
      expect(result.valid).toBe(true);
    });

    it('should allow trailing period when configured', () => {
      const config: Partial<Config> = { subjectFullStopForbidden: false };
      const result = validateCommit('feat: add feature.', config);
      
      expect(result.valid).toBe(true);
    });

    it('should fail with blocked words', () => {
      const config: Partial<Config> = { blockedWords: ['WIP', 'TODO'] };
      const result = validateCommit('feat: WIP add feature', config);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.rule === 'blocked-words')).toBe(true);
      expect(result.errors[0]?.message).toContain('WIP');
    });

    it('should detect blocked words case-insensitively', () => {
      const config: Partial<Config> = { blockedWords: ['WIP'] };
      const result = validateCommit('feat: wip add feature', config);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.rule === 'blocked-words')).toBe(true);
    });

    it('should pass without blocked words', () => {
      const config: Partial<Config> = { blockedWords: ['WIP', 'TODO'] };
      const result = validateCommit('feat: add feature', config);
      
      expect(result.valid).toBe(true);
    });
  });

  describe('header length validation', () => {
    it('should pass with header under max length', () => {
      const result = validateCommit('feat: add feature');
      
      expect(result.valid).toBe(true);
      expect(result.parsed.header.length).toBeLessThanOrEqual(72);
    });

    it('should fail with header over max length', () => {
      const longSubject = 'a'.repeat(100);
      const result = validateCommit(`feat: ${longSubject}`);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.rule === 'header-max-length')).toBe(true);
      expect(result.errors[0]?.message).toContain('72');
    });

    it('should respect custom max header length', () => {
      const config: Partial<Config> = { maxHeaderLength: 50 };
      const result = validateCommit('feat: this is a moderately long subject line here', config);
      
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('50');
    });

    it('should handle exactly max length', () => {
      // 'feat: ' = 6 chars, so 66 more chars to hit 72
      const subject = 'a'.repeat(66);
      const result = validateCommit(`feat: ${subject}`);
      
      expect(result.valid).toBe(true);
      expect(result.parsed.header.length).toBe(72);
    });

    it('should fail at max length + 1', () => {
      const subject = 'a'.repeat(67);
      const result = validateCommit(`feat: ${subject}`);
      
      expect(result.valid).toBe(false);
    });
  });

  describe('body validation', () => {
    it('should pass with no body', () => {
      const result = validateCommit('feat: add feature');
      
      expect(result.valid).toBe(true);
      expect(result.parsed.body).toBeNull();
    });

    it('should pass with valid body', () => {
      const message = 'feat: add feature\n\nThis is the body text.';
      const result = validateCommit(message);
      
      expect(result.valid).toBe(true);
      expect(result.parsed.body).toBe('This is the body text.');
    });

    it('should warn when body is not separated by blank line', () => {
      const message = 'feat: add feature\nThis is the body';
      const result = validateCommit(message);
      
      expect(result.warnings.some(w => w.rule === 'body-leading-blank')).toBe(true);
    });

    it('should pass when body has leading blank line', () => {
      const message = 'feat: add feature\n\nThis is the body';
      const result = validateCommit(message);
      
      expect(result.warnings.filter(w => w.rule === 'body-leading-blank')).toHaveLength(0);
    });

    it('should warn when body line exceeds max length', () => {
      const longLine = 'a'.repeat(150);
      const message = `feat: add feature\n\n${longLine}`;
      const result = validateCommit(message);
      
      expect(result.warnings.some(w => w.rule === 'body-max-line-length')).toBe(true);
    });

    it('should pass with body lines under max length', () => {
      const message = 'feat: add feature\n\nShort line\nAnother short line';
      const result = validateCommit(message);
      
      expect(result.warnings.filter(w => w.rule === 'body-max-line-length')).toHaveLength(0);
    });

    it('should allow custom max line length', () => {
      const config: Partial<Config> = { maxLineLength: 50 };
      const line = 'a'.repeat(60);
      const message = `feat: add\n\n${line}`;
      const result = validateCommit(message, config);
      
      expect(result.warnings.some(w => w.rule === 'body-max-line-length')).toBe(true);
      expect(result.warnings[0]?.message).toContain('50');
    });

    it('should handle multi-line body with various lengths', () => {
      const shortLine = 'Short line';
      const longLine = 'a'.repeat(150);
      const message = `feat: add\n\n${shortLine}\n${longLine}\n${shortLine}`;
      const result = validateCommit(message);
      
      // Should only warn about the long line
      const warnings = result.warnings.filter(w => w.rule === 'body-max-line-length');
      expect(warnings.length).toBe(1);
    });

    it('should allow disabling leading blank check', () => {
      const config: Partial<Config> = { bodyLeadingBlank: false };
      const message = 'feat: add feature\nThis is the body';
      const result = validateCommit(message, config);
      
      expect(result.warnings.filter(w => w.rule === 'body-leading-blank')).toHaveLength(0);
    });
  });

  describe('footer validation', () => {
    it('should pass with no footer', () => {
      const result = validateCommit('feat: add feature');
      
      expect(result.valid).toBe(true);
      expect(result.parsed.footer).toBeNull();
    });

    it('should pass with valid footer', () => {
      const message = 'feat: add feature\n\nBody text\n\nCloses: #123';
      const result = validateCommit(message);
      
      expect(result.valid).toBe(true);
      expect(result.parsed.footer).toContain('Closes: #123');
    });

    it('should warn when footer is not separated by blank line', () => {
      const message = 'feat: add\n\nBody\nCloses: #123';
      const result = validateCommit(message);
      
      expect(result.warnings.some(w => w.rule === 'footer-leading-blank')).toBe(true);
    });

    it('should pass when footer has leading blank line', () => {
      const message = 'feat: add\n\nBody\n\nCloses: #123';
      const result = validateCommit(message);
      
      expect(result.warnings.filter(w => w.rule === 'footer-leading-blank')).toHaveLength(0);
    });

    it('should allow disabling footer leading blank check', () => {
      const config: Partial<Config> = { footerLeadingBlank: false };
      const message = 'feat: add\n\nBody\nCloses: #123';
      const result = validateCommit(message, config);
      
      expect(result.warnings.filter(w => w.rule === 'footer-leading-blank')).toHaveLength(0);
    });

    it('should handle BREAKING CHANGE footer', () => {
      const message = 'feat: add\n\nBREAKING CHANGE: API changed';
      const result = validateCommit(message);
      
      expect(result.valid).toBe(true);
      expect(result.parsed.isBreaking).toBe(true);
    });
  });

  describe('complex scenarios', () => {
    it('should handle multiple errors', () => {
      const longSubject = 'a'.repeat(100);
      const result = validateCommit(`invalid: ${longSubject}.`);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors.some(e => e.rule === 'type-enum')).toBe(true);
      expect(result.errors.some(e => e.rule === 'header-max-length')).toBe(true);
      expect(result.errors.some(e => e.rule === 'subject-full-stop')).toBe(true);
    });

    it('should handle multiple warnings', () => {
      const longLine = 'a'.repeat(150);
      const message = `feat: add\nBody without blank\n${longLine}\nFooter: value`;
      const result = validateCommit(message);
      
      expect(result.warnings.length).toBeGreaterThan(1);
    });

    it('should separate errors and warnings correctly', () => {
      const message = 'feat: Add Feature.\nBody without blank';
      const result = validateCommit(message);
      
      // Should have errors for case and period
      expect(result.errors.length).toBeGreaterThan(0);
      // Should have warning for body leading blank
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.valid).toBe(false);
    });

    it('should handle perfect conventional commit', () => {
      const message = 'feat(api): add user authentication\n\nImplements JWT-based authentication with refresh tokens.\nIncludes middleware for protected routes.\n\nCloses: #42\nReviewed-by: @reviewer';
      const result = validateCommit(message);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should validate breaking change commit', () => {
      const message = 'feat(api)!: change authentication method\n\nBREAKING CHANGE: API now requires OAuth2';
      const result = validateCommit(message);
      
      expect(result.valid).toBe(true);
      expect(result.parsed.isBreaking).toBe(true);
    });

    it('should allow empty config object', () => {
      const result = validateCommit('feat: add feature', {});
      
      expect(result.valid).toBe(true);
    });

    it('should merge user config with defaults', () => {
      const config: Partial<Config> = {
        types: ['custom'],
        maxHeaderLength: 100,
      };
      const result = validateCommit('custom: test', config);
      
      expect(result.valid).toBe(true);
      // Default subjectCase should still apply
      expect(result.parsed.type).toBe('custom');
    });
  });

  describe('result structure', () => {
    it('should return valid: true with no errors', () => {
      const result = validateCommit('feat: add feature');
      
      expect(result.valid).toBe(true);
    });

    it('should return valid: false with errors', () => {
      const result = validateCommit('invalid: add feature');
      
      expect(result.valid).toBe(false);
    });

    it('should include parsed commit', () => {
      const result = validateCommit('feat(api): add endpoint');
      
      expect(result.parsed).toBeDefined();
      expect(result.parsed.type).toBe('feat');
      expect(result.parsed.scope).toBe('api');
    });

    it('should include errors array', () => {
      const result = validateCommit('invalid: test');
      
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should include warnings array', () => {
      const result = validateCommit('feat: test');
      
      expect(Array.isArray(result.warnings)).toBe(true);
    });

    it('should have suggestion field (null initially)', () => {
      const result = validateCommit('feat: test');
      
      expect(result.suggestion).toBeNull();
    });

    it('should have level in each issue', () => {
      const result = validateCommit('invalid: test');
      
      result.errors.forEach(error => {
        expect(error.level).toBe('error');
      });
    });

    it('should have rule name in each issue', () => {
      const result = validateCommit('invalid: test');
      
      result.errors.forEach(error => {
        expect(typeof error.rule).toBe('string');
        expect(error.rule.length).toBeGreaterThan(0);
      });
    });

    it('should have descriptive message in each issue', () => {
      const result = validateCommit('invalid: test');
      
      result.errors.forEach(error => {
        expect(typeof error.message).toBe('string');
        expect(error.message.length).toBeGreaterThan(0);
      });
    });
  });
});

