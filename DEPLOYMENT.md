# Commitly - Deployment Guide

## Quick Deploy to Vercel

### Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))

### Deployment Steps

1. **Fork or Clone the Repository**

   ```bash
   git clone https://github.com/slaw469/Commitly.git
   cd Commitly
   ```

2. **Push to Your GitHub Repository**

   ```bash
   git remote set-url origin https://github.com/YOUR_USERNAME/commitly.git
   git push -u origin main
   ```

3. **Deploy to Vercel**

   **Option A: Using Vercel CLI**

   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Deploy from project root
   cd apps/commitly-web
   vercel --prod
   ```

   **Option B: Using Vercel Dashboard**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Set the following configuration:
     - **Framework Preset:** Vite
     - **Root Directory:** `apps/commitly-web`
     - **Build Command:** Leave default (uses vercel.json)
     - **Output Directory:** `dist`
   - Click "Deploy"

4. **Update README with Live URL**
   ```bash
   # After deployment, update README.md line 22 with your Vercel URL
   # Example: https://commitly.vercel.app
   ```

### Environment Variables (Optional)

If you want to add Firebase authentication in the future:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

Add these in Vercel Dashboard → Settings → Environment Variables

### Vercel Configuration

The project includes `apps/commitly-web/vercel.json` with:

- ✅ Monorepo-aware build commands
- ✅ SPA routing configuration
- ✅ Optimized caching headers for assets
- ✅ No additional setup required

### Expected Build Time

- **First deployment:** ~2-3 minutes
- **Subsequent deploys:** ~1-2 minutes

### Verification

After deployment, verify these pages work:

- `/` - Dashboard
- `/formatter` - Commit message formatter
- `/reports` - Commit reports
- `/settings` - Settings
- `/docs` - Documentation
- `/add-project` - Add project

All routes should load correctly thanks to SPA rewrites.

### Troubleshooting

**Build fails with "command not found":**

- Ensure you're deploying from the repository root or `apps/commitly-web`
- Check that `vercel.json` is present

**Routes return 404:**

- Verify `vercel.json` rewrites configuration
- Check that `dist/index.html` was generated

**Assets not loading:**

- Check Vite base URL configuration in `vite.config.ts`
- Verify asset paths are relative

### Custom Domain (Optional)

To add a custom domain:

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Domains
3. Add your domain and follow DNS instructions

### Continuous Deployment

Vercel automatically deploys:

- **Production:** Every push to `main` branch
- **Preview:** Every pull request

No additional CI/CD setup required!

---

## Alternative Deployment Options

### Deploy to Netlify

1. **netlify.toml** (add to project root):

   ```toml
   [build]
     base = "apps/commitly-web"
     command = "cd ../.. && pnpm install && pnpm --filter commitly-web build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. Deploy:
   ```bash
   npm install -g netlify-cli
   cd apps/commitly-web
   netlify deploy --prod
   ```

### Deploy to GitHub Pages

1. **Add gh-pages workflow** (`.github/workflows/deploy.yml`):

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3

         - name: Setup Node
           uses: actions/setup-node@v3
           with:
             node-version: '20'

         - name: Setup pnpm
           uses: pnpm/action-setup@v2
           with:
             version: 8

         - name: Install dependencies
           run: pnpm install

         - name: Build
           run: pnpm --filter commitly-web build

         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./apps/commitly-web/dist
   ```

2. Enable GitHub Pages in repository settings

### Deploy to CloudFlare Pages

1. Connect repository to CloudFlare Pages
2. Set build configuration:
   - **Build command:** `cd ../.. && pnpm install && pnpm --filter commitly-web build`
   - **Build output directory:** `apps/commitly-web/dist`
   - **Root directory:** `/`

---

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test navigation between pages
- [ ] Check that formatter validates commits in real-time
- [ ] Verify dashboard displays properly
- [ ] Test responsive design on mobile
- [ ] Update README.md with live URL
- [ ] Create GIFs/screenshots of the app
- [ ] Add Open Graph meta tags with deployed URL
- [ ] Test social media link previews
- [ ] Monitor Vercel analytics for errors

---

## Performance Monitoring

Vercel provides built-in analytics:

- **Web Vitals:** Core Web Vitals monitoring
- **Real User Monitoring:** Performance from actual users
- **Edge Network:** Global CDN for fast loading

Access at: Vercel Dashboard → Your Project → Analytics

---

## Support

For deployment issues:

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **GitHub Issues:** [github.com/slaw469/Commitly/issues](https://github.com/slaw469/Commitly/issues)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)

---

**Ready to Deploy!** 🚀

The project is fully configured for deployment. Choose your preferred platform and follow the steps above.
