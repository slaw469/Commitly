module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/no-explicit-any': 'warn', // Downgrade to warning
    '@typescript-eslint/explicit-function-return-type': 'off', // Disabled for flexibility
    '@typescript-eslint/no-unused-vars': [
      'warn', // Downgrade to warning
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    
    // General best practices
    'no-console': 'off', // Allowed in CLI tools and tests
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'warn', // Downgrade to warning
    
    // Import ordering
    'import/order': 'off', // Disabled for flexibility
    'import/no-unresolved': 'off', // Disabled due to path alias issues
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  ignorePatterns: ['dist', 'build', 'node_modules', '.turbo'],
};

