import { Session, Tab, FocusBlock } from '../types/session';
import { SessionStorageService } from './sessionStorage';
import { aiService } from './aiService';
import { extensionService } from './extensionService';

export class SessionManager {
  private currentSession: Session | null = null;
  private sessionTimer: NodeJS.Timeout | null = null;
  private tabTracker: NodeJS.Timeout | null = null;
  private listeners: Set<(session: Session | null) => void> = new Set();
  private isExtensionMode = false;

  constructor() {
    this.loadCurrentSession();
    this.setupExtensionIntegration();
    this.startTracking();
  }

  private setupExtensionIntegration(): void {
    // Listen for extension connection
    extensionService.onMessage('extensionConnected', () => {
      console.log('Chrome extension connected');
      this.isExtensionMode = true;
      this.syncWithExtension();
    });

    // Listen for extension not found
    extensionService.onMessage('extensionNotFound', () => {
      console.log('Chrome extension not found, using simulated data');
      this.isExtensionMode = false;
    });

    // Listen for session updates from extension
    extensionService.onMessage('sessionUpdate', (session: Session) => {
      this.handleExtensionSessionUpdate(session);
    });

    // Listen for session lifecycle events
    extensionService.onMessage('sessionStarted', (session: Session) => {
      this.handleExtensionSessionStarted(session);
    });

    extensionService.onMessage('sessionEnded', (session: Session) => {
      this.handleExtensionSessionEnded(session);
    });
  }

  private async syncWithExtension(): Promise<void> {
    if (!extensionService.isAvailable()) return;

    try {
      const response = await extensionService.getCurrentSession();
      if (response?.session) {
        this.currentSession = response.session;
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to sync with extension:', error);
    }
  }

  private handleExtensionSessionUpdate(session: Session): void {
    this.currentSession = session;
    SessionStorageService.setCurrentSession(session);
    this.notifyListeners();
  }

  private handleExtensionSessionStarted(session: Session): void {
    this.currentSession = session;
    SessionStorageService.setCurrentSession(session);
    this.startSessionTimer();
    this.notifyListeners();
  }

  private async handleExtensionSessionEnded(session: Session): Promise<void> {
    // Generate AI summary for completed session
    if (session.duration && session.duration >= 10) {
      try {
        const summary = await aiService.generateSessionSummary(session);
        session.summary = summary;
      } catch (error) {
        console.error('Failed to generate AI summary:', error);
      }
    }

    // Save to permanent storage
    SessionStorageService.saveSession(session);
    SessionStorageService.setCurrentSession(null);

    // Update metrics
    const allSessions = SessionStorageService.getAllSessions();
    SessionStorageService.updateMetrics(allSessions);

    this.currentSession = null;
    this.stopSessionTimer();
    this.notifyListeners();
  }

  // Session Lifecycle
  async startSession(title?: string): Promise<Session> {
    // Use extension if available
    if (this.isExtensionMode && extensionService.isAvailable()) {
      try {
        const response = await extensionService.startSession(title);
        if (response?.session) {
          this.currentSession = response.session;
          this.startSessionTimer();
          this.notifyListeners();
          return response.session;
        }
      } catch (error) {
        console.error('Failed to start session via extension:', error);
        // Fall back to local mode
      }
    }

    // Local mode (fallback or when extension not available)
    // End current session if exists
    if (this.currentSession) {
      await this.endSession();
    }

    const session: Session = {
      id: SessionStorageService.generateId(),
      title: title || `Session ${new Date().toLocaleTimeString()}`,
      startTime: new Date(),
      status: 'active',
      tabs: [],
      focusBlocks: [],
      integrations: {},
      tags: [],
      notes: '',
      productivity: 3, // Default middle rating
      contextSwitches: 0
    };

    this.currentSession = session;
    SessionStorageService.setCurrentSession(session);
    this.notifyListeners();
    this.startSessionTimer();
    
    // Only start local tab tracking if extension is not available
    if (!this.isExtensionMode) {
      this.startTabTracking();
    }

    return session;
  }

  async pauseSession(): Promise<void> {
    if (!this.currentSession) return;

    // Use extension if available
    if (this.isExtensionMode && extensionService.isAvailable()) {
      try {
        await extensionService.pauseSession();
        return; // Extension will handle the update
      } catch (error) {
        console.error('Failed to pause session via extension:', error);
      }
    }

    // Local mode
    this.currentSession.status = 'paused';
    this.stopSessionTimer();
    this.stopTabTracking();
    SessionStorageService.setCurrentSession(this.currentSession);
    this.notifyListeners();
  }

  async resumeSession(): Promise<void> {
    if (!this.currentSession || this.currentSession.status !== 'paused') return;

    // Use extension if available
    if (this.isExtensionMode && extensionService.isAvailable()) {
      try {
        await extensionService.resumeSession();
        return; // Extension will handle the update
      } catch (error) {
        console.error('Failed to resume session via extension:', error);
      }
    }

    // Local mode
    this.currentSession.status = 'active';
    this.startSessionTimer();
    if (!this.isExtensionMode) {
      this.startTabTracking();
    }
    SessionStorageService.setCurrentSession(this.currentSession);
    this.notifyListeners();
  }

  async endSession(): Promise<Session | null> {
    if (!this.currentSession) return null;

    // Use extension if available
    if (this.isExtensionMode && extensionService.isAvailable()) {
      try {
        const response = await extensionService.endSession();
        if (response?.session) {
          return response.session; // Extension handles the complete flow
        }
      } catch (error) {
        console.error('Failed to end session via extension:', error);
      }
    }

    // Local mode
    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - this.currentSession.startTime.getTime()) / 1000 / 60);

