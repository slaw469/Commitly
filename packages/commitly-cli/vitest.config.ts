import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules',
        'dist',
        '**/*.config.*',
        '**/*.d.ts',
        '**/index.ts',
      ],
    },
    testTimeout: 30000, // CLI tests may need more time for file operations
    pool: 'forks', // Use forks instead of threads to support process.chdir()
    poolOptions: {
      forks: {
        singleFork: true, // Use single fork for consistency
      },
    },
  },
});

