// Extension Service - Bridge between web app and Chrome extension
// Handles real-time data synchronization from browser extension

export interface ExtensionMessage {
  type: string;
  action: string;
  data: any;
}

export interface ExtensionResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class ExtensionService {
  private isExtensionAvailable = false;
  private messageHandlers = new Map<string, Function>();
  private pendingRequests = new Map<string, { resolve: Function; reject: Function }>();
  private requestId = 0;

  constructor() {
    this.init();
  }

  private init() {
    // Listen for messages from extension content script
    window.addEventListener('message', this.handleMessage.bind(this));
    
    // Check if extension is available
    this.checkExtensionAvailability();
  }

  private handleMessage(event: MessageEvent) {
    if (event.origin !== window.location.origin) return;
    
    const { type, action, data } = event.data;
    
    if (type !== 'AI_TIME_DOUBLER_EXTENSION_RESPONSE') return;
    
    // Handle extension status updates
    if (action === 'extensionReady') {
      this.isExtensionAvailable = true;
      this.notifyHandlers('extensionConnected', data);
      return;
    }
    
    if (action === 'extensionHeartbeat') {
      this.isExtensionAvailable = true;
      return;
    }
    
    // Handle session updates from extension
    if (action === 'sessionUpdate') {
      this.notifyHandlers('sessionUpdate', data);
      return;
    }
    
    if (action === 'sessionStarted') {
      this.notifyHandlers('sessionStarted', data);
      return;
    }
    
    if (action === 'sessionEnded') {
      this.notifyHandlers('sessionEnded', data);
      return;
    }
    
    // Handle response messages
    if (action.endsWith('Response')) {
      const baseAction = action.replace('Response', '');
      const handler = this.pendingRequests.get(baseAction);
      if (handler) {
        this.pendingRequests.delete(baseAction);
        if (data?.error) {
          handler.reject(new Error(data.error));
        } else {
          handler.resolve(data);
        }
      }
      return;
    }
    
    // Notify registered handlers
    this.notifyHandlers(action, data);
  }

  private notifyHandlers(action: string, data: any) {
    const handler = this.messageHandlers.get(action);
    if (handler) {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in extension message handler for ${action}:`, error);
      }
    }
  }

  private checkExtensionAvailability() {
    // Send a ping to check if extension content script is loaded
    window.postMessage({
      type: 'AI_TIME_DOUBLER_EXTENSION',
      action: 'ping',
      data: {}
    }, window.location.origin);
    
    // Set timeout to check extension availability
    setTimeout(() => {
      if (!this.isExtensionAvailable) {
        console.warn('AI Time Doubler Chrome extension not detected');
        this.notifyHandlers('extensionNotFound', {});
      }
    }, 2000);
  }

  // Public API methods
  
  public isAvailable(): boolean {
    return this.isExtensionAvailable;
  }

  public onMessage(action: string, handler: Function): void {
    this.messageHandlers.set(action, handler);
  }

  public offMessage(action: string): void {
    this.messageHandlers.delete(action);
  }

  public async startSession(title?: string): Promise<any> {
    return this.sendMessage('startSession', { title });
  }

  public async endSession(): Promise<any> {
    return this.sendMessage('endSession');
  }

  public async pauseSession(): Promise<any> {
    return this.sendMessage('pauseSession');
  }

  public async resumeSession(): Promise<any> {
    return this.sendMessage('resumeSession');
  }

  public async getCurrentSession(): Promise<any> {
    return this.sendMessage('getCurrentSession');
  }

  public async addFocusBlock(type: string, description: string): Promise<any> {
    return this.sendMessage('addFocusBlock', { type, description });
  }

  private async sendMessage(action: string, data: any = {}): Promise<any> {
    if (!this.isExtensionAvailable) {
      throw new Error('Chrome extension not available');
    }

    return new Promise((resolve, reject) => {
      const requestId = (++this.requestId).toString();
      
      // Store the promise handlers
      this.pendingRequests.set(action, { resolve, reject });
      
      // Send message to extension
      window.postMessage({
        type: 'AI_TIME_DOUBLER_EXTENSION',
        action,
        data: { ...data, requestId }
      }, window.location.origin);
      
      // Set timeout for request
      setTimeout(() => {
        if (this.pendingRequests.has(action)) {
          this.pendingRequests.delete(action);
          reject(new Error(`Extension request timeout: ${action}`));
        }
      }, 10000);
    });
  }
}

// Create singleton instance
export const extensionService = new ExtensionService();

// Export types
export type { ExtensionMessage, ExtensionResponse }; 