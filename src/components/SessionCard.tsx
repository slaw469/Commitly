import React from 'react';
import { Play, Clock, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Session {
  id: string;
  title: string;
  summary: string;
  startTime: Date;
  duration?: number;
  status?: 'active' | 'completed';
  tabs?: Array<{ title: string; url: string; favicon: string }>;
  nextSteps?: string[];
}

interface SessionCardProps {
  session: Session;
  showResume: boolean;
}

export default function SessionCard({ session, showResume }: SessionCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="p-4 rounded-xl border border-gray-200/50 hover:border-primary-200 hover:shadow-md transition-all duration-200 bg-white">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">{session.title}</h3>
        {session.status === 'completed' && (
          <CheckCircle size={16} className="text-success-500 flex-shrink-0" />
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{session.summary}</p>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
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
          <div className="text-xs text-gray-500 mb-2">Active tabs:</div>
          <div className="space-y-1">
            {session.tabs.slice(0, 3).map((tab, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <span>{tab.favicon}</span>
                <span className="text-gray-600 truncate">{tab.title}</span>
              </div>
            ))}
            {session.tabs.length > 3 && (
              <div className="text-xs text-gray-400">+{session.tabs.length - 3} more tabs</div>
            )}
          </div>
        </div>
      )}

      {showResume && (
        <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-200 text-sm font-medium">
          <Play size={14} />
          <span>Resume Session</span>
        </button>
      )}
    </div>
  );
}