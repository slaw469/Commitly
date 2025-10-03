# Commitly — Phase 1 & 2 Implementation Checklist

## Phase 1 — Track A (client-only; you can finish all of this without admin access)

### 1. Auth & routing ✅ COMPLETE

- [x] Use AuthContext to expose { user, loading, signInWithGoogle, signInWithGithub, signOut }
- [x] Protect routes: Dashboard, Reports, Settings, Add Project → redirect to /login if no user
- [x] Public routes: Landing, Playground, Formatter, Docs

**Enhancements Made:**
- Added error handling with user-friendly messages
- Implemented ARIA labels and accessibility features
- Added loading states for all async operations
- Created redirect-to-origin after login
- Added TypeScript type definitions for Vite env
- Build passes with no errors

**Validation Report:** See `TASK1_AUTH_VALIDATION.md` for full details

### 2. Data persistence (client-only) ✅ COMPLETE

- [x] Implement localStorage stores, namespaced by uid:
  - [x] commitly:{uid}:presets
  - [x] commitly:{uid}:history
  - [x] commitly:{uid}:projects (UI-only "connected repos" until backend exists)
- [x] Add Export/Import presets (JSON) for cross-device transfer

**Implementation Details:**
- Created generic storage utility with error handling
- Built type-safe useLocalStorage hook with React integration
- Implemented usePresets, useValidationHistory, and useProjects hooks
- All hooks automatically namespace by uid when user is authenticated
- Support for anonymous users (uses global namespace)
- Export/import functionality with validation
- Cross-tab synchronization via storage events
- Loading states and proper error handling

**Validation Report:** See `TASK2_COMPLETION_SUMMARY.md` for full details

### 3. Playground & Formatter ✅ COMPLETE

- [x] Run commitly-core in a Web Worker; debounce 100–150ms
- [x] Live rule chips, header/body/footer parse strip, and "Copy fixed message"
- [x] Keyboard shortcuts (Cmd/Ctrl+Enter validate, Cmd/Ctrl+Shift+F apply fix)
- [x] Add share state (encode rules + message in URL)

**Implementation Summary:**
- Created Web Worker (`validator.worker.ts`) for non-blocking validation with 150ms debounce
- Implemented `useValidatorWorker` hook with proper cleanup and error handling
- Added `RuleChips` component showing live validation status for all rules
- Added `ParseStrip` showing parsed commit structure (header/body/footer)
- Updated keyboard shortcuts: Cmd/Ctrl+Enter (validate), Cmd/Ctrl+Shift+F (auto-fix), Cmd/Ctrl+S (save to URL)
- Implemented URL state management with encoding/decoding for sharing
- Added share button to copy shareable URLs
- All validation checks passed - no AI mistakes, proper debouncing, clean code

### 4. Dashboard / Reports (client-only for now)

- [ ] Use local "projects" (fake integration objects) so UI is functional
- [ ] Generate Commit History Quality from local Validation History
- [ ] Reports page: filter by date range; show structure breakdown, errors, and auto-fix suggestion preview

### 5. Settings ✅ COMPLETE

- [x] CRUD for rule presets
- [x] Toggle default rules:
  - [x] max header
  - [x] require scope
  - [x] subject case
  - [x] blank line before body
  - [x] allowed types

**Implementation Details:**
- Created useSettings hook for managing default validation rules with localStorage
- Integrated preset system with CRUD operations (create, read, update, delete)
- All toggles and inputs connected to state with real-time persistence
- Import/export functionality for settings backup and transfer
- Full validation and error handling
- No unnecessary useEffect hooks or rerenders
- Proper TypeScript typing throughout

### 6. UX polish

- [ ] Loading & error states for auth, history, presets
- [ ] Toasts/snackbars for save, copy, import/export success/failure
- [ ] A11y: proper labels, focus states, color contrast

### 7. Testing & Hardening

- [ ] Unit tests for core adapters (parsing → UI mapping, autofix previews)
- [ ] Playwright (or Vitest + jsdom) to test route protection and "copy fixed" flow
- [ ] Input normalization:
  - [ ] strip BOM
  - [ ] zero-width
  - [ ] CRLF → LF
  - [ ] remove leading |/> from pasted markdown
- [ ] Feature flags (simple ?feature=ghApp or localStorage flags) for future backend paths

### 8. Deploy

- [ ] Ensure the app builds with no Node APIs in the browser bundle
- [ ] Read Firebase config from import.meta.env; don't inline secrets
- [ ] Add Open Graph image, favicon, and a 20–30s hero GIF of the playground flow

