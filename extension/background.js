// AI Time Doubler - Background Service Worker
// Handles real-time tab tracking and session management

class TabTracker {
  constructor() {
    this.currentSession = null;
    this.activeTabId = null;
    this.lastActiveTime = Date.now();
    this.tabStartTimes = new Map();
    this.contextSwitches = 0;
    this.webAppUrl = 'http://localhost:5177'; // Update based on your dev server
    
    this.init();
  }

  init() {
    // Listen for tab activation
    chrome.tabs.onActivated.addListener(this.handleTabActivated.bind(this));
    
    // Listen for tab updates
    chrome.tabs.onUpdated.addListener(this.handleTabUpdated.bind(this));
    
    // Listen for tab removal
    chrome.tabs.onRemoved.addListener(this.handleTabRemoved.bind(this));
    
    // Listen for window focus changes
    chrome.windows.onFocusChanged.addListener(this.handleWindowFocusChanged.bind(this));
    
    // Periodic updates every 30 seconds
    chrome.alarms.create('updateSession', { periodInMinutes: 0.5 });
    chrome.alarms.onAlarm.addListener(this.handleAlarm.bind(this));
    
    // Listen for messages from content scripts and popup
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    
    // Initialize session data
    this.loadSession();
  }

  async loadSession() {
    const result = await chrome.storage.local.get(['currentSession']);
    if (result.currentSession) {
      this.currentSession = {
        ...result.currentSession,
        startTime: new Date(result.currentSession.startTime)
      };
    }
  }

  async saveSession() {
    if (this.currentSession) {
      await chrome.storage.local.set({ currentSession: this.currentSession });
      await this.sendToWebApp('sessionUpdate', this.currentSession);
    }
  }

  async handleTabActivated(activeInfo) {
    const tabId = activeInfo.tabId;
    const now = Date.now();
    
    // Update previous tab time
    if (this.activeTabId && this.tabStartTimes.has(this.activeTabId)) {
      await this.updateTabTime(this.activeTabId, now);
    }
    
    // Set new active tab
    this.activeTabId = tabId;
    this.tabStartTimes.set(tabId, now);
    this.lastActiveTime = now;
    
    // Count context switch
    if (this.currentSession && this.activeTabId) {
      this.contextSwitches++;
      this.currentSession.contextSwitches = this.contextSwitches;
    }
    
    // Get tab info and update session
    try {
      const tab = await chrome.tabs.get(tabId);
      await this.updateCurrentTab(tab);
    } catch (error) {
      console.error('Error getting tab info:', error);
    }
  }

