import React from 'react';
import { LayoutDashboard, History, Puzzle, Settings, Chrome, Zap, Brain } from 'lucide-react';
import { clsx } from 'clsx';
import { useSessionHistory, useSession } from '../hooks/useSession';

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onViewChange: (view: 'dashboard' | 'sessions' | 'ai-insights' | 'integrations' | 'settings') => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sessions', label: 'Session History', icon: History },
  { id: 'ai-insights', label: 'AI Insights', icon: Brain },
  { id: 'integrations', label: 'Integrations', icon: Puzzle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, currentView, onViewChange }: SidebarProps) {
  const { currentSession } = useSession();
  const { metrics } = useSessionHistory();

  if (!isOpen) return null;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200/50 dark:border-gray-700/50 z-40">
      <div className="p-6">
        {/* Extension Status */}
        {currentSession && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-success-50 to-primary-50 dark:from-success-900/30 dark:to-primary-900/30 border border-success-200/50 dark:border-success-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <Chrome size={16} className="text-success-600 dark:text-success-400" />
              <span className="text-sm font-medium text-success-800 dark:text-success-200">Session Active</span>
            </div>
            <p className="text-xs text-success-600 dark:text-success-300">Tracking {currentSession.tabs.length} tabs</p>
            <div className="mt-2 flex items-center space-x-1">
              <Zap size={12} className="text-success-500 dark:text-success-400" />
              <span className="text-xs text-success-600 dark:text-success-300">Live tracking enabled</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as any)}
                className={clsx(
                  'w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Stats */}
        {(metrics.totalSessions > 0 || currentSession) && (
          <div className="mt-8 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              {currentSession ? 'Current Session' : 'Overview'}
            </h3>
            <div className="space-y-2">
              {currentSession ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Duration</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDuration(Math.round((Date.now() - currentSession.startTime.getTime()) / 1000 / 60))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tabs</span>
                    <span className="font-medium text-gray-900 dark:text-white">{currentSession.tabs.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Switches</span>
                    <span className="font-medium text-gray-900 dark:text-white">{currentSession.contextSwitches}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Sessions</span>
                    <span className="font-medium text-gray-900 dark:text-white">{metrics.totalSessions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Focus Time</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatDuration(metrics.totalFocusTime)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Avg Rating</span>
                    <span className="font-medium text-gray-900 dark:text-white">{metrics.averageProductivity.toFixed(1)}/5</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}