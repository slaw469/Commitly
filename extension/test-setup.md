# Chrome Extension Testing Guide

## Quick Setup Instructions

### 1. Install the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `extension` folder from your AI Time Doubler project
5. The extension should appear with a puzzle piece icon (temporary)

### 2. Test Basic Functionality

**Web App Integration:**
1. Start your web app: `npm run dev` (should be on localhost:5177)
2. Open the web app in Chrome
3. Check the dashboard for extension status indicator
4. You should see "Extension Connected" in green

**Extension Popup:**
1. Click the extension icon in Chrome toolbar
2. Should show "AI Time Doubler" popup with session controls
3. Try starting a session from the popup
4. Check that it syncs with the web app

**Tab Tracking:**
1. Start a session (from either popup or web app)
2. Open several tabs and switch between them
3. Check the popup for real tab counts
4. Verify session data updates in the web app

### 3. Debug Issues

**Extension not loading:**
- Check manifest.json syntax
- Look at Chrome extension console for errors
- Ensure all files exist in extension folder

**Communication not working:**
- Open browser console on the web app
- Look for extension-related messages
- Check content script is injected

**Tab tracking not working:**
- Verify extension permissions in chrome://extensions/
- Check background script console for errors
- Ensure web app URL matches webAppUrl in background.js

### 4. Expected Behavior

✅ **When working correctly:**
- Dashboard shows "Extension Connected" 
- Starting session from popup syncs to web app
- Real tab data appears (not simulated)
- Context switches count accurately
- Session controls work from both interfaces

❌ **Fallback mode (no extension):**
- Dashboard shows "Extension Not Found"
- Yellow notice appears recommending extension
- Simulated tab data still works
- All features function normally

### 5. Development Tips

- Reload extension after code changes: chrome://extensions/ → reload button
- Use Chrome DevTools for extension debugging
- Background script console: chrome://extensions/ → "service worker" link
- Content script debugging: regular page console

---

Ready to track your REAL browser productivity! 🚀 