## Phase 2 — "Connect a repository" (dev work once admin sets up the GitHub App + backend)

You can scaffold most of this without secrets by coding to interfaces + using fixtures.

### 1. Client integration

- [ ] "Add Project" page:
  - [ ] Button → opens Install GitHub App link (provided by backend)
  - [ ] After redirect, hit /api/github/installations to list installations & repos
  - [ ] Save selection locally (for now) and render on Dashboard
  - [ ] Repo cards: "View Report", "Disconnect", status pills (Pass/Fail/Warning)
  - [ ] Handle 401 (expired auth) → re-auth with Firebase
  - [ ] Handle 403/404 nicely

### 2. Backend contracts (define, then implement)

- [ ] GET /api/github/installations → list user's installations (backend mints installation token)
- [ ] GET /api/github/repos?installation_id=… → list repos for that installation
- [ ] POST /api/projects → register the repo to monitor (stores user_id + repo info)
- [ ] POST /api/webhooks/github → webhook receiver (verifies signature; queues processing)
- [ ] GET /api/reports?repo_id=…&from=…&to=… → summarized commit lint results

### 3. Processing (server-side)

- [ ] On push/pull_request webhook:
  - [ ] Verify HMAC signature; reject if invalid
  - [ ] Fetch commit messages (with installation token)
  - [ ] Run the same core validation server-side (reuse commitly-core in Python via subprocess or port rules to Python—or keep a Node worker)
  - [ ] Store aggregate results
  - [ ] Precompute "history quality" %, last run summary

### 4. Testing (no secrets)

- [ ] Use GitHub's sample webhook payloads as fixtures; run them through your handlers locally
- [ ] Mock installation token exchange (static token in dev) and assert rate-limit backoff

---

## Admin Checklist (you)

### Phase 1 — Track A (client-only: Firebase Auth + local data, deployable to Vercel)

#### Firebase Auth

- [ ] Confirm Google and GitHub providers are enabled
- [ ] Add both localhost and your Vercel domain to Authorized Domains
- [ ] In GitHub OAuth (for Firebase provider), ensure callback URL is added exactly as Firebase shows

#### Firestore (optional, if you want cloud presets now)

- [ ] Create Cloud Firestore (Production mode)
- [ ] Add basic security rules: users can only read/write their own docs
- [ ] (Optional) Create a "dev" Firebase project for local testing

#### Vercel

- [ ] Create the project pointing at apps/commitly-web
- [ ] Add env vars (prefix with VITE_):
  - [ ] VITE_FIREBASE_API_KEY
  - [ ] VITE_FIREBASE_AUTH_DOMAIN
  - [ ] VITE_FIREBASE_PROJECT_ID
  - [ ] VITE_FIREBASE_APP_ID
- [ ] Set "Preview" and "Production" envs. Don't share secrets directly with the dev; they'll reference them by name

#### Governance

- [ ] Decide data policy: Track A = localStorage only or Firestore for presets/history
- [ ] Decide branding (logo, name, links) and content (Privacy, Terms) for the public demo
- [ ] Turn on Firebase Analytics (already added per your dev's note)

### Phase 2 — "Connect a repository" (requires a tiny backend)

#### Create a GitHub App (recommended over OAuth PATs)

- [ ] App permissions:
  - [ ] Repository metadata: Read
  - [ ] Contents: Read
  - [ ] (add others later if needed: Checks/PRs)
- [ ] Subscribe to events:
  - [ ] push
  - [ ] pull_request
  - [ ] (optionally check_suite)
- [ ] Generate the App private key and keep it secret
- [ ] Set the webhook URL to your backend; set a webhook secret

#### Backend hosting

- [ ] Pick a host (Railway / Render / Fly)
- [ ] Create env secrets:
  - [ ] GH_APP_ID
  - [ ] GH_APP_PRIVATE_KEY
  - [ ] GH_WEBHOOK_SECRET
  - [ ] If you use Postgres: DATABASE_URL
- [ ] Add the backend URL to allowed origins/CORS for the web app

#### Database (if you go server-side later)

- [ ] Provision Postgres (Neon/Supabase/Render)
- [ ] Create tables:
  - [ ] users
  - [ ] installations
  - [ ] repos
  - [ ] presets
  - [ ] (optional) reports/sessions
- [ ] (Optional) Enable RLS/Policies (if using Supabase) or plan app-level auth checks
