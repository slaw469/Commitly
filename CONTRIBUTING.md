# Contributing to Commitly

Thank you for your interest in contributing to Commitly! We welcome contributions from the community and are grateful for your help in making this project better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. Be kind, professional, and considerate in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Commitly.git
   cd Commitly
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/slaw469/Commitly.git
   ```

## Development Setup

### Prerequisites

- Node.js 18+ (we recommend using [nvm](https://github.com/nvm-sh/nvm))
- pnpm 8+ (`npm install -g pnpm`)

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start web development server
pnpm --filter commitly-web dev
```

### Project Structure

```
Commitly/
├── packages/
│   ├── commitly-core/     # Core parsing & validation library
│   └── commitly-cli/      # Command-line interface
├── apps/
│   └── commitly-web/      # React web application
├── .github/
│   ├── workflows/         # CI/CD pipelines
│   └── ISSUE_TEMPLATE/    # Issue templates
└── docs/                  # Documentation
```

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/slaw469/Commitly/issues)
2. Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.yml)
3. Provide as much detail as possible
4. Include steps to reproduce

### Suggesting Features

1. Check if the feature has already been requested
2. Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.yml)
3. Explain the problem and your proposed solution
4. Consider implementation details

### Fixing Bugs or Implementing Features

1. Find an issue you'd like to work on or create one
2. Comment on the issue to let others know you're working on it
3. Fork and create a branch: `git checkout -b feat/my-feature` or `fix/bug-description`
4. Make your changes following our [coding standards](#coding-standards)
5. Add tests for your changes
6. Ensure all tests pass: `pnpm test`
7. Commit using conventional commits
8. Push and create a Pull Request

## Pull Request Process

### Before Submitting

- [ ] Code follows the project's coding standards
- [ ] All tests pass (`pnpm test`)
- [ ] TypeScript compiles without errors (`pnpm typecheck`)
- [ ] Code is properly formatted (`pnpm format`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Commit messages follow conventional commits
- [ ] Documentation is updated if needed
- [ ] CHANGELOG.md is updated (or changeset added)

### PR Guidelines

1. **Title**: Use conventional commit format: `feat: add new feature`
2. **Description**:
   - Explain what and why
   - Reference related issues: `Closes #123`
   - Include screenshots for UI changes
3. **Tests**: Add tests for new functionality
4. **Documentation**: Update relevant docs
5. **Breaking Changes**: Clearly mark and explain

### Review Process

- Maintainers will review your PR
- Address any feedback promptly
- Keep the PR focused on a single concern
- Be patient and respectful

## Coding Standards

### TypeScript

- Use strict TypeScript with no `any` types
- Export all public interfaces
- Use type inference where appropriate
- Prefer `interface` over `type` for object shapes

```typescript
// ✅ Good
interface User {
  name: string;
  age: number;
}

// ❌ Bad
const user: any = { name: 'John' };
```

### React

- Use functional components with hooks
- Avoid `useEffect` when not necessary
- Keep components focused and small
- Use prop interfaces with clear names

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### Styling

- Use Tailwind CSS utility classes only
- No inline styles (`style={{}}`)
- Use theme tokens for colors
- Follow existing patterns in the codebase

```typescript
// ✅ Good
<div className="bg-primary text-white p-4 rounded-md">

// ❌ Bad
<div style={{ backgroundColor: '#3490dc', padding: '16px' }}>
```

### General Rules

- Keep functions small and focused
- Use descriptive variable names
- Add JSDoc comments for public APIs
- Avoid magic numbers
- Prefer `const` over `let`
- Use template literals for string interpolation

## Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for all commits.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes that don't modify src or test files

### Examples

```bash
feat(cli): add --quiet flag to suppress warnings

fix(core): handle empty commit messages correctly

docs: update installation instructions

test(cli): add integration tests for init-hooks command
```

### Breaking Changes

For breaking changes, add `BREAKING CHANGE:` in the footer:

```
feat(core): remove deprecated parseMessage function

BREAKING CHANGE: parseMessage has been replaced with parseCommitMessage
```

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests for specific package
pnpm --filter commitly-core test
```

### Writing Tests

- Write tests for all new features
- Test edge cases and error conditions
- Use descriptive test names
- Follow the AAA pattern: Arrange, Act, Assert

```typescript
import { describe, it, expect } from 'vitest';

describe('parseCommitMessage', () => {
  it('should parse commit message with type and subject', () => {
    // Arrange
    const message = 'feat: add new feature';

    // Act
    const result = parseCommitMessage(message);

    // Assert
    expect(result.type).toBe('feat');
    expect(result.subject).toBe('add new feature');
  });
});
```

## Documentation

### What to Document

- Public APIs and functions (JSDoc)
- Configuration options
- CLI commands and flags
- Architecture decisions
- Usage examples

### Documentation Style

- Use clear, concise language
- Include code examples
- Explain the "why" not just the "how"
- Keep documentation up to date

### JSDoc Example

````typescript
/**
 * Parse a commit message into structured components
 *
 * @param message - The commit message to parse
 * @param config - Optional configuration for parsing rules
 * @returns Parsed commit message with type, scope, subject, body, and footer
 *
 * @example
 * ```typescript
 * const parsed = parseCommitMessage('feat(api): add user endpoint');
 * console.log(parsed.type); // 'feat'
 * console.log(parsed.scope); // 'api'
 * ```
 */
export function parseCommitMessage(message: string, config?: Config): ParsedCommit {
  // ...
}
````

## Questions?

If you have questions that aren't covered here:

- Check the [README](README.md)
- Look through existing [Issues](https://github.com/slaw469/Commitly/issues)
- Start a [Discussion](https://github.com/slaw469/Commitly/discussions)
- Reach out to maintainers

## Thank You! 🙏

Every contribution, no matter how small, makes a difference. Thank you for helping make Commitly better!

---

**Happy Contributing!** 🚀
