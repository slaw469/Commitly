import { describe, it, expect } from 'vitest';
import { parseCommitMessage, reconstructCommitMessage } from './parser';
import type { ParsedCommit } from './types';

describe('parseCommitMessage', () => {
  describe('valid conventional commits', () => {
    it('should parse a simple feat commit', () => {
      const result = parseCommitMessage('feat: add new feature');

      expect(result.type).toBe('feat');
      expect(result.scope).toBeNull();
      expect(result.subject).toBe('add new feature');
      expect(result.body).toBeNull();
      expect(result.footer).toBeNull();
      expect(result.isBreaking).toBe(false);
      expect(result.header).toBe('feat: add new feature');
    });

    it('should parse a commit with scope', () => {
      const result = parseCommitMessage('fix(auth): resolve login issue');

      expect(result.type).toBe('fix');
      expect(result.scope).toBe('auth');
      expect(result.subject).toBe('resolve login issue');
      expect(result.isBreaking).toBe(false);
    });

    it('should parse a breaking change with ! notation', () => {
      const result = parseCommitMessage('feat(api)!: change response format');

      expect(result.type).toBe('feat');
      expect(result.scope).toBe('api');
      expect(result.subject).toBe('change response format');
      expect(result.isBreaking).toBe(true);
    });

    it('should parse a commit with body', () => {
      const message = 'feat: add authentication\n\nThis adds JWT-based authentication to the API.';
      const result = parseCommitMessage(message);

      expect(result.type).toBe('feat');
      expect(result.subject).toBe('add authentication');
      expect(result.body).toBe('This adds JWT-based authentication to the API.');
      expect(result.footer).toBeNull();
    });

    it('should parse a commit with body and footer', () => {
      const message =
        'fix: resolve memory leak\n\nFixed issue with event listeners.\n\nCloses: #123';
      const result = parseCommitMessage(message);

      expect(result.type).toBe('fix');
      expect(result.subject).toBe('resolve memory leak');
      expect(result.body).toBe('Fixed issue with event listeners.');
      expect(result.footer).toBe('Closes: #123');
    });

    it('should detect BREAKING CHANGE in footer', () => {
      const message = 'feat: new API\n\nBREAKING CHANGE: API endpoints changed';
      const result = parseCommitMessage(message);

      expect(result.isBreaking).toBe(true);
      expect(result.footer).toContain('BREAKING CHANGE');
    });

    it('should detect BREAKING-CHANGE with hyphen in footer', () => {
      const message = 'feat: update config\n\nBREAKING-CHANGE: config format changed';
      const result = parseCommitMessage(message);

      expect(result.isBreaking).toBe(true);
    });

    it('should handle multiple footers', () => {
      const message = 'feat: add feature\n\nReviewed-by: Jane\nRefs: #456';
      const result = parseCommitMessage(message);

      expect(result.footer).toContain('Reviewed-by: Jane');
      expect(result.footer).toContain('Refs: #456');
    });

    it('should parse commit with multi-line body', () => {
      const message =
        'docs: update README\n\nAdded installation instructions.\nAdded usage examples.\nFixed typos.';
      const result = parseCommitMessage(message);

      expect(result.body).toContain('Added installation instructions');
      expect(result.body).toContain('Added usage examples');
      expect(result.body).toContain('Fixed typos');
    });

    it('should handle body with blank lines (paragraphs)', () => {
      const message = 'refactor: clean up code\n\nFirst paragraph.\n\nSecond paragraph.';
      const result = parseCommitMessage(message);

      expect(result.body).toContain('First paragraph');
      expect(result.body).toContain('Second paragraph');
    });
  });

  describe('edge cases', () => {
    it('should handle empty message', () => {
      const result = parseCommitMessage('');

      expect(result.type).toBeNull();
      expect(result.scope).toBeNull();
      expect(result.subject).toBeNull();
      expect(result.header).toBe('');
    });

    it('should handle whitespace-only message', () => {
      const result = parseCommitMessage('   \n\n   ');

      expect(result.type).toBeNull();
      expect(result.subject).toBeNull();
    });

    it('should handle non-conventional commit', () => {
      const result = parseCommitMessage('Fixed a bug');

      expect(result.type).toBeNull();
      expect(result.scope).toBeNull();
      expect(result.subject).toBe('Fixed a bug');
      expect(result.header).toBe('Fixed a bug');
    });

    it('should handle commit with only type (no subject)', () => {
      const result = parseCommitMessage('feat: ');

      expect(result.type).toBe('feat');
      expect(result.subject).toBe('');
    });

    it('should handle scope with special characters', () => {
      const result = parseCommitMessage('fix(api-v2): resolve issue');

      expect(result.type).toBe('fix');
      expect(result.scope).toBe('api-v2');
      expect(result.subject).toBe('resolve issue');
    });

    it('should handle scope with nested notation', () => {
      const result = parseCommitMessage('feat(core/parser): improve parsing');

      expect(result.type).toBe('feat');
      expect(result.scope).toBe('core/parser');
      expect(result.subject).toBe('improve parsing');
    });

    it('should handle multiple colons in subject', () => {
      const result = parseCommitMessage('feat: add feature: improved version');

      expect(result.type).toBe('feat');
      expect(result.subject).toBe('add feature: improved version');
    });

    it('should handle subject with leading/trailing spaces', () => {
      const result = parseCommitMessage('feat:   add feature   ');

      expect(result.type).toBe('feat');
      expect(result.subject).toBe('add feature   ');
    });

    it('should preserve exact spacing in body', () => {
      const message = 'feat: add\n\n  Indented line\n    More indented';
      const result = parseCommitMessage(message);

      expect(result.body).toContain('  Indented line');
      expect(result.body).toContain('    More indented');
    });

    it('should handle footer without blank line separator', () => {
      const message = 'feat: add feature\nBody text\nCloses: #123';
      const result = parseCommitMessage(message);

      // Should still identify the footer
      expect(result.footer).toContain('Closes: #123');
    });

    it('should handle numeric types', () => {
      const result = parseCommitMessage('v1: update version');

      expect(result.type).toBe('v1');
      expect(result.subject).toBe('update version');
    });

    it('should handle uppercase types', () => {
      const result = parseCommitMessage('FEAT: add feature');

      expect(result.type).toBe('FEAT');
      expect(result.subject).toBe('add feature');
    });

    it('should handle very long header', () => {
      const longSubject = 'a'.repeat(200);
      const result = parseCommitMessage(`feat: ${longSubject}`);

      expect(result.type).toBe('feat');
      expect(result.subject).toBe(longSubject);
      expect(result.header.length).toBeGreaterThan(72);
    });

    it('should handle special characters in subject', () => {
      const result = parseCommitMessage('feat: add ☕ emoji support & symbols!');

      expect(result.subject).toBe('add ☕ emoji support & symbols!');
    });

    it('should handle both ! and BREAKING CHANGE', () => {
      const message = 'feat!: breaking change\n\nBREAKING CHANGE: details';
      const result = parseCommitMessage(message);

      expect(result.isBreaking).toBe(true);
    });

    it('should handle malformed scope (missing closing paren)', () => {
      const result = parseCommitMessage('feat(scope: add feature');

      // Should treat as non-conventional
      expect(result.type).toBeNull();
      expect(result.subject).toBe('feat(scope: add feature');
    });
  });

  describe('reconstructCommitMessage', () => {
    it('should reconstruct a simple commit', () => {
      const parsed: ParsedCommit = {
        header: 'feat: add feature',
        type: 'feat',
        scope: null,
        subject: 'add feature',
        body: null,
        footer: null,
        isBreaking: false,
        raw: 'feat: add feature',
      };

      const result = reconstructCommitMessage(parsed);
      expect(result).toBe('feat: add feature');
    });

    it('should reconstruct commit with scope', () => {
      const parsed: ParsedCommit = {
        header: 'fix(auth): resolve issue',
        type: 'fix',
        scope: 'auth',
        subject: 'resolve issue',
        body: null,
        footer: null,
        isBreaking: false,
        raw: '',
      };

      const result = reconstructCommitMessage(parsed);
      expect(result).toBe('fix(auth): resolve issue');
    });

    it('should reconstruct breaking change with !', () => {
      const parsed: ParsedCommit = {
        header: 'feat!: breaking',
        type: 'feat',
        scope: null,
        subject: 'breaking',
        body: null,
        footer: null,
        isBreaking: true,
        raw: '',
      };

      const result = reconstructCommitMessage(parsed);
      expect(result).toBe('feat!: breaking');
    });

    it('should reconstruct commit with body', () => {
      const parsed: ParsedCommit = {
        header: 'feat: add',
        type: 'feat',
        scope: null,
        subject: 'add',
        body: 'Body text here',
        footer: null,
        isBreaking: false,
        raw: '',
      };

      const result = reconstructCommitMessage(parsed);
      expect(result).toBe('feat: add\n\nBody text here');
    });

    it('should reconstruct commit with footer', () => {
      const parsed: ParsedCommit = {
        header: 'fix: bug',
        type: 'fix',
        scope: null,
        subject: 'bug',
        body: 'Fixed it',
        footer: 'Closes: #123',
        isBreaking: false,
        raw: '',
      };

      const result = reconstructCommitMessage(parsed);
      expect(result).toBe('fix: bug\n\nFixed it\n\nCloses: #123');
    });

    it('should handle missing type (non-conventional)', () => {
      const parsed: ParsedCommit = {
        header: 'Fix bug',
        type: null,
        scope: null,
        subject: 'Fix bug',
        body: null,
        footer: null,
        isBreaking: false,
        raw: '',
      };

      const result = reconstructCommitMessage(parsed);
      expect(result).toBe('Fix bug');
    });

    it('should roundtrip parse and reconstruct', () => {
      const original = 'feat(core): add parser\n\nThis adds a new parser.\n\nCloses: #42';
      const parsed = parseCommitMessage(original);
      const reconstructed = reconstructCommitMessage(parsed);

      expect(reconstructed).toBe(original);
    });
  });
});