  async handleTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url && tab.title) {
      // Update tab information when page loads
      if (tabId === this.activeTabId) {
        await this.updateCurrentTab(tab);
      }
    }
  }

  async handleTabRemoved(tabId) {
    // Clean up removed tab
    if (this.tabStartTimes.has(tabId)) {
      if (tabId === this.activeTabId) {
        await this.updateTabTime(tabId, Date.now());
      }
      this.tabStartTimes.delete(tabId);
    }
    
    // Remove from session
    if (this.currentSession) {
      this.currentSession.tabs = this.currentSession.tabs.filter(tab => tab.id !== tabId.toString());
      await this.saveSession();
    }
  }

  async handleWindowFocusChanged(windowId) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      // Window lost focus
      if (this.activeTabId) {
        await this.updateTabTime(this.activeTabId, Date.now());
      }
    } else {
      // Window gained focus
      try {
        const tabs = await chrome.tabs.query({ active: true, windowId: windowId });
        if (tabs.length > 0) {
          await this.handleTabActivated({ tabId: tabs[0].id });
        }
      } catch (error) {
        console.error('Error handling window focus:', error);
      }
    }
  }

  async handleAlarm(alarm) {
    if (alarm.name === 'updateSession') {
      // Update current tab time
      if (this.activeTabId && this.tabStartTimes.has(this.activeTabId)) {
        await this.updateTabTime(this.activeTabId, Date.now());
      }
      
      // Send session update to web app
      await this.saveSession();
    }
  }

  async updateTabTime(tabId, endTime) {
    const startTime = this.tabStartTimes.get(tabId);
    if (!startTime || !this.currentSession) return;
    
    const timeSpent = Math.round((endTime - startTime) / 1000); // seconds
    
    // Find and update tab in session
    const tabIndex = this.currentSession.tabs.findIndex(tab => tab.id === tabId.toString());
    if (tabIndex >= 0) {
      this.currentSession.tabs[tabIndex].timeSpent += timeSpent;
      this.currentSession.tabs[tabIndex].lastActive = new Date();
    }
    
    // Reset start time
    this.tabStartTimes.set(tabId, endTime);
  }

  async updateCurrentTab(tab) {
    if (!this.currentSession || !tab.url || tab.url.startsWith('chrome://')) return;
    
    const domain = this.extractDomain(tab.url);
    const favicon = tab.favIconUrl || this.generateFavicon(domain);
    
    // Check if tab already exists
    const existingTabIndex = this.currentSession.tabs.findIndex(t => t.url === tab.url);
    
    if (existingTabIndex >= 0) {
      // Update existing tab
      this.currentSession.tabs[existingTabIndex].title = tab.title;
      this.currentSession.tabs[existingTabIndex].lastActive = new Date();
      this.currentSession.activeTabId = this.currentSession.tabs[existingTabIndex].id;
    } else {
      // Add new tab
      const newTab = {
        id: tab.id.toString(),
        title: tab.title,
        url: tab.url,
        favicon: favicon,
        domain: domain,
        timeSpent: 0,
        lastActive: new Date()
      };
      
      this.currentSession.tabs.push(newTab);
      this.currentSession.activeTabId = newTab.id;
    }
    
    await this.saveSession();
  }

  async handleMessage(request, sender, sendResponse) {
    switch (request.action) {
      case 'startSession':
        await this.startSession(request.title);
        sendResponse({ success: true, session: this.currentSession });
        break;
        
      case 'endSession':
        const endedSession = await this.endSession();
        sendResponse({ success: true, session: endedSession });
        break;
        
      case 'pauseSession':
        await this.pauseSession();
        sendResponse({ success: true, session: this.currentSession });
        break;
        
      case 'resumeSession':
        await this.resumeSession();
        sendResponse({ success: true, session: this.currentSession });
        break;
        
      case 'getCurrentSession':
        sendResponse({ session: this.currentSession });
        break;
        
      case 'addFocusBlock':
        await this.addFocusBlock(request.type, request.description);
        sendResponse({ success: true, session: this.currentSession });
        break;
        
      default:
        sendResponse({ error: 'Unknown action' });
    }
    
    return true; // Keep message channel open for async response
  }

  async startSession(title) {
    // End current session if exists
    if (this.currentSession) {
      await this.endSession();
    }
    
    this.currentSession = {
      id: this.generateId(),
      title: title || `Session ${new Date().toLocaleTimeString()}`,
      startTime: new Date(),
      status: 'active',
      tabs: [],
      focusBlocks: [],
      integrations: {},
      tags: [],
      notes: '',
      productivity: 3,
      contextSwitches: 0
    };
    
    this.contextSwitches = 0;
    
    // Get current active tab
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs.length > 0) {
        await this.updateCurrentTab(tabs[0]);
        this.activeTabId = tabs[0].id;
        this.tabStartTimes.set(tabs[0].id, Date.now());
      }
    } catch (error) {
      console.error('Error getting current tab:', error);
    }
    
    await this.saveSession();
    await this.sendToWebApp('sessionStarted', this.currentSession);
  }

  async endSession() {
    if (!this.currentSession) return null;
    
    // Update final tab times
    if (this.activeTabId && this.tabStartTimes.has(this.activeTabId)) {
      await this.updateTabTime(this.activeTabId, Date.now());
    }
    
    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - this.currentSession.startTime.getTime()) / 1000 / 60);
    
    const completedSession = {
      ...this.currentSession,
      endTime,
      duration,
      status: 'completed'
    };
    
    // Save completed session
    await this.saveCompletedSession(completedSession);
    await this.sendToWebApp('sessionEnded', completedSession);
    
    // Clear current session
    this.currentSession = null;
    this.activeTabId = null;
    this.tabStartTimes.clear();
    this.contextSwitches = 0;
    
    await chrome.storage.local.remove(['currentSession']);
    
    return completedSession;
  }

  async pauseSession() {
    if (!this.currentSession) return;
    
    this.currentSession.status = 'paused';
    
    // Update final tab time
    if (this.activeTabId && this.tabStartTimes.has(this.activeTabId)) {
      await this.updateTabTime(this.activeTabId, Date.now());
    }
    
    await this.saveSession();
  }

  async resumeSession() {
    if (!this.currentSession) return;
    
    this.currentSession.status = 'active';
    
    // Restart timing for current tab
    if (this.activeTabId) {
      this.tabStartTimes.set(this.activeTabId, Date.now());
    }
    
    await this.saveSession();
  }

  async addFocusBlock(type, description) {
    if (!this.currentSession) return;
    
    const focusBlock = {
      id: this.generateId(),
      type: type,
      startTime: new Date(),
      description: description
    };
    
    this.currentSession.focusBlocks.push(focusBlock);
    await this.saveSession();
  }

  async saveCompletedSession(session) {
    const result = await chrome.storage.local.get(['completedSessions']);
    const completedSessions = result.completedSessions || [];
    completedSessions.push(session);
    await chrome.storage.local.set({ completedSessions });
  }

  async sendToWebApp(action, data) {
    // Send data to web app if it's open
    try {
      const tabs = await chrome.tabs.query({ url: `${this.webAppUrl}/*` });
      for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id, { action, data }).catch(() => {
          // Ignore errors if web app is not ready to receive messages
        });
      }
    } catch (error) {
      // Ignore errors - web app might not be open
    }
  }

  extractDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return 'unknown';
    }
  }

  generateFavicon(domain) {
    return `https://www.google.com/s2/favicons?domain=${domain}`;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Initialize the tracker
const tabTracker = new TabTracker();

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Time Doubler extension installed');
}); 