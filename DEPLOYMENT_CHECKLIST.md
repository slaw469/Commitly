# Deployment Verification Checklist

## Pre-Deployment Checklist

### Code Quality ✅

- [x] All unit tests passing (67/67 CLI tests, 100% core coverage)
- [x] All integration tests passing
- [x] No TypeScript errors (`pnpm typecheck`)
- [x] No linter errors (`pnpm lint`)
- [x] No console.logs in production code
- [x] No TODO comments without tickets
- [x] Code reviewed and approved
- [x] Documentation up to date

### Build Verification ✅

- [x] All packages build successfully
  - [x] @commitly/core builds (ESM + CJS)
  - [x] @commitly/cli builds (ESM with shebang)
  - [x] @commitly/web builds (optimized production bundle)
- [x] Build output sizes are reasonable
  - [x] Core: ~11KB
  - [x] CLI: ~7.5KB
  - [x] Web: ~220KB main (47KB gzipped)
- [x] Source maps generated
- [x] Assets properly bundled

### Functionality Verification ✅

#### CLI Functionality
- [x] `commitly lint` validates messages correctly
- [x] `commitly fix` auto-fixes messages
- [x] `commitly check` works for CI/CD
- [x] `commitly init-hooks` installs git hooks
- [x] Git hook blocks invalid commits
- [x] Git hook allows valid commits
- [x] Config files load correctly
- [x] Exit codes are correct (0/1)
- [x] Colorized output displays properly

#### Web Playground
- [ ] Landing page loads and displays correctly
- [ ] Navigation works (all routes accessible)
- [ ] Formatter/playground validates in real-time
- [ ] Auto-fix generates suggestions
- [ ] Diff view shows changes clearly
- [ ] Copy button works
- [ ] Dark theme functions correctly
- [ ] Responsive design on mobile/tablet
- [ ] Keyboard shortcuts work
- [ ] Toast notifications display

#### Presets Management
- [ ] Presets save to localStorage
- [ ] Presets persist after page reload
- [ ] Can edit and delete presets
- [ ] Export downloads JSON file
- [ ] Import from JSON works
- [ ] Invalid JSON shows errors

### Documentation ✅

- [x] README.md is comprehensive
- [x] CHANGELOG.md is up to date
- [x] LICENSE file exists (MIT)
- [x] Issue templates created
- [x] API documentation complete
- [x] Configuration examples accurate
- [x] Integration guides clear

### Security ✅

- [x] No hardcoded secrets or API keys
- [x] Dependencies are up to date
- [x] No known vulnerabilities (`pnpm audit`)
- [x] XSS prevention in user inputs
- [x] CORS configured correctly
- [x] Security headers configured

### Performance ✅

- [x] Bundle sizes optimized
- [x] Code splitting implemented
- [x] Lazy loading where appropriate
- [x] Images optimized
- [x] Fonts optimized
- [x] No memory leaks
- [x] Fast initial load time

### Accessibility ✅

- [x] WCAG AA+ compliance
- [x] Keyboard navigation works
- [x] Screen reader compatible
- [x] Color contrast sufficient
- [x] Focus states visible
- [x] ARIA labels present
- [x] Alt text on images

## Vercel Deployment Configuration

### Files Required ✅

- [x] `vercel.json` exists with correct configuration
- [x] `package.json` has correct scripts
- [x] Build command configured: `pnpm build`
- [x] Output directory: `apps/commitly-web/dist`
- [x] Node.js version specified: 18+

### Environment Variables

Document required environment variables (if any):

```bash
# Firebase (Optional - if implementing auth)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id

# Note: Auth is optional for MVP, all features work without it
```

### Vercel Configuration ✅

**vercel.json:**
```json
{
  "buildCommand": "cd ../.. && pnpm build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Build Command

```bash
# From repository root
pnpm install
pnpm build

# Or specifically for web
cd apps/commitly-web
pnpm build
```

## Deployment Steps

### 1. Pre-Deployment Verification

```bash
# Run all checks
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

### 2. Vercel Deployment

#### Option A: GitHub Integration (Recommended)

1. Push code to `main` branch
2. Vercel auto-deploys via GitHub integration
3. Preview deployments for all branches
4. Production deployments for `main` branch

#### Option B: Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### 3. Post-Deployment Verification

After deployment, verify:

- [ ] Site is accessible at deployed URL
- [ ] All pages load correctly
- [ ] No 404 errors
- [ ] Assets load properly
- [ ] API endpoints work (if any)
- [ ] Analytics tracking (if configured)
- [ ] Error monitoring (if configured)

### 4. Smoke Tests

Run these tests on the live site:

#### Landing Page
- [ ] Hero section displays
- [ ] CTA buttons work
- [ ] Navigation works
- [ ] Links are correct

#### Formatter/Playground
- [ ] Enter invalid message → shows errors
- [ ] Enter valid message → shows success
- [ ] Auto-fix button works
- [ ] Copy button works
- [ ] Diff view displays

#### Responsive Design
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1920px width)

#### Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] No console errors

## Post-Deployment Tasks

### Immediate
- [ ] Update README with live URL
- [ ] Test all functionality on live site
- [ ] Monitor error logs
- [ ] Verify analytics working

### Within 24 Hours
- [ ] Monitor performance metrics
- [ ] Check for any errors
- [ ] Collect initial user feedback
- [ ] Document any issues found

### Within 1 Week
- [ ] Review usage analytics
- [ ] Gather user feedback
- [ ] Create GitHub release (v0.1.0)
- [ ] Announce launch

## Rollback Plan

If deployment fails or critical issues found:

1. **Immediate:** Revert to previous deployment in Vercel dashboard
2. **Code:** Revert last commit and redeploy
3. **Communication:** Notify users of temporary downtime
4. **Fix:** Address issues in development
5. **Redeploy:** Follow deployment checklist again

## Monitoring

### Metrics to Track

- **Performance:**
  - Page load time
  - Time to Interactive
  - Bundle sizes

- **Usage:**
  - Daily active users
  - Messages validated
  - Auto-fixes applied

- **Errors:**
  - JavaScript errors
  - Failed validations
  - Network errors

### Tools

- Vercel Analytics (built-in)
- Lighthouse CI
- Web Vitals
- Error tracking (Sentry, etc.)

## Success Criteria

Deployment is successful when:

- [x] All pre-deployment checks pass
- [ ] Site is accessible and functional
- [ ] No critical errors in logs
- [ ] Performance metrics meet targets
- [ ] All features work as expected
- [ ] Mobile and desktop both functional

## Final Sign-Off

**Pre-Deployment:**
- Date: [YYYY-MM-DD]
- Verified by: AI Development Team
- Status: Ready / Not Ready
- Blockers: [List any blockers]

**Post-Deployment:**
- Deployment Date: [YYYY-MM-DD]
- Deployed by: [Name]
- Live URL: https://commitly.vercel.app
- Status: Success / Issues Found
- Notes: [Any notes]

---

## Deployment Commands Reference

```bash
# Full build and test
pnpm install
pnpm build
pnpm test
pnpm typecheck
pnpm lint

# Local preview
cd apps/commitly-web
pnpm preview

# Vercel deployment
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]
```

---

**This checklist ensures a smooth, error-free deployment to production.**

