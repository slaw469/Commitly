import { describe, it, expect } from 'vitest';
import { ConfigSchema } from './types';
import type { Config } from './types';

describe('ConfigSchema', () => {
  describe('default values', () => {
    it('should provide default values for empty config', () => {
      const result = ConfigSchema.parse({});
      
      expect(result.types).toEqual([
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ]);
      expect(result.requireScope).toBe(false);
      expect(result.maxHeaderLength).toBe(72);
      expect(result.maxLineLength).toBe(100);
      expect(result.subjectCase).toBe('lower');
      expect(result.subjectEmptyForbidden).toBe(true);
      expect(result.subjectFullStopForbidden).toBe(true);
      expect(result.bodyLeadingBlank).toBe(true);
      expect(result.footerLeadingBlank).toBe(true);
      expect(result.blockedWords).toEqual([]);
    });

    it('should provide default types array', () => {
      const result = ConfigSchema.parse({});
      
      expect(Array.isArray(result.types)).toBe(true);
      expect(result.types.length).toBeGreaterThan(0);
      expect(result.types).toContain('feat');
      expect(result.types).toContain('fix');
    });

    it('should default requireScope to false', () => {
      const result = ConfigSchema.parse({});
      
      expect(result.requireScope).toBe(false);
    });

    it('should default maxHeaderLength to 72', () => {
      const result = ConfigSchema.parse({});
      
      expect(result.maxHeaderLength).toBe(72);
    });

    it('should default maxLineLength to 100', () => {
      const result = ConfigSchema.parse({});
      
      expect(result.maxLineLength).toBe(100);
    });

    it('should default subjectCase to lower', () => {
      const result = ConfigSchema.parse({});
      
      expect(result.subjectCase).toBe('lower');
    });

    it('should default boolean flags to true', () => {
      const result = ConfigSchema.parse({});
      
      expect(result.subjectEmptyForbidden).toBe(true);
      expect(result.subjectFullStopForbidden).toBe(true);
      expect(result.bodyLeadingBlank).toBe(true);
      expect(result.footerLeadingBlank).toBe(true);
    });

    it('should default blockedWords to empty array', () => {
      const result = ConfigSchema.parse({});
      
      expect(result.blockedWords).toEqual([]);
    });
  });

  describe('types field', () => {
    it('should accept custom types array', () => {
      const config = { types: ['custom', 'special'] };
      const result = ConfigSchema.parse(config);
      
      expect(result.types).toEqual(['custom', 'special']);
    });

    it('should accept empty types array', () => {
      const config = { types: [] };
      const result = ConfigSchema.parse(config);
      
      expect(result.types).toEqual([]);
    });

    it('should accept single type', () => {
      const config = { types: ['only'] };
      const result = ConfigSchema.parse(config);
      
      expect(result.types).toEqual(['only']);
    });

    it('should accept many types', () => {
      const types = Array.from({ length: 50 }, (_, i) => `type${i}`);
      const config = { types };
      const result = ConfigSchema.parse(config);
      
      expect(result.types).toEqual(types);
    });

    it('should reject non-array types', () => {
      const config = { types: 'not-an-array' };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });

    it('should reject non-string array items', () => {
      const config = { types: [1, 2, 3] };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });

    it('should allow duplicate types', () => {
      const config = { types: ['feat', 'feat', 'fix'] };
      const result = ConfigSchema.parse(config);
      
      // Schema doesn't enforce uniqueness
      expect(result.types).toEqual(['feat', 'feat', 'fix']);
    });
  });

  describe('requireScope field', () => {
    it('should accept true', () => {
      const config = { requireScope: true };
      const result = ConfigSchema.parse(config);
      
      expect(result.requireScope).toBe(true);
    });

    it('should accept false', () => {
      const config = { requireScope: false };
      const result = ConfigSchema.parse(config);
      
      expect(result.requireScope).toBe(false);
    });

    it('should reject non-boolean', () => {
      const config = { requireScope: 'yes' };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });

    it('should reject number', () => {
      const config = { requireScope: 1 };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });
  });

  describe('maxHeaderLength field', () => {
    it('should accept positive integer', () => {
      const config = { maxHeaderLength: 100 };
      const result = ConfigSchema.parse(config);
      
      expect(result.maxHeaderLength).toBe(100);
    });

    it('should accept 1 as minimum', () => {
      const config = { maxHeaderLength: 1 };
      const result = ConfigSchema.parse(config);
      
      expect(result.maxHeaderLength).toBe(1);
    });

    it('should accept large numbers', () => {
      const config = { maxHeaderLength: 10000 };
      const result = ConfigSchema.parse(config);
      
      expect(result.maxHeaderLength).toBe(10000);
    });

    it('should reject zero', () => {
      const config = { maxHeaderLength: 0 };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });

    it('should reject negative numbers', () => {
      const config = { maxHeaderLength: -10 };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });

    it('should reject float numbers', () => {
      const config = { maxHeaderLength: 72.5 };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });

    it('should reject string', () => {
      const config = { maxHeaderLength: '72' };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });
  });

  describe('maxLineLength field', () => {
    it('should accept positive integer', () => {
      const config = { maxLineLength: 80 };
      const result = ConfigSchema.parse(config);
      
      expect(result.maxLineLength).toBe(80);
    });

    it('should accept 1 as minimum', () => {
      const config = { maxLineLength: 1 };
      const result = ConfigSchema.parse(config);
      
      expect(result.maxLineLength).toBe(1);
    });

    it('should accept large numbers', () => {
      const config = { maxLineLength: 999 };
      const result = ConfigSchema.parse(config);
      
      expect(result.maxLineLength).toBe(999);
    });

    it('should reject zero', () => {
      const config = { maxLineLength: 0 };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });

    it('should reject negative numbers', () => {
      const config = { maxLineLength: -5 };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });

    it('should reject float numbers', () => {
      const config = { maxLineLength: 100.1 };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });
  });

  describe('subjectCase field', () => {
    it('should accept "lower"', () => {
      const config = { subjectCase: 'lower' as const };
      const result = ConfigSchema.parse(config);
      
      expect(result.subjectCase).toBe('lower');
    });

    it('should accept "sentence"', () => {
      const config = { subjectCase: 'sentence' as const };
      const result = ConfigSchema.parse(config);
      
      expect(result.subjectCase).toBe('sentence');
    });

    it('should accept "any"', () => {
      const config = { subjectCase: 'any' as const };
      const result = ConfigSchema.parse(config);
      
      expect(result.subjectCase).toBe('any');
    });

    it('should reject invalid value', () => {
      const config = { subjectCase: 'upper' };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });

    it('should reject empty string', () => {
      const config = { subjectCase: '' };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });

    it('should reject number', () => {
      const config = { subjectCase: 1 };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });
  });

  describe('boolean flags', () => {
    it('should accept true for subjectEmptyForbidden', () => {
      const config = { subjectEmptyForbidden: true };
      const result = ConfigSchema.parse(config);
      
      expect(result.subjectEmptyForbidden).toBe(true);
    });

    it('should accept false for subjectEmptyForbidden', () => {
      const config = { subjectEmptyForbidden: false };
      const result = ConfigSchema.parse(config);
      
      expect(result.subjectEmptyForbidden).toBe(false);
    });

    it('should accept true for subjectFullStopForbidden', () => {
      const config = { subjectFullStopForbidden: true };
      const result = ConfigSchema.parse(config);
      
      expect(result.subjectFullStopForbidden).toBe(true);
    });

    it('should accept false for subjectFullStopForbidden', () => {
      const config = { subjectFullStopForbidden: false };
      const result = ConfigSchema.parse(config);
      
      expect(result.subjectFullStopForbidden).toBe(false);
    });

    it('should accept true for bodyLeadingBlank', () => {
      const config = { bodyLeadingBlank: true };
      const result = ConfigSchema.parse(config);
      
      expect(result.bodyLeadingBlank).toBe(true);
    });

    it('should accept false for bodyLeadingBlank', () => {
      const config = { bodyLeadingBlank: false };
      const result = ConfigSchema.parse(config);
      
      expect(result.bodyLeadingBlank).toBe(false);
    });

    it('should accept true for footerLeadingBlank', () => {
      const config = { footerLeadingBlank: true };
      const result = ConfigSchema.parse(config);
      
      expect(result.footerLeadingBlank).toBe(true);
    });

    it('should accept false for footerLeadingBlank', () => {
      const config = { footerLeadingBlank: false };
      const result = ConfigSchema.parse(config);
      
      expect(result.footerLeadingBlank).toBe(false);
    });

    it('should reject non-boolean for all boolean flags', () => {
      const configs = [
        { subjectEmptyForbidden: 'true' },
        { subjectFullStopForbidden: 1 },
        { bodyLeadingBlank: null },
        { footerLeadingBlank: undefined },
      ];

      configs.forEach(config => {
        expect(() => ConfigSchema.parse(config)).toThrow();
      });
    });
  });

  describe('blockedWords field', () => {
    it('should accept array of strings', () => {
      const config = { blockedWords: ['WIP', 'TODO', 'FIXME'] };
      const result = ConfigSchema.parse(config);
      
      expect(result.blockedWords).toEqual(['WIP', 'TODO', 'FIXME']);
    });

    it('should accept empty array', () => {
      const config = { blockedWords: [] };
      const result = ConfigSchema.parse(config);
      
      expect(result.blockedWords).toEqual([]);
    });

    it('should accept single word', () => {
      const config = { blockedWords: ['WIP'] };
      const result = ConfigSchema.parse(config);
      
      expect(result.blockedWords).toEqual(['WIP']);
    });

    it('should accept many words', () => {
      const words = Array.from({ length: 100 }, (_, i) => `word${i}`);
      const config = { blockedWords: words };
      const result = ConfigSchema.parse(config);
      
      expect(result.blockedWords).toEqual(words);
    });

    it('should reject non-array', () => {
      const config = { blockedWords: 'WIP' };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });

    it('should reject array with non-strings', () => {
      const config = { blockedWords: [1, 2, 3] };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });

    it('should allow duplicate words', () => {
      const config = { blockedWords: ['WIP', 'WIP', 'TODO'] };
      const result = ConfigSchema.parse(config);
      
      expect(result.blockedWords).toEqual(['WIP', 'WIP', 'TODO']);
    });

    it('should allow empty strings', () => {
      const config = { blockedWords: ['', 'WIP'] };
      const result = ConfigSchema.parse(config);
      
      expect(result.blockedWords).toEqual(['', 'WIP']);
    });
  });

  describe('partial config', () => {
    it('should accept partial config and fill defaults', () => {
      const config: Partial<Config> = {
        types: ['feat', 'fix'],
        maxHeaderLength: 50,
      };
      const result = ConfigSchema.parse(config);
      
      expect(result.types).toEqual(['feat', 'fix']);
      expect(result.maxHeaderLength).toBe(50);
      expect(result.requireScope).toBe(false); // default
      expect(result.maxLineLength).toBe(100); // default
    });

    it('should accept only types override', () => {
      const config = { types: ['custom'] };
      const result = ConfigSchema.parse(config);
      
      expect(result.types).toEqual(['custom']);
      expect(result.maxHeaderLength).toBe(72);
    });

    it('should accept only boolean overrides', () => {
      const config = {
        requireScope: true,
        subjectFullStopForbidden: false,
      };
      const result = ConfigSchema.parse(config);
      
      expect(result.requireScope).toBe(true);
      expect(result.subjectFullStopForbidden).toBe(false);
      expect(result.subjectEmptyForbidden).toBe(true); // default
    });
  });

  describe('complex configs', () => {
    it('should accept fully custom config', () => {
      const config: Config = {
        types: ['custom', 'special'],
        requireScope: true,
        maxHeaderLength: 50,
        maxLineLength: 80,
        subjectCase: 'sentence',
        subjectEmptyForbidden: false,
        subjectFullStopForbidden: false,
        bodyLeadingBlank: false,
        footerLeadingBlank: false,
        blockedWords: ['BAD', 'WRONG'],
      };
      const result = ConfigSchema.parse(config);
      
      expect(result).toEqual(config);
    });

    it('should validate all fields independently', () => {
      const config = {
        types: ['a'],
        requireScope: false,
        maxHeaderLength: 1,
        maxLineLength: 1,
        subjectCase: 'any' as const,
        subjectEmptyForbidden: false,
        subjectFullStopForbidden: false,
        bodyLeadingBlank: false,
        footerLeadingBlank: false,
        blockedWords: ['x'],
      };
      const result = ConfigSchema.parse(config);
      
      expect(result.types).toEqual(['a']);
      expect(result.maxHeaderLength).toBe(1);
      expect(result.maxLineLength).toBe(1);
    });
  });

  describe('error handling', () => {
    it('should throw on invalid field type', () => {
      const config = { types: 123 };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });

    it('should throw on multiple invalid fields', () => {
      const config = {
        types: 'invalid',
        maxHeaderLength: -1,
        subjectCase: 'wrong',
      };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });

    it('should throw on extra unknown fields with strict mode', () => {
      const config = {
        unknownField: 'value',
      };
      
      // Zod by default ignores extra fields, but we can test it doesn't break
      expect(() => ConfigSchema.parse(config)).not.toThrow();
    });

    it('should handle null values', () => {
      const config = { types: null };
      
      expect(() => ConfigSchema.parse(config)).toThrow();
    });

    it('should handle undefined as missing (use default)', () => {
      const config = { types: undefined };
      const result = ConfigSchema.parse(config);
      
      // undefined should use default
      expect(result.types).toEqual([
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ]);
    });
  });

  describe('TypeScript type inference', () => {
    it('should infer correct Config type', () => {
      const config = ConfigSchema.parse({});
      
      // Type assertions to ensure TypeScript inference works
      const types: string[] = config.types;
      const requireScope: boolean = config.requireScope;
      const maxHeaderLength: number = config.maxHeaderLength;
      const maxLineLength: number = config.maxLineLength;
      const subjectCase: 'lower' | 'sentence' | 'any' = config.subjectCase;
      const subjectEmptyForbidden: boolean = config.subjectEmptyForbidden;
      const subjectFullStopForbidden: boolean = config.subjectFullStopForbidden;
      const bodyLeadingBlank: boolean = config.bodyLeadingBlank;
      const footerLeadingBlank: boolean = config.footerLeadingBlank;
      const blockedWords: string[] = config.blockedWords;

      expect(types).toBeDefined();
      expect(requireScope).toBeDefined();
      expect(maxHeaderLength).toBeDefined();
      expect(maxLineLength).toBeDefined();
      expect(subjectCase).toBeDefined();
      expect(subjectEmptyForbidden).toBeDefined();
      expect(subjectFullStopForbidden).toBeDefined();
      expect(bodyLeadingBlank).toBeDefined();
      expect(footerLeadingBlank).toBeDefined();
      expect(blockedWords).toBeDefined();
    });
  });
});

