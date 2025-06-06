export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  timeSpent: number; // in seconds
  lastActive: Date;
  domain: string;
}

export interface FocusBlock {
  id: string;
  type: 'DEEP_WORK' | 'MEETING' | 'RESEARCH' | 'CODING' | 'WRITING' | 'PLANNING';
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  description?: string;
}

export interface Integration {
  github?: {
    commits: number;
    branch: string;
    repository?: string;
    lastCommit?: Date;
    pullRequests?: number;
  };
  notion?: {
    pages: number;
    lastUpdate: string;
    recentPages?: string[];
  };
  calendar?: {
    meetings: number;
    nextMeeting?: Date;
    focusBlocks?: FocusBlock[];
  };
}

export interface SessionSummary {
  id: string;
  content: string;
  keyPoints: string[];
  nextSteps: string[];
  focusArea: string;
  confidence: number; // 0-1
  generatedAt: Date;
}

export interface Session {
  id: string;
  title: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  status: 'active' | 'paused' | 'completed';
  
  // Content tracking
  tabs: Tab[];
  activeTabId?: string;
  
  // Context
  focusBlocks: FocusBlock[];
  currentFocusBlock?: FocusBlock;
  
  // AI generated
  summary?: SessionSummary;
  
  // Integrations
  integrations: Integration;
  
  // Metadata
  tags: string[];
  notes: string;
  productivity: number; // 1-5 rating
  contextSwitches: number;
}

export interface SessionMetrics {
  totalSessions: number;
  totalFocusTime: number; // in minutes
  averageProductivity: number;
  topDomains: { domain: string; timeSpent: number }[];
  contextSwitchesPerDay: number;
  productivityTrend: { date: string; score: number }[];
} 