# Commitly

> Clean, conventional commits—every time. Lint and auto-fix commit messages via a fast CLI and a sleek web playground.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)

**Commitly** enforces clear, consistent commit messages following the [Conventional Commits](https://www.conventionalcommits.org) specification. It catches mistakes at commit time and suggests clean fixes instantly, so you don't burn review time on message format. Structured commits unlock automatic changelogs and semantic releases—making history searchable and releases predictable.

**Key features:**

- **CLI tool** blocks bad commits via a `commit-msg` hook with optional auto-fix
- **Configurable rules** following Conventional Commits by default via `.commitlyrc`
- **Live web playground** with side-by-side auto-fix diff and real-time validation
- **Local presets** for saving and exporting rule configurations
- **Fast and lightweight** with zero browser dependencies
- **Modern UI** featuring dark theme, glassmorphism design, and full responsiveness

---

## Live demo

**[https://commitly-tool.netlify.app](https://commitly-tool.netlify.app)**

Try the web playground to:

- **Format** messages like `Add OAuth Login` → get `feat(auth): add OAuth login`
- **Validate** commits in real-time with detailed error messages
- **Configure** rules interactively with instant feedback
- **Export** your configuration for local use

---

## Features

- **Parse** commit messages into structured components: `type(scope): subject` → body → footer
- **Validate** against Conventional Commits rules: header length, subject casing, trailing punctuation, valid types, scope requirements, and BREAKING CHANGE detection
- **Auto-fix** common issues: infer type from verbs, correct casing, remove trailing periods, wrap long lines
- **Browser-safe core** with no Node.js dependencies, runs in any environment
- **Type-safe** with full TypeScript strict mode
- **Zero backend** – web app is 100% client-side with local storage persistence
- **Configurable** via `.commitlyrc.json` or `package.json`
- **Fast** with minimal bundle size and optimized builds

---

## Quick start

### CLI installation

```bash
# Install globally
npm install -g @commitly/cli

# Or as dev dependency
npm install -D @commitly/cli
pnpm add -D @commitly/cli
yarn add -D @commitly/cli
```

### Set up git hooks

```bash
# Install commit-msg hook
commitly init-hooks

# Now all commits will be validated automatically
```

---

## CLI usage

### Lint commit messages

```bash
# Lint current commit message
commitly lint

# Lint specific file
commitly lint -f commit-message.txt

# Lint message string
commitly lint -m "feat: add new feature"
```

### Auto-fix commits

```bash
# Fix and update COMMIT_EDITMSG
commitly fix

# Fix specific file
commitly fix -f commit-message.txt

# Show fixed version without writing
commitly fix -m "Add new feature"
# Output: feat: add new feature
```

### CI/CD integration

```bash
# Check commit message (exit 0 if valid, 1 if invalid)
commitly check "feat(api): add user endpoint"

# Use in GitHub Actions
- name: Validate Commit
  run: commitly check "${{ github.event.head_commit.message }}"
```

---

## Configuration

### Create `.commitlyrc.json`

```json
{
  "types": ["feat", "fix", "docs", "style", "refactor", "test", "chore"],
  "requireScope": false,
  "maxHeaderLength": 72,
  "maxLineLength": 100,
  "subjectCase": "lower",
  "subjectEmptyForbidden": true,
  "subjectFullStopForbidden": true,
  "bodyLeadingBlank": true,
  "footerLeadingBlank": true,
  "blockedWords": ["wip", "todo", "fixme"]
}
```

### Or in `package.json`

```json
{
  "commitly": {
    "types": ["feat", "fix", "docs"],
    "requireScope": true,
    "maxHeaderLength": 50
  }
}
```

### Configuration options

| Option                      | Type                             | Default                        | Description                     |
| --------------------------- | -------------------------------- | ------------------------------ | ------------------------------- |
| `types`                     | `string[]`                       | `['feat', 'fix', 'docs', ...]` | Allowed commit types            |
| `requireScope`              | `boolean`                        | `false`                        | Whether scope is required       |
| `maxHeaderLength`           | `number`                         | `72`                           | Maximum header length           |
| `maxLineLength`             | `number`                         | `100`                          | Maximum body line length        |
| `subjectCase`               | `'lower' \| 'sentence' \| 'any'` | `'lower'`                      | Subject case format             |
| `subjectEmptyForbidden`     | `boolean`                        | `true`                         | Forbid empty subject            |
| `subjectFullStopForbidden`  | `boolean`                        | `true`                         | Forbid trailing period          |
| `bodyLeadingBlank`          | `boolean`                        | `true`                         | Require blank line before body  |
| `footerLeadingBlank`        | `boolean`                        | `true`                         | Require blank line before footer|
| `blockedWords`              | `string[]`                       | `[]`                           | Words not allowed in commits    |

---

## Integrations

### Husky

```bash
# Install husky
npm install -D husky
npx husky init

# Add to .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx commitly lint -f "$1"
```

### GitHub Actions

```yaml
name: Validate Commits

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g @commitly/cli
      - run: commitly check "${{ github.event.head_commit.message }}"
```

### GitLab CI

```yaml
validate-commit:
  stage: test
  script:
    - npm install -g @commitly/cli
    - commitly check "$CI_COMMIT_MESSAGE"
```

---

## Packages

This monorepo contains three packages:

### `@commitly/core`

Core library for parsing, validating, and auto-fixing commit messages. Browser-safe with no Node.js dependencies, fully typed with TypeScript, tree-shakeable ESM and CJS builds, and zero runtime dependencies.

### `@commitly/cli`

Command-line interface for linting and fixing commits. Includes git hook installer, colorized output, config file support, and CI/CD-friendly commands.

### `@commitly/web`

React-based web playground for interactive validation. Features live validation with real-time feedback, auto-fix with diff view, dark theme with glassmorphism, fully responsive design, and accessibility (WCAG AA+).

---

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clone repository
git clone https://github.com/slaw469/Commitly.git
cd Commitly

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

### Environment setup

For the web application, you'll need Firebase credentials:

```bash
# Copy environment template
cp apps/commitly-web/.env.example apps/commitly-web/.env.local

# Edit .env.local with your Firebase project credentials
# Get these from: https://console.firebase.google.com/
```

See `apps/commitly-web/.env.example` for required variables.

### Project structure

```
Commitly/
├── packages/
│   ├── commitly-core/    # Core parsing & validation library
│   └── commitly-cli/     # Command-line interface
├── apps/
│   └── commitly-web/     # React web application
└── .github/
    └── workflows/        # CI/CD pipelines
```

### Scripts

```bash
# Development
pnpm dev                        # Start web dev server
pnpm --filter commitly-cli dev  # Watch CLI changes

# Building
pnpm build                      # Build all packages
pnpm --filter commitly-core build  # Build specific package

# Testing
pnpm test                       # Run all tests
pnpm test:watch                 # Watch mode

# Code Quality
pnpm lint                       # Lint all files
pnpm format                     # Format with Prettier
pnpm typecheck                  # TypeScript type checking
```

---

## Contributing

Contributions are welcome! When contributing:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit using Conventional Commits: `git commit -m "feat: add your feature"`
4. Push to your fork and open a Pull Request

All commits must follow the Conventional Commits format. Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

See [OPEN_SOURCE_CONTRIBUTIONS.md](./OPEN_SOURCE_CONTRIBUTIONS.md) for acknowledgments and license information.

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

## Links

- **Live demo:** [https://commitly-tool.netlify.app](https://commitly-tool.netlify.app)
- **Issue tracker:** [GitHub Issues](https://github.com/slaw469/Commitly/issues)
- **Repository:** [GitHub](https://github.com/slaw469/Commitly)
