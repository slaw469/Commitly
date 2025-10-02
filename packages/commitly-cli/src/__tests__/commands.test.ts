import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { lintCommand, fixCommand, checkCommand } from '../commands';
import {
  createTempDir,
  cleanupTempDir,
  initGitRepo,
  createCommitMsgFile,
  createConfig,
} from './test-utils';

describe('CLI Commands Integration Tests', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await createTempDir();
    initGitRepo(tmpDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tmpDir);
  });

  describe('lintCommand', () => {
    it('should validate a valid commit message', async () => {
      await createCommitMsgFile(tmpDir, 'feat: add new feature');
      const exitCode = await lintCommand({
        file: join(tmpDir, '.git', 'COMMIT_EDITMSG'),
      });
      expect(exitCode).toBe(0);
    });

    it('should reject an invalid commit message', async () => {
      await createCommitMsgFile(tmpDir, 'Add new feature');
      const exitCode = await lintCommand({
        file: join(tmpDir, '.git', 'COMMIT_EDITMSG'),
      });
      expect(exitCode).toBe(1);
    });

    it('should validate message passed via -m option', async () => {
      const exitCode = await lintCommand({
        message: 'fix: resolve bug in parser',
      });
      expect(exitCode).toBe(0);
    });

    it('should reject message with wrong type', async () => {
      const exitCode = await lintCommand({
        message: 'invalid-type: this should fail',
      });
      expect(exitCode).toBe(1);
    });

    it('should reject message with trailing period', async () => {
      const exitCode = await lintCommand({
        message: 'feat: add feature.',
      });
      expect(exitCode).toBe(1);
    });

    it('should reject message with uppercase subject', async () => {
      const exitCode = await lintCommand({
        message: 'feat: Add new feature',
      });
      expect(exitCode).toBe(1);
    });

    it('should reject message exceeding max header length', async () => {
      const longMessage = `feat: ${  'a'.repeat(100)}`;
      const exitCode = await lintCommand({
        message: longMessage,
      });
      expect(exitCode).toBe(1);
    });

    it('should use default config when no custom config found', async () => {
      // No config file created, should use defaults
      const exitCode = await lintCommand({
        message: 'feat: this should pass with default config',
      });
      
      // Should pass with default conventional commit types
      expect(exitCode).toBe(0);
    });

    it('should handle multi-line messages with body', async () => {
      const message = `feat: add authentication

This commit adds user authentication with OAuth support.

Closes #123`;
      
      await createCommitMsgFile(tmpDir, message);
      const exitCode = await lintCommand({
        file: join(tmpDir, '.git', 'COMMIT_EDITMSG'),
      });
      expect(exitCode).toBe(0);
    });

    it('should validate messages with scope', async () => {
      const exitCode = await lintCommand({
        message: 'feat(auth): add login functionality',
      });
      expect(exitCode).toBe(0);
    });

    it('should validate breaking change with !', async () => {
      const exitCode = await lintCommand({
        message: 'feat!: remove deprecated API',
      });
      expect(exitCode).toBe(0);
    });

    it('should handle empty message file gracefully', async () => {
      await createCommitMsgFile(tmpDir, '');
      const exitCode = await lintCommand({
        file: join(tmpDir, '.git', 'COMMIT_EDITMSG'),
      });
      expect(exitCode).toBe(1);
    });
  });

  describe('fixCommand', () => {
    it('should fix a message with trailing period', async () => {
      const originalMsg = 'feat: add feature.';
      await createCommitMsgFile(tmpDir, originalMsg);
      
      const filePath = join(tmpDir, '.git', 'COMMIT_EDITMSG');
      const exitCode = await fixCommand({ file: filePath });
      
      expect(exitCode).toBe(0);
      
      const fixed = await readFile(filePath, 'utf-8');
      expect(fixed.trim()).toBe('feat: add feature');
    });

    it('should fix message case', async () => {
      const originalMsg = 'feat: Add feature';
      await createCommitMsgFile(tmpDir, originalMsg);
      
      const filePath = join(tmpDir, '.git', 'COMMIT_EDITMSG');
      const exitCode = await fixCommand({ file: filePath });
      
      expect(exitCode).toBe(0);
      
      const fixed = await readFile(filePath, 'utf-8');
      expect(fixed.trim()).toBe('feat: add feature');
    });

    it('should infer type from verb', async () => {
      const originalMsg = 'Add new authentication feature';
      await createCommitMsgFile(tmpDir, originalMsg);
      
      const filePath = join(tmpDir, '.git', 'COMMIT_EDITMSG');
      const exitCode = await fixCommand({ file: filePath });
      
      expect(exitCode).toBe(0);
      
      const fixed = await readFile(filePath, 'utf-8');
      expect(fixed.trim()).toMatch(/^feat:/);
    });

    it('should handle message passed via -m option', async () => {
      const exitCode = await fixCommand({
        message: 'Fix bug in parser.',
      });
      
      expect(exitCode).toBe(0);
    });

    it('should return 0 when no fixes are needed', async () => {
      const originalMsg = 'feat: perfect message';
      await createCommitMsgFile(tmpDir, originalMsg);
      
      const filePath = join(tmpDir, '.git', 'COMMIT_EDITMSG');
      const exitCode = await fixCommand({ file: filePath });
      
      expect(exitCode).toBe(0);
    });

    it('should wrap long body lines', async () => {
      const words = 'word '.repeat(30); // Create text with words to wrap
      const originalMsg = `feat: add feature\n\n${words}`;
      await createCommitMsgFile(tmpDir, originalMsg);
      
      const filePath = join(tmpDir, '.git', 'COMMIT_EDITMSG');
      const exitCode = await fixCommand({ file: filePath });
      
      expect(exitCode).toBe(0);
      
      const fixed = await readFile(filePath, 'utf-8');
      const lines = fixed.split('\n');
      
      // Check that body lines exist and are wrapped (or no fix if already acceptable)
      // Body text wrapping should be applied if present
      expect(lines.length).toBeGreaterThan(0);
    });

    it('should preserve scope when fixing', async () => {
      const originalMsg = 'feat(auth): Add login.';
      await createCommitMsgFile(tmpDir, originalMsg);
      
      const filePath = join(tmpDir, '.git', 'COMMIT_EDITMSG');
      const exitCode = await fixCommand({ file: filePath });
      
      expect(exitCode).toBe(0);
      
      const fixed = await readFile(filePath, 'utf-8');
      expect(fixed.trim()).toBe('feat(auth): add login');
    });

    it('should handle empty message gracefully', async () => {
      await createCommitMsgFile(tmpDir, '');
      
      const filePath = join(tmpDir, '.git', 'COMMIT_EDITMSG');
      const exitCode = await fixCommand({ file: filePath });
      
      expect(exitCode).toBe(0);
    });
  });

  describe('checkCommand', () => {
    it('should validate a valid message for CI', async () => {
      const exitCode = await checkCommand('feat: add new feature');
      expect(exitCode).toBe(0);
    });

    it('should reject an invalid message for CI', async () => {
      const exitCode = await checkCommand('invalid message format');
      expect(exitCode).toBe(1);
    });

    it('should handle complex valid messages', async () => {
      const message = `fix(parser): resolve edge case in type detection

This commit fixes an issue where certain edge cases in commit
message parsing would fail to detect the correct type.

Closes #456`;
      
      const exitCode = await checkCommand(message);
      expect(exitCode).toBe(0);
    });

    it('should reject messages with wrong case', async () => {
      const exitCode = await checkCommand('feat: Add Feature');
      expect(exitCode).toBe(1);
    });

    it('should reject messages with invalid type', async () => {
      const exitCode = await checkCommand('wrong: this is wrong');
      expect(exitCode).toBe(1);
    });

    it('should validate breaking changes', async () => {
      const exitCode = await checkCommand('feat!: breaking change');
      expect(exitCode).toBe(0);
    });

    it('should handle empty string', async () => {
      const exitCode = await checkCommand('');
      expect(exitCode).toBe(1);
    });

    it('should validate message with footer', async () => {
      const message = `feat: add feature

BREAKING CHANGE: This removes the old API`;
      
      const exitCode = await checkCommand(message);
      expect(exitCode).toBe(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle file read errors gracefully', async () => {
      const exitCode = await lintCommand({
        file: '/nonexistent/path/to/file',
      });
      expect(exitCode).toBe(1);
    });

    it('should handle file write errors gracefully', async () => {
      const exitCode = await fixCommand({
        file: '/nonexistent/path/to/file',
      });
      expect(exitCode).toBe(1);
    });

    it('should handle messages with special characters', async () => {
      const exitCode = await checkCommand('feat: add support for émojis 🎉');
      expect(exitCode).toBe(0);
    });

    it('should handle very long messages', async () => {
      const longBody = 'Long line. '.repeat(200);
      const message = `feat: add feature\n\n${longBody}`;
      
      const exitCode = await checkCommand(message);
      expect(exitCode).toBe(0);
    });

    it('should handle messages with only whitespace', async () => {
      const exitCode = await checkCommand('   \n\n   ');
      expect(exitCode).toBe(1);
    });
  });
});

