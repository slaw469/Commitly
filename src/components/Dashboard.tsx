import React from 'react';
import { Clock, Target, TrendingUp, Zap, ArrowRight, Github, FileText, Calendar } from 'lucide-react';
import SessionCard from './SessionCard';
import MetricCard from './MetricCard';

export default function Dashboard() {
  const currentSession = {
    id: 'current',
    title: 'React Component Refactoring',
    summary: 'Working on breaking down the UserProfile component into smaller, reusable pieces. Currently focusing on extracting the avatar and contact info sections.',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    tabs: [
      { title: 'UserProfile.tsx - VS Code', url: 'vscode://file/project/src/components/UserProfile.tsx', favicon: '🔧' },
      { title: 'React Documentation - Components', url: 'https://react.dev/learn/your-first-component', favicon: '📚' },
      { title: 'GitHub PR #234', url: 'https://github.com/company/project/pull/234', favicon: '🔗' }
    ],
    nextSteps: [
      'Extract AvatarComponent with proper TypeScript interfaces',
      'Add unit tests for the new ContactInfo component',
      'Update parent component imports and props'
    ],
    integrations: {
      github: { commits: 3, branch: 'feature/component-refactor' },
      notion: { pages: 2, lastUpdate: '1h ago' }
    }
  };

  const recentSessions = [
    {
      id: '1',
      title: 'API Integration Debug',
      summary: 'Investigated authentication timeout issues with the payment gateway. Found the root cause in token refresh logic.',
      startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
      duration: 90,
      status: 'completed' as const
    },
    {
      id: '2', 
      title: 'Database Schema Design',
      summary: 'Designed new user preferences table structure. Added indexes for performance optimization.',
      startTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
      duration: 120,
      status: 'completed' as const
    },
    {
      id: '3',
      title: 'Client Presentation Prep',
      summary: 'Created slides for quarterly review meeting. Gathered metrics and performance data.',
      startTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
      duration: 75,
      status: 'completed' as const
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, John</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Ready to pick up where you left off?</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-300 rounded-lg font-medium text-sm">
            ✨ 2.5x productivity boost this week
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Time Saved Today"
          value="47 min"
          change="+23%"
          icon={Clock}
          color="success"
        />
        <MetricCard
          title="Focus Sessions"
          value="8"
          change="+2"
          icon={Target}
          color="primary"
        />
        <MetricCard
          title="Productivity Score"
          value="94%"
          change="+12%"
          icon={TrendingUp}
          color="accent"
        />
        <MetricCard
          title="Context Switches"
          value="12"
          change="-8"
          icon={Zap}
          color="red"
        />
      </div>

      {/* Current Session */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Current Session</h2>
          <div className="flex items-center space-x-2 text-success-600 dark:text-success-400">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Active for 2h 14m</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Session Overview */}
          <div className="lg:col-span-2">
            <SessionCard session={currentSession} showResume={false} />
          </div>

          {/* Quick Actions & Integrations */}
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl border border-primary-200/50 dark:border-primary-700/50">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Next Steps</h3>
              <ul className="space-y-2">
                {currentSession.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <ArrowRight size={14} className="text-primary-500 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Connected Tools</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Github size={16} className="text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">GitHub</span>
                  </div>
                  <span className="text-xs text-success-600 dark:text-success-400 font-medium">3 commits</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText size={16} className="text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Notion</span>
                  </div>
                  <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">2 pages</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Calendar</span>
                  </div>
                  <span className="text-xs text-accent-600 dark:text-accent-400 font-medium">1 meeting</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Sessions</h2>
          <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium">
            View All Sessions →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentSessions.map((session) => (
            <SessionCard key={session.id} session={session} showResume={true} />
          ))}
        </div>
      </div>
    </div>
  );
}