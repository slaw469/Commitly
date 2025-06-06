// AI Time Doubler - Popup Script
// Handles popup UI and communication with background script

class PopupController {
  constructor() {
    this.currentSession = null;
    this.updateInterval = null;
    this.init();
  }

  init() {
    // Get DOM elements
    this.elements = {
      loading: document.getElementById('loading'),
      mainContent: document.getElementById('main-content'),
      statusIndicator: document.getElementById('status-indicator'),
      sessionTitle: document.getElementById('session-title'),
      sessionDuration: document.getElementById('session-duration'),
      tabCount: document.getElementById('tab-count'),
      contextSwitches: document.getElementById('context-switches'),
      startSession: document.getElementById('start-session'),
      pauseSession: document.getElementById('pause-session'),
      resumeSession: document.getElementById('resume-session'),
      endSession: document.getElementById('end-session'),
      addFocus: document.getElementById('add-focus'),
      addBreak: document.getElementById('add-break'),
      viewStats: document.getElementById('view-stats'),
      exportData: document.getElementById('export-data'),
      openDashboard: document.getElementById('open-dashboard')
    };

    // Add event listeners
    this.setupEventListeners();
    
    // Load current session
    this.loadCurrentSession();
    
    // Start periodic updates
    this.startPeriodicUpdates();
  }

  setupEventListeners() {
    this.elements.startSession.addEventListener('click', () => this.startSession());
    this.elements.pauseSession.addEventListener('click', () => this.pauseSession());
    this.elements.resumeSession.addEventListener('click', () => this.resumeSession());
    this.elements.endSession.addEventListener('click', () => this.endSession());
    this.elements.addFocus.addEventListener('click', () => this.addFocusBlock());
    this.elements.addBreak.addEventListener('click', () => this.addBreakBlock());
    this.elements.viewStats.addEventListener('click', () => this.viewStats());
    this.elements.exportData.addEventListener('click', () => this.exportData());
    this.elements.openDashboard.addEventListener('click', () => this.openDashboard());
  }

  async loadCurrentSession() {
    try {
      const response = await this.sendMessage('getCurrentSession');
      this.currentSession = response.session;
      this.updateUI();
      this.hideLoading();
    } catch (error) {
      console.error('Failed to load session:', error);
      this.hideLoading();
    }
  }

  updateUI() {
    if (!this.currentSession) {
      // No active session
      this.elements.statusIndicator.className = 'status-indicator status-inactive';
      this.elements.sessionTitle.textContent = 'No Active Session';
      this.elements.sessionDuration.textContent = '--:--';
      this.elements.tabCount.textContent = '0 tabs';
      this.elements.contextSwitches.textContent = '0 switches';
      
      this.showButton('startSession');
      this.hideButton('pauseSession');
      this.hideButton('resumeSession');
      this.hideButton('endSession');
    } else {
      // Active session
      const status = this.currentSession.status;
      this.elements.statusIndicator.className = `status-indicator status-${status}`;
      this.elements.sessionTitle.textContent = this.currentSession.title;
      
      // Calculate duration
      const duration = this.calculateDuration(this.currentSession.startTime);
      this.elements.sessionDuration.textContent = this.formatDuration(duration);
      
      // Update stats
      this.elements.tabCount.textContent = `${this.currentSession.tabs.length} tabs`;
      this.elements.contextSwitches.textContent = `${this.currentSession.contextSwitches || 0} switches`;
      
      // Update buttons based on status
      if (status === 'active') {
        this.hideButton('startSession');
        this.showButton('pauseSession');
        this.hideButton('resumeSession');
        this.showButton('endSession');
      } else if (status === 'paused') {
        this.hideButton('startSession');
        this.hideButton('pauseSession');
        this.showButton('resumeSession');
        this.showButton('endSession');
      }
    }
  }

  showButton(buttonName) {
    this.elements[buttonName].classList.remove('hidden');
  }

  hideButton(buttonName) {
    this.elements[buttonName].classList.add('hidden');
  }

  hideLoading() {
    this.elements.loading.classList.add('hidden');
    this.elements.mainContent.classList.remove('hidden');
  }

  async startSession() {
    const title = prompt('Session title (optional):') || `Session ${new Date().toLocaleTimeString()}`;
    
    try {
      const response = await this.sendMessage('startSession', { title });
      if (response.success) {
        this.currentSession = response.session;
        this.updateUI();
      }
    } catch (error) {
      console.error('Failed to start session:', error);
      alert('Failed to start session');
    }
  }

  async pauseSession() {
    try {
      const response = await this.sendMessage('pauseSession');
      if (response.success) {
        this.currentSession = response.session;
        this.updateUI();
      }
    } catch (error) {
      console.error('Failed to pause session:', error);
    }
  }

  async resumeSession() {
    try {
      const response = await this.sendMessage('resumeSession');
      if (response.success) {
        this.currentSession = response.session;
        this.updateUI();
      }
    } catch (error) {
      console.error('Failed to resume session:', error);
    }
  }

  async endSession() {
    if (!confirm('Are you sure you want to end this session?')) {
      return;
    }

    try {
      const response = await this.sendMessage('endSession');
      if (response.success) {
        this.currentSession = null;
        this.updateUI();
      }
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }

  async addFocusBlock() {
    const description = prompt('Focus block description:');
    if (!description) return;

    try {
      await this.sendMessage('addFocusBlock', {
        type: 'focus',
        description: description
      });
    } catch (error) {
      console.error('Failed to add focus block:', error);
    }
  }

  async addBreakBlock() {
    try {
      await this.sendMessage('addFocusBlock', {
        type: 'break',
        description: 'Break time'
      });
    } catch (error) {
      console.error('Failed to add break block:', error);
    }
  }

  viewStats() {
    this.openDashboard();
  }

  async exportData() {
    try {
      // Get completed sessions from storage
      const result = await chrome.storage.local.get(['completedSessions']);
      const sessions = result.completedSessions || [];
      
      const dataStr = JSON.stringify(sessions, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-time-doubler-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data');
    }
  }

  openDashboard() {
    chrome.tabs.create({ 
      url: 'http://localhost:5177',
      active: true 
    });
    window.close();
  }

  startPeriodicUpdates() {
    // Update UI every 5 seconds when session is active
    this.updateInterval = setInterval(() => {
      if (this.currentSession && this.currentSession.status === 'active') {
        this.updateUI();
      }
    }, 5000);
  }

  calculateDuration(startTime) {
    if (!startTime) return 0;
    return Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }

  sendMessage(action, data = {}) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action, ...data }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
}); 