# Commitly Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of Commitly
- Core library for parsing and validating commit messages
- CLI tool with lint, fix, check, and init-hooks commands
- Web playground with live validation and auto-fix
- Dashboard for project overview and metrics
- Reports page for commit history analysis
- Settings page for configuration management
- Comprehensive documentation

### Features

#### Core Library (@commitly/core)
- Parse commit messages into structured components
- Validate against Conventional Commits specification
- Auto-fix common issues (casing, trailing periods, type inference)
- Configurable rules via zod schema
- Browser-safe build with zero dependencies
- Full TypeScript support

#### CLI Tool (@commitly/cli)
- `commitly lint` - Validate commit messages
- `commitly fix` - Auto-fix commit messages
- `commitly check` - CI-friendly validation
- `commitly init-hooks` - Install git hooks
- Colorized output with chalk
- Config loading via cosmiconfig

#### Web Playground (@commitly/web)
- Live validation with real-time feedback
- Auto-fix with side-by-side diff view
- Dark theme with glassmorphism design
- Fully responsive and accessible
- Presets management with local storage
- Export/import presets as JSON

---

## Release Process

This project uses [Changesets](https://github.com/changesets/changesets) for version management and changelog generation.

To add a changeset:
```bash
npx changeset
```

To create a release:
```bash
npx changeset version
npx changeset publish
```

---

_This changelog is automatically generated from changesets._

