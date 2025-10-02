import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { loadConfig, loadConfigFromFile } from '../config';
import { createTempDir, cleanupTempDir } from './test-utils';

describe('Config Loading', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tmpDir);
  });

  describe('loadConfig', () => {
    it('should load config from .commitlyrc.json', async () => {
      const configPath = join(tmpDir, '.commitlyrc.json');
      const configData = {
        types: ['custom', 'special'],
        requireScope: true,
        maxHeaderLength: 80,
      };
      
      await writeFile(configPath, JSON.stringify(configData), 'utf-8');
      
      const config = await loadConfig(tmpDir);
      
      expect(config).not.toBeNull();
      expect(config?.types).toEqual(['custom', 'special']);
      expect(config?.requireScope).toBe(true);
      expect(config?.maxHeaderLength).toBe(80);
    });

    it('should load config from .commitlyrc.yaml', async () => {
      const configPath = join(tmpDir, '.commitlyrc.yaml');
      const yamlConfig = `
types:
  - feat
  - fix
  - custom
requireScope: false
maxHeaderLength: 72
`;
      
      await writeFile(configPath, yamlConfig, 'utf-8');
      
      const config = await loadConfig(tmpDir);
      
      expect(config).not.toBeNull();
      expect(config?.types).toContain('custom');
    });

    it('should load config from package.json commitly field', async () => {
      const packageJsonPath = join(tmpDir, 'package.json');
      const packageJson = {
        name: 'test-package',
        commitly: {
          types: ['package-type'],
          maxHeaderLength: 60,
        },
      };
      
      await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');
      
      const config = await loadConfig(tmpDir);
      
      expect(config).not.toBeNull();
      expect(config?.types).toEqual(['package-type']);
      expect(config?.maxHeaderLength).toBe(60);
    });

    it('should return null when no config is found', async () => {
      const config = await loadConfig(tmpDir);
      expect(config).toBeNull();
    });

    it('should handle partial config correctly', async () => {
      const configPath = join(tmpDir, '.commitlyrc.json');
      const partialConfig = {
        maxHeaderLength: 100,
        // Other fields should use defaults
      };
      
      await writeFile(configPath, JSON.stringify(partialConfig), 'utf-8');
      
      const config = await loadConfig(tmpDir);
      
      expect(config).not.toBeNull();
      expect(config?.maxHeaderLength).toBe(100);
      // Note: Zod will apply defaults when fully parsing
    });

    it('should handle invalid JSON gracefully', async () => {
      const configPath = join(tmpDir, '.commitlyrc.json');
      await writeFile(configPath, '{ invalid json }', 'utf-8');
      
      const config = await loadConfig(tmpDir);
      
      // Should return null or handle error gracefully
      expect(config).toBeNull();
    });

    it('should validate config schema', async () => {
      const configPath = join(tmpDir, '.commitlyrc.json');
      const invalidConfig = {
        types: 'not-an-array', // Should be array
        maxHeaderLength: -1, // Should be positive
      };
      
      await writeFile(configPath, JSON.stringify(invalidConfig), 'utf-8');
      
      const config = await loadConfig(tmpDir);
      
      // Should handle validation errors
      expect(config).toBeNull();
    });

    it('should prioritize .commitlyrc.json over package.json', async () => {
      // Create both config files
      const rcPath = join(tmpDir, '.commitlyrc.json');
      await writeFile(
        rcPath,
        JSON.stringify({ types: ['rc-type'] }),
        'utf-8'
      );
      
      const packagePath = join(tmpDir, 'package.json');
      await writeFile(
        packagePath,
        JSON.stringify({
          name: 'test',
          commitly: { types: ['package-type'] },
        }),
        'utf-8'
      );
      
      const config = await loadConfig(tmpDir);
      
      expect(config?.types).toEqual(['rc-type']);
    });

    it('should handle config with all supported options', async () => {
      const configPath = join(tmpDir, '.commitlyrc.json');
      const fullConfig = {
        types: ['feat', 'fix', 'docs', 'custom'],
        requireScope: true,
        maxHeaderLength: 80,
        maxLineLength: 100,
        subjectCase: 'lower',
        subjectEmptyForbidden: true,
        subjectFullStopForbidden: true,
        bodyLeadingBlank: true,
        footerLeadingBlank: true,
        blockedWords: ['wip', 'todo'],
      };
      
      await writeFile(configPath, JSON.stringify(fullConfig), 'utf-8');
      
      const config = await loadConfig(tmpDir);
      
      expect(config).not.toBeNull();
      expect(config?.types).toEqual(['feat', 'fix', 'docs', 'custom']);
      expect(config?.requireScope).toBe(true);
      expect(config?.maxHeaderLength).toBe(80);
      expect(config?.blockedWords).toEqual(['wip', 'todo']);
    });
  });

  describe('loadConfigFromFile', () => {
    it('should load config from specific file', async () => {
      const configPath = join(tmpDir, 'custom-config.json');
      const configData = {
        types: ['custom'],
        maxHeaderLength: 90,
      };
      
      await writeFile(configPath, JSON.stringify(configData), 'utf-8');
      
      const config = await loadConfigFromFile(configPath);
      
      expect(config).not.toBeNull();
      expect(config?.types).toEqual(['custom']);
      expect(config?.maxHeaderLength).toBe(90);
    });

    it('should return null for non-existent file', async () => {
      const config = await loadConfigFromFile(join(tmpDir, 'nonexistent.json'));
      expect(config).toBeNull();
    });

    it('should handle various file extensions', async () => {
      const configPath = join(tmpDir, '.commitlyrc');
      const configData = { types: ['test'] };
      
      await writeFile(configPath, JSON.stringify(configData), 'utf-8');
      
      const config = await loadConfigFromFile(configPath);
      
      expect(config).not.toBeNull();
      expect(config?.types).toEqual(['test']);
    });
  });

  describe('Config Validation Edge Cases', () => {
    it('should handle empty config object', async () => {
      const configPath = join(tmpDir, '.commitlyrc.json');
      await writeFile(configPath, '{}', 'utf-8');
      
      const config = await loadConfig(tmpDir);
      
      // Empty config should be valid (use all defaults)
      expect(config).not.toBeNull();
    });

    it('should handle config with extra unknown fields', async () => {
      const configPath = join(tmpDir, '.commitlyrc.json');
      const configData = {
        types: ['feat', 'fix'],
        unknownField: 'should be ignored',
        anotherUnknown: 123,
      };
      
      await writeFile(configPath, JSON.stringify(configData), 'utf-8');
      
      const config = await loadConfig(tmpDir);
      
      expect(config).not.toBeNull();
      expect(config?.types).toEqual(['feat', 'fix']);
    });

    it('should handle config with null values', async () => {
      const configPath = join(tmpDir, '.commitlyrc.json');
      const configData = {
        types: ['feat'],
        requireScope: null,
      };
      
      await writeFile(configPath, JSON.stringify(configData), 'utf-8');
      
      const config = await loadConfig(tmpDir);
      
      // Should handle null values gracefully
      expect(config).not.toBeNull();
    });

    it('should handle config with different subjectCase values', async () => {
      const testCases: Array<'lower' | 'sentence' | 'any'> = ['lower', 'sentence', 'any'];
      
      for (const subjectCase of testCases) {
        const configPath = join(tmpDir, `.commitlyrc-${subjectCase}.json`);
        await writeFile(
          configPath,
          JSON.stringify({ subjectCase }),
          'utf-8'
        );
        
        const config = await loadConfigFromFile(configPath);
        expect(config?.subjectCase).toBe(subjectCase);
      }
    });

    it('should reject invalid subjectCase value', async () => {
      const configPath = join(tmpDir, '.commitlyrc.json');
      const configData = {
        subjectCase: 'invalid-case',
      };
      
      await writeFile(configPath, JSON.stringify(configData), 'utf-8');
      
      const config = await loadConfig(tmpDir);
      
      // Should fail validation
      expect(config).toBeNull();
    });

    it('should handle blockedWords as empty array', async () => {
      const configPath = join(tmpDir, '.commitlyrc.json');
      const configData = {
        blockedWords: [],
      };
      
      await writeFile(configPath, JSON.stringify(configData), 'utf-8');
      
      const config = await loadConfig(tmpDir);
      
      expect(config).not.toBeNull();
      expect(config?.blockedWords).toEqual([]);
    });

    it('should handle types as empty array', async () => {
      const configPath = join(tmpDir, '.commitlyrc.json');
      const configData = {
        types: [],
      };
      
      await writeFile(configPath, JSON.stringify(configData), 'utf-8');
      
      const config = await loadConfig(tmpDir);
      
      expect(config).not.toBeNull();
      expect(config?.types).toEqual([]);
    });
  });
});

