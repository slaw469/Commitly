# AI Time Doubler Chrome Extension

Transform your browser into a productivity powerhouse with real-time tab tracking and context switching detection.

## 🚀 Features

- **Real-time Tab Tracking**: Automatically track time spent on each tab
- **Context Switch Detection**: Count and analyze tab switching patterns
- **Session Management**: Start, pause, resume, and end productivity sessions
- **Focus Blocks**: Add focus periods and break times
- **Data Export**: Export your productivity data for analysis
- **Web App Integration**: Seamlessly syncs with your AI Time Doubler dashboard

## 📦 Installation

### Developer Installation (Recommended)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the `extension` folder from your AI Time Doubler project
4. The extension should now appear in your Chrome toolbar

### From Chrome Web Store
*Coming soon - extension will be published to the Chrome Web Store*

## 🎯 Usage

### Starting a Session
1. Click the AI Time Doubler extension icon in your toolbar
2. Click "Start New Session"
3. Optionally enter a session title
4. The extension will begin tracking your tab activity

### Managing Sessions
- **Pause**: Temporarily stop tracking (useful for breaks)
- **Resume**: Continue tracking after a pause
- **End**: Complete the session and save data

### Quick Actions
- **Add Focus Block**: Mark periods of focused work
- **Add Break**: Log break times
- **View Stats**: Open the web dashboard
- **Export Data**: Download your session data as JSON

## 🔧 Configuration

The extension automatically detects your AI Time Doubler web app running on `localhost:5177`. If you're running on a different port, update the `webAppUrl` in `background.js`.

## 📊 Data Collection

The extension tracks:
- Tab titles and URLs (stored locally only)
- Time spent on each tab
- Tab switching frequency
- Session duration and productivity metrics
- Focus blocks and break periods

**Privacy**: All data is stored locally in your browser and synchronized with your local web app only.

## 🛠️ Development

### File Structure
```
extension/
├── manifest.json     # Extension configuration
├── background.js     # Service worker for tab tracking
├── content.js        # Web app communication bridge
├── popup.html        # Extension interface
├── popup.js          # Popup functionality
└── README.md         # This file
```

### Key Components
- **Background Script**: Handles tab tracking and session management
- **Content Script**: Facilitates communication with the web app
- **Popup**: Provides quick access to session controls
- **Extension Service**: Web app service for extension communication

## 🔗 Integration

The extension communicates with your AI Time Doubler web app through:
1. **Content Script**: Injected into the web app for message passing
2. **Extension Service**: Web app service that handles extension messages
3. **Real-time Sync**: Automatic synchronization of session data

## 🐛 Troubleshooting

### Extension Not Working
1. Ensure Developer mode is enabled in Chrome
2. Check that the web app is running on `localhost:5177`
3. Refresh the extension if needed

### Data Not Syncing
1. Make sure the web app is open and loaded
2. Check browser console for error messages
3. Verify the extension has proper permissions

### Performance Issues
1. The extension updates every 30 seconds to minimize performance impact
2. Only active tab data is tracked in real-time
3. Data is stored efficiently in Chrome's local storage

## 📈 Future Enhancements

- [ ] Website categorization and productivity scoring
- [ ] Time-based notifications and alerts
- [ ] Advanced analytics and insights
- [ ] Integration with calendar and task management tools
- [ ] Team collaboration features

## 🤝 Contributing

This extension is part of the AI Time Doubler project. See the main project README for contribution guidelines.

## 📄 License

Same as the main AI Time Doubler project.

---

**Happy Productivity!** 🎯⚡ 