    this.currentSession = {
      ...this.currentSession,
      endTime,
      duration,
      status: 'completed'
    };

    // End current focus block if exists
    if (this.currentSession.currentFocusBlock) {
      this.endFocusBlock();
    }

    // Generate AI summary for sessions longer than 10 minutes
    if (duration >= 10) {
      try {
        const summary = await aiService.generateSessionSummary(this.currentSession);
        this.currentSession.summary = summary;
      } catch (error) {
        console.error('Failed to generate AI summary:', error);
      }
    }

    // Save to permanent storage
    SessionStorageService.saveSession(this.currentSession);
    SessionStorageService.setCurrentSession(null);

    // Update metrics
    const allSessions = SessionStorageService.getAllSessions();
    SessionStorageService.updateMetrics(allSessions);

    const completedSession = this.currentSession;
    this.currentSession = null;

    this.stopSessionTimer();
    this.stopTabTracking();
    this.notifyListeners();

    return completedSession;
  }

  // AI Summary Methods
  async generateSummaryForSession(sessionId: string): Promise<void> {
    const session = SessionStorageService.getSession(sessionId);
    if (!session) return;

    try {
      const summary = await aiService.generateSessionSummary(session);
      session.summary = summary;
      SessionStorageService.saveSession(session);
    } catch (error) {
      console.error('Failed to generate summary for session:', error);
      throw error;
    }
  }

  async regenerateSummary(sessionId: string): Promise<void> {
    await this.generateSummaryForSession(sessionId);
  }

  // Tab Tracking
  addTab(title: string, url: string, favicon?: string): void {
    if (!this.currentSession) return;

    const domain = this.extractDomain(url);
    const existingTab = this.currentSession.tabs.find(tab => tab.url === url);

    if (existingTab) {
      // Update existing tab
      existingTab.title = title;
      existingTab.lastActive = new Date();
      this.currentSession.activeTabId = existingTab.id;
    } else {
      // Add new tab
      const tab: Tab = {
        id: SessionStorageService.generateId(),
        title,
        url,
        favicon,
        domain,
        timeSpent: 0,
        lastActive: new Date()
      };

      this.currentSession.tabs.push(tab);
      this.currentSession.activeTabId = tab.id;
      this.currentSession.contextSwitches++;
    }

    SessionStorageService.setCurrentSession(this.currentSession);
    this.notifyListeners();
  }

  updateActiveTab(url: string): void {
    if (!this.currentSession) return;

    const tab = this.currentSession.tabs.find(tab => tab.url === url);
    if (tab) {
      this.currentSession.activeTabId = tab.id;
      tab.lastActive = new Date();
      SessionStorageService.setCurrentSession(this.currentSession);
      this.notifyListeners();
    }
  }

  removeTab(url: string): void {
    if (!this.currentSession) return;

    this.currentSession.tabs = this.currentSession.tabs.filter(tab => tab.url !== url);
    SessionStorageService.setCurrentSession(this.currentSession);
    this.notifyListeners();
  }

  // Focus Blocks
  async startFocusBlock(type: FocusBlock['type'], description?: string): Promise<void> {
    if (!this.currentSession) return;

    // Use extension if available
    if (this.isExtensionMode && extensionService.isAvailable()) {
      try {
        await extensionService.addFocusBlock(type, description || '');
        return; // Extension will handle the update
      } catch (error) {
        console.error('Failed to start focus block via extension:', error);
      }
    }

    // Local mode
    // End current focus block if exists
    if (this.currentSession.currentFocusBlock) {
      this.endFocusBlock();
    }

    const focusBlock: FocusBlock = {
      id: SessionStorageService.generateId(),
      type,
      startTime: new Date(),
      description
    };

    this.currentSession.focusBlocks.push(focusBlock);
    this.currentSession.currentFocusBlock = focusBlock;
    SessionStorageService.setCurrentSession(this.currentSession);
    this.notifyListeners();
  }

  endFocusBlock(): void {
    if (!this.currentSession?.currentFocusBlock) return;

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - this.currentSession.currentFocusBlock.startTime.getTime()) / 1000 / 60);

    // Update the focus block in the array
    const blockIndex = this.currentSession.focusBlocks.findIndex(
      block => block.id === this.currentSession!.currentFocusBlock!.id
    );

    if (blockIndex >= 0) {
      this.currentSession.focusBlocks[blockIndex] = {
        ...this.currentSession.focusBlocks[blockIndex],
        endTime,
        duration
      };
    }

    this.currentSession.currentFocusBlock = undefined;
    SessionStorageService.setCurrentSession(this.currentSession);
    this.notifyListeners();
  }

  // Metadata Updates
  updateSessionTitle(title: string): void {
    if (!this.currentSession) return;

    this.currentSession.title = title;
    SessionStorageService.setCurrentSession(this.currentSession);
    this.notifyListeners();
  }

  updateProductivity(rating: number): void {
    if (!this.currentSession) return;

    this.currentSession.productivity = Math.max(1, Math.min(5, rating));
    SessionStorageService.setCurrentSession(this.currentSession);
    this.notifyListeners();
  }

  addNote(note: string): void {
    if (!this.currentSession) return;

    this.currentSession.notes = note;
    SessionStorageService.setCurrentSession(this.currentSession);
    this.notifyListeners();
  }

  addTag(tag: string): void {
    if (!this.currentSession) return;

    if (!this.currentSession.tags.includes(tag)) {
      this.currentSession.tags.push(tag);
      SessionStorageService.setCurrentSession(this.currentSession);
      this.notifyListeners();
    }
  }

  removeTag(tag: string): void {
    if (!this.currentSession) return;

    this.currentSession.tags = this.currentSession.tags.filter(t => t !== tag);
    SessionStorageService.setCurrentSession(this.currentSession);
    this.notifyListeners();
  }

  // Getters
  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  isSessionActive(): boolean {
    return this.currentSession?.status === 'active';
  }

  getSessionDuration(): number {
    if (!this.currentSession) return 0;
    return Math.round((Date.now() - this.currentSession.startTime.getTime()) / 1000 / 60);
  }

  // Event Listeners
  addListener(callback: (session: Session | null) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Private Methods
  private loadCurrentSession(): void {
    this.currentSession = SessionStorageService.getCurrentSession();
    
    // If session was active but page was refreshed, pause it
    if (this.currentSession?.status === 'active') {
      this.currentSession.status = 'paused';
      SessionStorageService.setCurrentSession(this.currentSession);
    }
  }

  private startTracking(): void {
    // Load session if exists
    if (this.currentSession?.status === 'paused') {
      // Auto-resume if session was recently paused (within 5 minutes)
      const pauseTime = Date.now() - this.currentSession.startTime.getTime();
      if (pauseTime < 5 * 60 * 1000) {
        this.resumeSession();
      }
    }
  }

  private startSessionTimer(): void {
    this.sessionTimer = setInterval(() => {
      this.updateActiveTabTime();
    }, 30000); // Update every 30 seconds
  }

  private stopSessionTimer(): void {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  private startTabTracking(): void {
    // Simulate tab tracking (in real implementation, this would use browser APIs)
    this.tabTracker = setInterval(() => {
      this.simulateTabActivity();
    }, 10000); // Check every 10 seconds
  }

  private stopTabTracking(): void {
    if (this.tabTracker) {
      clearInterval(this.tabTracker);
      this.tabTracker = null;
    }
  }

  private updateActiveTabTime(): void {
    if (!this.currentSession?.activeTabId) return;

    const activeTab = this.currentSession.tabs.find(tab => tab.id === this.currentSession!.activeTabId);
    if (activeTab) {
      activeTab.timeSpent += 30; // 30 seconds
      SessionStorageService.setCurrentSession(this.currentSession);
    }
  }

  private simulateTabActivity(): void {
    // This simulates tab switching for demo purposes
    // In real implementation, this would use browser extension APIs
    if (!this.currentSession || this.currentSession.tabs.length === 0) return;

    const shouldSimulateSwitch = Math.random() < 0.3; // 30% chance
    if (shouldSimulateSwitch && this.currentSession.tabs.length > 1) {
      const randomTab = this.currentSession.tabs[Math.floor(Math.random() * this.currentSession.tabs.length)];
      this.updateActiveTab(randomTab.url);
    }
  }

  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return 'unknown';
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.currentSession));
  }

  // Cleanup
  destroy(): void {
    this.stopSessionTimer();
    this.stopTabTracking();
    this.listeners.clear();
  }
}

// Singleton instance
export const sessionManager = new SessionManager(); 