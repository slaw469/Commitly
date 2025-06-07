import React from 'react';
import { Play, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { SessionSummary } from '../types/session';

interface Session {
  id: string;
  title: string;
  summary: string;
  startTime: Date;
  duration?: number;
  status?: 'active' | 'paused' | 'completed';
  tabs?: Array<{ title: string; url: string; favicon: string }>;
  nextSteps?: string[];
  aiSummary?: SessionSummary;
}

interface SessionCardProps {
  session: Session;
  showResume: boolean;
  onResume?: (sessionId: string) => void;
}

export default function SessionCard({ session, showResume, onResume }: SessionCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{session.title}</h3>
        <div className="flex items-center space-x-2">
          {session.aiSummary && (
            <div className="p-1 bg-primary-100 dark:bg-primary-900/30 rounded">
              <Sparkles size={12} className="text-primary-600 dark:text-primary-400" />
            </div>
          )}
          {session.status === 'completed' && (
            <CheckCircle size={16} className="text-success-500 flex-shrink-0" />
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{session.summary}</p>

      {session.aiSummary && (
        <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200/50 dark:border-primary-700/50">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles size={14} className="text-primary-600 dark:text-primary-400" />
            <span className="text-xs font-medium text-primary-800 dark:text-primary-200">AI Summary</span>
          </div>
          <p className="text-xs text-primary-700 dark:text-primary-300 line-clamp-2">
            {session.aiSummary.content}
          </p>
          {session.aiSummary.focusArea && (
            <div className="mt-2 text-xs text-primary-600 dark:text-primary-400">
              Focus: {session.aiSummary.focusArea}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
        <div className="flex items-center space-x-2">
          <Clock size={12} />
          <span>{formatDistanceToNow(session.startTime, { addSuffix: true })}</span>
        </div>
        {session.duration && (
          <span className="font-medium">{formatDuration(session.duration)}</span>
        )}
      </div>

      {session.tabs && session.tabs.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Active tabs:</div>
          <div className="space-y-1">
            {session.tabs.slice(0, 3).map((tab, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <span>{tab.favicon}</span>
                <span className="text-gray-600 dark:text-gray-300 truncate">{tab.title}</span>
              </div>
            ))}
            {session.tabs.length > 3 && (
              <div className="text-xs text-gray-400 dark:text-gray-500">+{session.tabs.length - 3} more tabs</div>
            )}
          </div>
        </div>
      )}

      {showResume && (
        <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-200 text-sm font-medium" onClick={() => onResume?.(session.id)}>
          <Play size={14} />
          <span>Resume Session</span>
        </button>
      )}
    </div>
  );
}