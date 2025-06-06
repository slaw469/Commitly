import { Session, SessionSummary, Tab, FocusBlock } from '../types/session';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface SessionAnalysis {
  summary: string;
  keyPoints: string[];
  nextSteps: string[];
  focusArea: string;
  confidence: number;
  productivity_insights: string[];
  time_patterns: string[];
}

export class AIService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    // Check for API key in localStorage or environment
    this.apiKey = localStorage.getItem('ai-time-doubler-openai-key') || null;
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('ai-time-doubler-openai-key', key);
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  async generateSessionSummary(session: Session): Promise<SessionSummary> {
    if (!this.apiKey) {
      return this.generateMockSummary(session);
    }

    try {
      const prompt = this.buildSessionPrompt(session);
      const response = await this.callOpenAI(prompt);
      const analysis = JSON.parse(response) as SessionAnalysis;

      return {
        id: this.generateId(),
        content: analysis.summary,
        keyPoints: analysis.keyPoints,
        nextSteps: analysis.nextSteps,
        focusArea: analysis.focusArea,
        confidence: analysis.confidence,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error generating AI summary:', error);
      return this.generateMockSummary(session);
    }
  }

  async generateProductivityInsights(sessions: Session[]): Promise<{
    insights: string[];
    recommendations: string[];
    trends: string[];
  }> {
    if (!this.apiKey) {
      return this.generateMockInsights(sessions);
    }

    try {
      const prompt = this.buildInsightsPrompt(sessions);
      const response = await this.callOpenAI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating insights:', error);
      return this.generateMockInsights(sessions);
    }
  }

  private buildSessionPrompt(session: Session): string {
    const sessionDuration = session.duration || 0;
    const tabInfo = session.tabs.map(tab => ({
      title: tab.title,
      domain: tab.domain,
      timeSpent: Math.round(tab.timeSpent / 60) // Convert to minutes
    }));

    const focusBlockInfo = session.focusBlocks.map(block => ({
      type: block.type,
      duration: block.duration || 0,
      description: block.description
    }));

    return `Analyze this productivity session and provide insights in JSON format.

Session Details:
- Title: ${session.title}
- Duration: ${sessionDuration} minutes
- Context Switches: ${session.contextSwitches}
- Productivity Rating: ${session.productivity}/5

Active Tabs (with time spent):
${tabInfo.map(tab => `- ${tab.title} (${tab.domain}) - ${tab.timeSpent}min`).join('\n')}

Focus Blocks:
${focusBlockInfo.map(block => `- ${block.type}: ${block.duration}min ${block.description ? `- ${block.description}` : ''}`).join('\n')}

Notes: ${session.notes || 'None'}

Please respond with a JSON object containing:
{
  "summary": "A concise 2-3 sentence summary of what was accomplished",
  "keyPoints": ["3-5 key activities or achievements"],
  "nextSteps": ["3-4 actionable next steps based on the session"],
  "focusArea": "Primary area of focus (e.g., 'Development', 'Research', 'Planning')",
  "confidence": 0.85,
  "productivity_insights": ["Insights about productivity patterns"],
  "time_patterns": ["Observations about time allocation"]
}`;
  }

  private buildInsightsPrompt(sessions: Session[]): string {
    const recentSessions = sessions.slice(-10); // Last 10 sessions
    const totalTime = recentSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const avgProductivity = recentSessions.reduce((sum, s) => sum + s.productivity, 0) / recentSessions.length;

    const domainStats = new Map<string, number>();
    recentSessions.forEach(session => {
      session.tabs.forEach(tab => {
        const current = domainStats.get(tab.domain) || 0;
        domainStats.set(tab.domain, current + tab.timeSpent);
      });
    });

    const topDomains = Array.from(domainStats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain, time]) => `${domain}: ${Math.round(time/60)}min`);

    return `Analyze these productivity sessions and provide insights in JSON format.

Recent Sessions Summary:
- Total Sessions: ${recentSessions.length}
- Total Time: ${totalTime} minutes
- Average Productivity: ${avgProductivity.toFixed(1)}/5
- Top Domains: ${topDomains.join(', ')}

Session Details:
${recentSessions.map(s => `
- ${s.title}: ${s.duration}min, ${s.tabs.length} tabs, ${s.contextSwitches} switches, ${s.productivity}/5 rating
  Focus: ${s.focusBlocks.map(fb => fb.type).join(', ') || 'None'}
  Top domains: ${s.tabs.slice(0,3).map(t => t.domain).join(', ')}
`).join('')}

Please respond with a JSON object containing:
{
  "insights": ["3-4 key insights about productivity patterns"],
  "recommendations": ["3-4 specific recommendations for improvement"],
  "trends": ["2-3 observations about trends over time"]
}`;
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an AI productivity analyst. Provide insightful analysis of work sessions in the exact JSON format requested. Be specific and actionable.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0].message.content;
  }

  private generateMockSummary(session: Session): SessionSummary {
    const duration = session.duration || 0;
    const primaryDomain = session.tabs.length > 0 
      ? session.tabs.reduce((a, b) => a.timeSpent > b.timeSpent ? a : b).domain
      : 'unknown';

    const focusTypes = [...new Set(session.focusBlocks.map(fb => fb.type))];
    const mainFocus = focusTypes.length > 0 ? focusTypes[0].replace('_', ' ').toLowerCase() : 'general work';

    return {
      id: this.generateId(),
      content: `Completed a ${duration}-minute ${mainFocus} session with primary focus on ${primaryDomain}. ${session.contextSwitches > 10 ? 'High context switching detected - consider consolidating similar tasks.' : 'Good focus maintained with minimal distractions.'}`,
      keyPoints: [
        `Worked for ${duration} minutes across ${session.tabs.length} different resources`,
        `Primary focus area: ${mainFocus}`,
        `${session.contextSwitches} context switches recorded`,
        ...(session.notes ? [`Notes: ${session.notes.substring(0, 50)}...`] : [])
      ].slice(0, 4),
      nextSteps: [
        duration > 90 ? 'Consider breaking long sessions into focused blocks' : 'Maintain current session length',
        session.contextSwitches > 15 ? 'Reduce context switching by batching similar tasks' : 'Continue current focus patterns',
        'Review and update session notes for better tracking',
        focusTypes.length > 0 ? `Schedule more ${mainFocus} time blocks` : 'Define clear focus areas for future sessions'
      ].slice(0, 3),
      focusArea: mainFocus.charAt(0).toUpperCase() + mainFocus.slice(1),
      confidence: 0.75,
      generatedAt: new Date()
    };
  }

  private generateMockInsights(sessions: Session[]): {
    insights: string[];
    recommendations: string[];
    trends: string[];
  } {
    const totalTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const avgProductivity = sessions.reduce((sum, s) => sum + s.productivity, 0) / sessions.length;

    return {
      insights: [
        `You've completed ${sessions.length} sessions totaling ${Math.round(totalTime/60)} hours`,
        `Average productivity rating of ${avgProductivity.toFixed(1)}/5 shows room for optimization`,
        `Context switching patterns suggest potential for better task batching`,
        'Most productive sessions occur during focused work blocks'
      ],
      recommendations: [
        'Schedule 90-minute deep work blocks for complex tasks',
        'Use focus blocks to minimize context switching',
        'Review and close unnecessary tabs during active sessions',
        'Set specific goals before starting each session'
      ],
      trends: [
        'Productivity tends to decrease with session length beyond 2 hours',
        'Sessions with fewer than 5 tabs show higher focus scores',
        'Morning sessions typically have better productivity ratings'
      ]
    };
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const aiService = new AIService(); 