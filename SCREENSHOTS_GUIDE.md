# Commitly - Screenshots & GIFs Guide

## Overview

This guide outlines the visual content needed for Task 5: Visuals & Content. These assets will be used in the README, documentation, and social media.

---

## Required Screenshots

### 1. **Dashboard Overview** 
**File:** `docs/screenshots/dashboard.png`  
**Size:** 1920x1080 (desktop view)

**What to capture:**
- Full dashboard view showing:
  - Sidebar navigation with Commitly logo
  - Project cards with status badges (pass/fail/warning)
  - Commit quality donut chart (showing 75% compliance)
  - Integration status panel
  - Linting errors section
  - Auto-fix suggestion diff view
  - Commit message structure breakdown

**Lighting/Theme:**
- Dark theme (default)
- Show glassmorphism effects
- Ensure readable contrast

**Example URL:** `http://localhost:5173/`

---

### 2. **Formatter - Live Validation**
**File:** `docs/screenshots/formatter-validation.png`  
**Size:** 1920x1080 (desktop view)

**What to capture:**
- Formatter page with:
  - Input panel with an **invalid** commit message
  - Real-time error indicators below input
  - Output panel showing auto-fix diff (red/green)
  - Line-by-line diff comparison
  - Error chips at bottom showing validation issues

**Example commit to use:**
```
Add OAuth Login.
```

**Expected errors:**
- Type missing
- Subject should be lowercase
- Trailing period

**Expected auto-fix:**
```
feat(auth): add OAuth login
```

**Example URL:** `http://localhost:5173/formatter`

---

### 3. **Formatter - Success State**
**File:** `docs/screenshots/formatter-success.png`  
**Size:** 1920x1080 (desktop view)

**What to capture:**
- Formatter page with:
  - Input panel with a **valid** commit message
  - Green checkmark indicating success
  - "No issues found" message
  - Output panel showing "No fixes needed"

**Example commit to use:**
```
feat(auth): add OAuth login

Implement OAuth 2.0 authentication flow with Google provider.
This enables users to sign in using their Google accounts.

Closes #123
```

**Example URL:** `http://localhost:5173/formatter`

---

### 4. **Reports Page**
**File:** `docs/screenshots/reports.png`  
**Size:** 1920x1080 (desktop view)

**What to capture:**
- Reports page showing:
  - Commit history table with status indicators
  - Filter controls (repository, date range, status)
  - Trend chart (line graph)
  - Statistics cards at top

**Example URL:** `http://localhost:5173/reports`

---

### 5. **Settings Page**
**File:** `docs/screenshots/settings.png`  
**Size:** 1920x1080 (desktop view)

**What to capture:**
- Settings page with:
  - Accordion sections (Commit Rules, Auto-Fix, Integrations)
  - One section expanded showing configuration options
  - Toggle switches and input fields
  - Clean, organized layout

**Example URL:** `http://localhost:5173/settings`

---

### 6. **Documentation Page**
**File:** `docs/screenshots/docs.png`  
**Size:** 1920x1080 (desktop view)

**What to capture:**
- Docs page showing:
  - Table of contents sidebar
  - Main content area with formatted documentation
  - Code blocks with copy button
  - Syntax highlighting
  - Search bar at top

**Example URL:** `http://localhost:5173/docs`

---

### 7. **Mobile Responsive View**
**File:** `docs/screenshots/mobile.png`  
**Size:** 375x812 (iPhone 13 Pro size)

**What to capture:**
- Dashboard or Formatter on mobile device
- Show responsive navigation (collapsed sidebar)
- Touch-friendly UI elements
- Maintained readability

**Example URL:** Any page at mobile breakpoint

---

## Required GIFs/Animated Demos

### 1. **CLI Hook in Action** ⭐ Priority
**File:** `docs/gifs/cli-hook.gif`  
**Duration:** 10-15 seconds  
**Size:** 800x450

**Script:**
1. Terminal window showing empty git repo
2. Type: `git init`
3. Type: `commitly init-hooks`
4. Show success message
5. Create a file: `echo "test" > test.txt`
6. Type: `git add .`
7. Type: `git commit -m "Add new feature"` (invalid)
8. **Show hook blocking commit** with red error message
9. Show error explanation
10. Type: `git commit -m "feat: add new feature"` (valid)
11. Show successful commit ✓

