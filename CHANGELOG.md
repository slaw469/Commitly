# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Deployment readiness verification for Vercel
- Comprehensive MVP validation suite
- End-to-end integration testing

## [0.1.0] - 2025-01-02

### Added

#### Core Library (@commitly/core)

- Message parser with type/scope/subject extraction
- Conventional Commits validation engine
- Auto-fix functionality with type inference
- Configurable rules via Zod schema
- Browser-safe implementation (no Node.js dependencies)
- Full TypeScript support with strict mode
- Comprehensive unit tests (100% coverage)
- ESM and CJS dual build support

#### CLI Tool (@commitly/cli)

- `commitly lint` command for validating commit messages
- `commitly fix` command for auto-fixing messages
- `commitly check` command for CI/CD integration
- `commitly init-hooks` for git hook installation
- Config loading via cosmiconfig (.commitlyrc.json, .commitlyrc.yaml, package.json)
- Colorized terminal output with chalk
- Comprehensive error messages with suggestions
- Integration tests with temporary git repositories
- Git commit-msg hook installer

#### Web Playground (@commitly/web)

- React-based web application with Vite
- Landing page with feature showcase
- Interactive formatter/playground with real-time validation
- Dashboard with project overview
- Reports page for commit analysis
- Settings page for rule configuration
- Documentation page
- Presets management with localStorage
- Export/Import functionality for presets
- Dark theme with glassmorphism design
- Fully responsive mobile/tablet support
- Keyboard shortcuts (Cmd/Ctrl+Enter, Cmd/Ctrl+Shift+F)
- Toast notifications for user actions
- Accessibility features (WCAG AA+ compliant)
- Diff view for auto-fix suggestions

#### Documentation

- Comprehensive README with quickstart guide
- CLI usage documentation
- Configuration examples
- Integration guides (Husky, GitHub Actions, GitLab CI)
- Contributing guidelines
- MIT License
- Package-specific READMEs

#### Infrastructure

- Monorepo with pnpm workspaces
- Shared TypeScript configuration
- ESLint and Prettier setup
- GitHub Actions CI/CD pipeline
- Automated testing on PRs
- Build verification
- Type checking

### Developer Experience

- Well-organized project structure
- Clear separation of concerns
- Comprehensive test coverage
- Type-safe codebase
- Fast build times
- Hot module replacement for development
- Git hooks for quality assurance

### Configuration Options

All configuration options for commit validation:

- `types`: Array of allowed commit types (default: feat, fix, docs, etc.)
- `requireScope`: Whether scope is required (default: false)
- `maxHeaderLength`: Maximum header length (default: 72)
- `maxLineLength`: Maximum body line length (default: 100)
- `subjectCase`: Subject case format - 'lower', 'sentence', or 'any' (default: 'lower')
- `subjectEmptyForbidden`: Forbid empty subject (default: true)
- `subjectFullStopForbidden`: Forbid trailing period (default: true)
- `bodyLeadingBlank`: Require blank line before body (default: true)
- `footerLeadingBlank`: Require blank line before footer (default: true)
- `blockedWords`: Array of words not allowed in commits (default: [])

### Auto-Fix Features

- Infer commit type from verbs (add → feat, fix → fix, etc.)
- Correct subject casing (lowercase/sentence case)
- Remove trailing periods
- Wrap long lines at configured length
- Truncate overlong headers

### Performance

- Core library: ~11KB (minified)
- CLI tool: ~7.5KB (minified)
- Web app: ~220KB main bundle (47KB gzipped)
- Fast validation (< 1ms per message)
- Optimized builds with code splitting

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2022 target for optimal performance
- Mobile-responsive design
- Touch-friendly UI

### Node.js Support

- Node.js 18+ required
- pnpm 8+ recommended
- ESM-first architecture

## [0.0.1] - 2024-12-01

### Added

- Initial project setup
- Basic monorepo structure
- Development tooling configuration

---

## Upgrade Guide

### From 0.0.1 to 0.1.0

This is the first feature release. No breaking changes.

**Installation:**

```bash
# Update packages
pnpm install

# Rebuild all packages
pnpm build

# Run tests
pnpm test
```

**New Features:**

- Full CLI functionality available
- Web playground now production-ready
- Comprehensive testing suite added

**Configuration Changes:**

- No breaking configuration changes
- All default configurations remain the same

---

## Development

### Running Tests

```bash
# All packages
pnpm test

# Specific package
pnpm --filter @commitly/core test
pnpm --filter @commitly/cli test

# Watch mode
pnpm test:watch
```

### Building

```bash
# All packages
pnpm build

# Specific package
pnpm --filter @commitly/core build
```

### Publishing

```bash
# Prepare for release
pnpm build
pnpm test

# Version bump (using changesets)
pnpm changeset

# Publish to npm
pnpm changeset publish
```

---

## Contributors

Thank you to all contributors who have helped make Commitly better!

- **Core Development Team**
- **AI Development Team**
- **Community Contributors**

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

## Support

- **Issues:** [GitHub Issues](https://github.com/slaw469/Commitly/issues)
- **Discussions:** [GitHub Discussions](https://github.com/slaw469/Commitly/discussions)
- **Documentation:** [README.md](./README.md)

---

[Unreleased]: https://github.com/slaw469/Commitly/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/slaw469/Commitly/releases/tag/v0.1.0
[0.0.1]: https://github.com/slaw469/Commitly/releases/tag/v0.0.1
