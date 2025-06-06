// AI Time Doubler - Content Script
// Handles communication between the extension and web app

(function() {
  'use strict';
  
  // Only run on the AI Time Doubler web app
  if (!window.location.href.includes('localhost:5180')) {
    return;
  }

  // Extension-to-WebApp communication bridge
  class ExtensionBridge {
    constructor() {
      this.isConnected = true;
      this.init();
    }

    init() {
      // Listen for messages from background script
      chrome.runtime.onMessage.addListener(this.handleExtensionMessage.bind(this));
      
      // Listen for messages from web app
      window.addEventListener('message', this.handleWebAppMessage.bind(this));
      
      // Notify web app that extension is available
      this.notifyWebApp('extensionReady', { connected: true });
      
      // Set up heartbeat
      setInterval(() => {
        this.notifyWebApp('extensionHeartbeat', { timestamp: Date.now() });
      }, 5000);
    }

    handleExtensionMessage(message, sender, sendResponse) {
      // Forward messages from extension to web app
      this.notifyWebApp(message.action, message.data);
    }

    handleWebAppMessage(event) {
      // Only accept messages from same origin
      if (event.origin !== window.location.origin) return;
      
      const { type, action, data } = event.data;
      
      if (type !== 'AI_TIME_DOUBLER_EXTENSION') return;
      
      console.log('Content script received message:', action);
      
      // Handle ping messages directly
      if (action === 'ping') {
        this.notifyWebApp('ping', { connected: true });
        return;
      }
      
      // Forward message to extension background script
      chrome.runtime.sendMessage({ action, ...data }, (response) => {
        // Send response back to web app
        this.notifyWebApp(`${action}Response`, response);
      });
    }

    notifyWebApp(action, data) {
      window.postMessage({
        type: 'AI_TIME_DOUBLER_EXTENSION_RESPONSE',
        action,
        data
      }, window.location.origin);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new ExtensionBridge();
    });
  } else {
    new ExtensionBridge();
  }

})(); 