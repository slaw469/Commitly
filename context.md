# Commitly — Build Checklist (Track A: no custom backend)

## 0) Vision & Scope

- [x] 1-liner: "Lint & auto-fix commit messages (Conventional Commits) via CLI + a slick web playground."
- [x] Non-goals: no custom server; no user data beyond presets; no repo access.
- [x] Success criteria: working CLI hooks; public playground on Vercel; README + GIFs.

## 1) Repo & Tooling

- [x] Monorepo with pnpm workspaces: packages/commitly-core, packages/commitly-cli, apps/commitly-web
- [x] Shared setup: TypeScript, ESLint, Prettier, Vitest + c8
- [x] CI (GitHub Actions): install → lint → test → build on PRs & main
- [x] Conventional commits for this repo (yes—dogfood)

## 2) Core Library (packages/commitly-core)

- [x] Message parser: split header/body/footer; extract type, scope, subject
- [x] Default rule set: Conventional Commits (types, header ≤ 72, subject casing, no trailing period, body wrapped @72, BREAKING CHANGE: in footer)
- [x] Validator: returns structured result {valid, errors[], warnings[], suggestion}
- [x] Auto-fixer: casing, trailing period, wrap at 72, infer type from verb ("add/fix/refactor" → feat/fix/refactor)
- [x] Schema with zod for configurable rules (types, requireScope, blockedWords, maxHeader)
- [x] Browser-safe build (no Node APIs); export browser + node entry points
- [x] Unit tests: parser cases, rule cases, autofix snapshots

## 3) CLI (packages/commitly-cli)

- [x] Commands with commander:
  - [x] commitly lint (default reads .git/COMMIT_EDITMSG; -f for file)
  - [x] commitly fix (in-place)
  - [x] commitly check -m "<msg>" (CI usage)
  - [x] commitly init-hooks (writes commit-msg / optional prepare-commit-msg)
- [x] Output polish: chalk colors, concise error table, exit codes (0/1)
- [x] Config loading via cosmiconfig + zod (.commitlyrc.{json,yaml}, or commitly key in package.json)
- [x] Hook installer: simple-git-hooks (no runtime dependency)
- [x] Integration tests: temp repo → run hooks → assert failures/success
- [x] Build with tsup (ESM, #!/usr/bin/env node banner)

## 4) Web Playground (apps/commitly-web)

- [x] Stack: React + Vite + Tailwind + shadcn/ui (Radix)
- [x] Dark mode default + toggle
- [x] Pages:
  - [x] / Landing (hero, feature tiles, CTA buttons to Playground & GitHub)
  - [x] /playground Editor (live validation + auto-fix suggestion diff)
  - [x] /presets (optional auth-gated view; see below)
- [x] Live validator:
  - [x] Monaco (or textarea) with real-time linting
  - [ ] Web Worker runs commitly-core to keep typing smooth (optional, works without)
  - [x] Rule chips: pass/fail with details; copy-fixed-message button
  - [x] Diff block using diff2html
- [ ] Firebase Auth (Google): (optional for MVP)
  - [ ] Client-only: firebase SDK; Sign in with Google in header
  - [ ] Store {uid, email, photoURL} in a simple AuthContext
- [x] Presets storage:
  - [x] Local mode: save/load/delete presets in localStorage
  - [x] Export/Import presets JSON (for "cross-device" via manual file)
- [x] UX polish:
  - [x] Keyboard shortcuts (Cmd/Ctrl+Enter to validate; Cmd/Ctrl+Shift+F for auto-fix preview)
  - [x] Toasts for actions (saved preset, copied message)
  - [x] Empty states & example commit templates
- [x] Accessibility:
  - [x] Labels/aria for editor, good contrast for errors, focus states

## 5) Visuals & Content

- [x] Brand: "Commitly" logo wordmark (simple text mark OK), favicon
- [x] Screenshots/GIFs: landing, playground before/after, CLI in terminal
- [x] Open Graph/Twitter meta for pretty link previews

## 6) Deployment

- [ ] Vercel project → root apps/commitly-web
- [ ] Env vars: VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID
- [ ] Build: pnpm build → output dist/
- [ ] (If using client routes) vercel.json rewrite /(.*) → /

## 7) Docs & DevEx

- [x] README (below) with clear Quickstart, CLI usage, and live demo link placeholder
- [x] Changelog via Changesets (optional for Track A; keep ready for npm publish)
- [x] Issue templates: bug/feature request (optional)
- [x] License (MIT)

## 8) Definition of Done (MVP)

- [x] CLI lints and blocks bad commits via commit-msg hook
- [x] Web playground validates & shows auto-fix suggestion with diff
- [x] Presets persist locally; export/import works
- [ ] Deployed on Vercel; README has GIFs + demo link

## 9) Stretch (post-MVP)

- [x] Additional rule presets: Angular, Gitmoji
- [ ] Scope autocomplete from package.json workspaces (paste JSON in web)
- [x] "History" panel in web to track last N validations (local only)
- [x] GitHub Action example: run commitly check -m across PR commits
- [x] PWA installability for offline use

