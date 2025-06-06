import { Session, SessionMetrics, Tab, FocusBlock } from '../types/session';

const STORAGE_KEYS = {
  SESSIONS: 'ai-time-doubler-sessions',
  CURRENT_SESSION: 'ai-time-doubler-current-session',
  METRICS: 'ai-time-doubler-metrics',
  SETTINGS: 'ai-time-doubler-settings'
};

export class SessionStorageService {
  // Session Management
  static getAllSessions(): Session[] {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!data) return [];
    
    try {
      const sessions = JSON.parse(data);
      return sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined,
        tabs: session.tabs.map((tab: any) => ({
          ...tab,
          lastActive: new Date(tab.lastActive)
        })),
        focusBlocks: session.focusBlocks.map((block: any) => ({
          ...block,
          startTime: new Date(block.startTime),
          endTime: block.endTime ? new Date(block.endTime) : undefined
        }))
      }));
    } catch (error) {
      console.error('Error parsing sessions from localStorage:', error);
      return [];
    }
  }

  static saveSession(session: Session): void {
    const sessions = this.getAllSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }

  static getSession(id: string): Session | null {
    const sessions = this.getAllSessions();
    return sessions.find(s => s.id === id) || null;
  }

  static deleteSession(id: string): void {
    const sessions = this.getAllSessions();
    const filtered = sessions.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(filtered));
  }

  // Current Session Management
  static getCurrentSession(): Session | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    if (!data) return null;
    
    try {
      const session = JSON.parse(data);
      return {
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined,
        tabs: session.tabs.map((tab: any) => ({
          ...tab,
          lastActive: new Date(tab.lastActive)
        })),
        focusBlocks: session.focusBlocks.map((block: any) => ({
          ...block,
          startTime: new Date(block.startTime),
          endTime: block.endTime ? new Date(block.endTime) : undefined
        }))
      };
    } catch (error) {
      console.error('Error parsing current session:', error);
      return null;
    }
  }

  static setCurrentSession(session: Session | null): void {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    }
  }

  // Metrics
  static getMetrics(): SessionMetrics {
    const data = localStorage.getItem(STORAGE_KEYS.METRICS);
    if (!data) {
      return {
        totalSessions: 0,
        totalFocusTime: 0,
        averageProductivity: 0,
        topDomains: [],
        contextSwitchesPerDay: 0,
        productivityTrend: []
      };
    }
    
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing metrics:', error);
      return {
        totalSessions: 0,
        totalFocusTime: 0,
        averageProductivity: 0,
        topDomains: [],
        contextSwitchesPerDay: 0,
        productivityTrend: []
      };
    }
  }

  static updateMetrics(sessions: Session[]): void {
    const metrics = this.calculateMetrics(sessions);
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
  }

  private static calculateMetrics(sessions: Session[]): SessionMetrics {
    const completedSessions = sessions.filter(s => s.status === 'completed');
    
    const totalFocusTime = completedSessions.reduce((total, session) => {
      return total + (session.duration || 0);
    }, 0);

    const averageProductivity = completedSessions.length > 0 
      ? completedSessions.reduce((sum, s) => sum + s.productivity, 0) / completedSessions.length
      : 0;

    // Calculate top domains
    const domainMap = new Map<string, number>();
    completedSessions.forEach(session => {
      session.tabs.forEach(tab => {
        const current = domainMap.get(tab.domain) || 0;
        domainMap.set(tab.domain, current + tab.timeSpent);
      });
    });

    const topDomains = Array.from(domainMap.entries())
      .map(([domain, timeSpent]) => ({ domain, timeSpent }))
      .sort((a, b) => b.timeSpent - a.timeSpent)
      .slice(0, 10);

    // Calculate context switches per day
    const totalContextSwitches = completedSessions.reduce((sum, s) => sum + s.contextSwitches, 0);
    const daysWithSessions = new Set(completedSessions.map(s => s.startTime.toDateString())).size;
    const contextSwitchesPerDay = daysWithSessions > 0 ? totalContextSwitches / daysWithSessions : 0;

    // Calculate productivity trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSessions = completedSessions.filter(s => s.startTime >= thirtyDaysAgo);
    const dailyProductivity = new Map<string, number[]>();
    
    recentSessions.forEach(session => {
      const dateStr = session.startTime.toDateString();
      if (!dailyProductivity.has(dateStr)) {
        dailyProductivity.set(dateStr, []);
      }
      dailyProductivity.get(dateStr)!.push(session.productivity);
    });

    const productivityTrend = Array.from(dailyProductivity.entries())
      .map(([date, scores]) => ({
        date,
        score: scores.reduce((sum, score) => sum + score, 0) / scores.length
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      totalSessions: completedSessions.length,
      totalFocusTime,
      averageProductivity,
      topDomains,
      contextSwitchesPerDay,
      productivityTrend
    };
  }

  // Utility methods
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static exportData(): string {
    const sessions = this.getAllSessions();
    const metrics = this.getMetrics();
    return JSON.stringify({ sessions, metrics }, null, 2);
  }

  static importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      if (parsed.sessions) {
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(parsed.sessions));
      }
      if (parsed.metrics) {
        localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(parsed.metrics));
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
} 