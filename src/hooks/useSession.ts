import { useState, useEffect } from 'react';
import { Session } from '../types/session';
import { sessionManager } from '../services/sessionManager';
import { SessionStorageService } from '../services/sessionStorage';
import { aiService } from '../services/aiService';

export function useSession() {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load
    setCurrentSession(sessionManager.getCurrentSession());
    setIsLoading(false);

    // Subscribe to session updates
    const unsubscribe = sessionManager.addListener((session) => {
      setCurrentSession(session);
    });

    return unsubscribe;
  }, []);

  const endSession = async () => {
    try {
      return await sessionManager.endSession();
    } catch (error) {
      console.error('Error ending session:', error);
      return null;
    }
  };

  return {
    // Session state
    currentSession,
    isLoading,
    isActive: sessionManager.isSessionActive(),
    duration: sessionManager.getSessionDuration(),

    // Session actions
    startSession: (title?: string) => sessionManager.startSession(title),
    pauseSession: () => sessionManager.pauseSession(),
    resumeSession: () => sessionManager.resumeSession(),
    endSession,

    // Tab management
    addTab: (title: string, url: string, favicon?: string) => 
      sessionManager.addTab(title, url, favicon),
    updateActiveTab: (url: string) => sessionManager.updateActiveTab(url),
    removeTab: (url: string) => sessionManager.removeTab(url),

    // Focus blocks
    startFocusBlock: (type: any, description?: string) => 
      sessionManager.startFocusBlock(type, description),
    endFocusBlock: () => sessionManager.endFocusBlock(),

    // Metadata
    updateTitle: (title: string) => sessionManager.updateSessionTitle(title),
    updateProductivity: (rating: number) => sessionManager.updateProductivity(rating),
    addNote: (note: string) => sessionManager.addNote(note),
    addTag: (tag: string) => sessionManager.addTag(tag),
    removeTag: (tag: string) => sessionManager.removeTag(tag),
  };
}

export function useSessionHistory() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [metrics, setMetrics] = useState(SessionStorageService.getMetrics());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    setIsLoading(true);
    const allSessions = SessionStorageService.getAllSessions();
    const sessionMetrics = SessionStorageService.getMetrics();
    
    setSessions(allSessions);
    setMetrics(sessionMetrics);
    setIsLoading(false);
  };

  const deleteSession = (id: string) => {
    SessionStorageService.deleteSession(id);
    loadSessions();
  };

  const exportData = () => {
    return SessionStorageService.exportData();
  };

  const importData = (data: string) => {
    const success = SessionStorageService.importData(data);
    if (success) {
      loadSessions();
    }
    return success;
  };

  const clearAllData = () => {
    SessionStorageService.clearAllData();
    loadSessions();
  };

  const generateSummary = async (sessionId: string) => {
    try {
      await sessionManager.generateSummaryForSession(sessionId);
      loadSessions();
    } catch (error) {
      console.error('Failed to generate summary:', error);
      throw error;
    }
  };

  return {
    sessions,
    metrics,
    isLoading,
    deleteSession,
    exportData,
    importData,
    clearAllData,
    generateSummary,
    refresh: loadSessions
  };
}

export function useAI() {
  const [hasApiKey, setHasApiKey] = useState(aiService.hasApiKey());

  const setApiKey = (key: string) => {
    aiService.setApiKey(key);
    setHasApiKey(true);
  };

  const generateInsights = async (sessions: Session[]) => {
    return await aiService.generateProductivityInsights(sessions);
  };

  return {
    hasApiKey,
    setApiKey,
    generateInsights
  };
} 