**Tools:**
- [Terminalizer](https://github.com/faressoft/terminalizer)
- [asciinema](https://asciinema.org/)
- [ttygif](https://github.com/icholy/ttygif)

**Example commands:**
```bash
# Record with asciinema
asciinema rec cli-demo.cast

# Convert to gif
agg cli-demo.cast cli-hook.gif
```

---

### 2. **Web Playground Auto-Fix** ⭐ Priority
**File:** `docs/gifs/web-autofix.gif`  
**Duration:** 8-12 seconds  
**Size:** 1200x700

**Script:**
1. Empty formatter page
2. Type invalid commit: `"Added login button."`
3. Pause briefly - show errors appear in real-time
4. Click "Auto-Fix Message" button
5. Show diff view animating in
6. Show green highlighted fixed version
7. Click "Copy Fixed Message" button
8. Show success toast notification

**Tools:**
- [ScreenToGif](https://www.screentogif.com/) (Windows)
- [Kap](https://getkap.co/) (macOS)
- [Peek](https://github.com/phw/peek) (Linux)
- [LICEcap](https://www.cockos.com/licecap/)

**Settings:**
- FPS: 15-20
- Smooth cursor movement
- Highlight clicks

---

### 3. **Real-time Validation**
**File:** `docs/gifs/realtime-validation.gif`  
**Duration:** 6-8 seconds  
**Size:** 1000x600

**Script:**
1. Start with empty input
2. Type slowly: `f` → `fe` → `fea` → `feat`
3. Show validation updating live
4. Type: `:` → ` ` → `a` → `ad` → `add`
5. Show errors updating in real-time
6. Complete valid message
7. Show all green checkmarks

**Focus on:**
- Real-time feedback
- Instant validation
- Smooth UX

---

### 4. **Dashboard Overview Tour**
**File:** `docs/gifs/dashboard-tour.gif`  
**Duration:** 10-12 seconds  
**Size:** 1200x700

**Script:**
1. Load dashboard
2. Slowly scroll down to show all sections:
   - Project cards
   - Commit structure breakdown
   - Linting errors
   - Quality chart
   - Integration status
3. Hover over interactive elements
4. Click one "Auto-Fix" button
5. Show modal or navigation

---

## Screenshot Specifications

### Technical Requirements

- **Format:** PNG (lossless) or WebP (modern browsers)
- **Desktop Resolution:** 1920x1080 or 2560x1440 (HiDPI)
- **Mobile Resolution:** 375x812 (iPhone) or 412x915 (Android)
- **Color Space:** sRGB
- **Compression:** Optimize with tools like:
  - [TinyPNG](https://tinypng.com/)
  - [Squoosh](https://squoosh.app/)
  - ImageOptim (macOS)

### GIF Requirements

- **Format:** GIF or WebM/MP4 (better compression)
- **Max File Size:** 5MB per GIF
- **FPS:** 15-20 (smooth but small file size)
- **Looping:** Continuous loop
- **Palette:** Optimize colors (256 max for GIF)

---

## Taking Screenshots

### Browser DevTools Method

1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Cmd+Shift+M / Ctrl+Shift+M)
3. Select device or set custom dimensions
4. Capture:
   - **Full page:** Cmd+Shift+P → "Capture full size screenshot"
   - **Viewport:** Cmd+Shift+P → "Capture screenshot"

### macOS

```bash
# Full screen
Cmd + Shift + 3

# Selection
Cmd + Shift + 4

# Window
Cmd + Shift + 4 + Space
```

### Windows

```bash
# Full screen
Win + PrtScn

# Snipping Tool
Win + Shift + S
```

### Linux

```bash
# gnome-screenshot
gnome-screenshot -a

# flameshot
flameshot gui
```

---

## Creating GIFs

### Recommended Workflow

1. **Record:**
   - Use screen recording software
   - Record at 2x target resolution (downscale for quality)
   - Use smooth, deliberate mouse movements
   - Add 1-2 second pause at start/end

2. **Edit:**
   - Trim unnecessary frames
   - Adjust playback speed (0.5x-1.5x)
   - Optimize palette
   - Add text overlays if needed

3. **Export:**
   - Target 5MB or less
   - Use dithering for better quality
   - Test loop smoothness

### CLI Example (ffmpeg)

```bash
# Record with QuickTime/OBS
# Convert video to gif
ffmpeg -i input.mov -vf "fps=15,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 output.gif

# Optimize
gifsicle -O3 --lossy=80 -o optimized.gif output.gif
```

---

## Directory Structure

```
docs/
├── screenshots/
│   ├── dashboard.png
│   ├── formatter-validation.png
│   ├── formatter-success.png
│   ├── reports.png
│   ├── settings.png
│   ├── docs.png
│   └── mobile.png
├── gifs/
│   ├── cli-hook.gif
│   ├── web-autofix.gif
│   ├── realtime-validation.gif
│   └── dashboard-tour.gif
└── raw/
    └── (original uncompressed files)
```

---

## Using in README

Once created, add to README.md:

```markdown
## 📸 Screenshots

### Dashboard
![Dashboard Overview](docs/screenshots/dashboard.png)

### Formatter
![Live Validation](docs/screenshots/formatter-validation.png)

### CLI in Action
![CLI Hook Demo](docs/gifs/cli-hook.gif)

### Web Auto-Fix
![Web Auto-Fix](docs/gifs/web-autofix.gif)
```

---

## Checklist

- [ ] Create `docs/screenshots/` directory
- [ ] Create `docs/gifs/` directory
- [ ] Take 7 screenshots (desktop + mobile)
- [ ] Record 4 GIF demos
- [ ] Optimize all images (< 500KB per screenshot)
- [ ] Optimize all GIFs (< 5MB each)
- [ ] Add to README.md
- [ ] Add to documentation pages
- [ ] Update social media OG image with real screenshot
- [ ] Test on different devices/browsers

---

## Tools Summary

**Screenshots:**
- Chrome DevTools (built-in)
- macOS Screenshot (Cmd+Shift+4)
- Windows Snipping Tool (Win+Shift+S)

**Screen Recording:**
- [Kap](https://getkap.co/) - macOS, free, GIF export
- [ScreenToGif](https://www.screentogif.com/) - Windows, free, great editor
- [Peek](https://github.com/phw/peek) - Linux, simple GIF recorder
- [OBS Studio](https://obsproject.com/) - Cross-platform, professional

**GIF Optimization:**
- [gifsicle](https://www.lcdf.org/gifsicle/) - CLI optimizer
- [ezgif.com](https://ezgif.com/) - Online editor/optimizer
- [gifski](https://gif.ski/) - High-quality GIF encoder

**Terminal Recording:**
- [asciinema](https://asciinema.org/) + [agg](https://github.com/asciinema/agg)
- [terminalizer](https://github.com/faressoft/terminalizer)

---

## Next Steps

1. Set up local development server: `pnpm dev`
2. Navigate through all pages
3. Take screenshots following this guide
4. Record GIF demos with smooth interactions
5. Optimize all assets
6. Add to repository
7. Update README and docs

---

**Status:** ⏳ Ready to capture - Application is fully built and functional

**Estimated Time:** 2-3 hours for all screenshots and GIFs

