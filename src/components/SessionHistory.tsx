import React, { useState } from 'react';
import { Search, Filter, Calendar, Clock, Target } from 'lucide-react';
import SessionCard from './SessionCard';
import { useSessionHistory, useSession } from '../hooks/useSession';

export default function SessionHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Use real session data from the hook
  const { sessions: allSessions, metrics, isLoading } = useSessionHistory();
  const { startSession } = useSession();

  const handleResumeSession = async (sessionId: string) => {
    const sessionToResume = allSessions.find(s => s.id === sessionId);
    if (sessionToResume) {
      try {
        await startSession(`Resume: ${sessionToResume.title}`);
      } catch (error) {
        console.error('Failed to resume session:', error);
      }
    }
  };

  const filteredSessions = allSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (session.summary?.content || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && session.status === selectedFilter;
  });

  const totalSessions = allSessions.length;
  const totalTime = allSessions.reduce((acc, session) => acc + (session.duration || 0), 0);
  const avgSessionTime = totalSessions > 0 ? Math.round(totalTime / totalSessions) : 0;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Session History</h1>
          <p className="text-gray-600 mt-1">Track your productivity journey</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Sessions</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <div className="flex items-center space-x-3 mb-2">
            <Target className="text-primary-500" size={20} />
            <span className="text-2xl font-bold text-gray-900">{totalSessions}</span>
          </div>
          <p className="text-sm text-gray-600">Total Sessions</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="text-success-500" size={20} />
            <span className="text-2xl font-bold text-gray-900">{formatDuration(totalTime)}</span>
          </div>
          <p className="text-sm text-gray-600">Total Focus Time</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="text-accent-500" size={20} />
            <span className="text-2xl font-bold text-gray-900">{formatDuration(avgSessionTime)}</span>
          </div>
          <p className="text-sm text-gray-600">Avg Session</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <div className="flex items-center space-x-3 mb-2">
            <Filter className="text-red-500" size={20} />
            <span className="text-2xl font-bold text-gray-900">
              {metrics.averageProductivity > 0 ? `${metrics.averageProductivity.toFixed(1)}/5` : 'No data'}
            </span>
          </div>
          <p className="text-sm text-gray-600">Avg Productivity</p>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Sessions ({filteredSessions.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Clock size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading sessions...</h3>
            <p className="text-gray-600">Please wait while we fetch your session history</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {allSessions.length === 0 ? 'No sessions yet' : 'No sessions found'}
            </h3>
            <p className="text-gray-600">
              {allSessions.length === 0 
                ? 'Start your first productivity session to see it here' 
                : 'Try adjusting your search or filter criteria'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard 
                key={session.id} 
                session={{
                  id: session.id,
                  title: session.title,
                  summary: session.summary?.content || `Worked for ${formatDuration(session.duration || 0)} with ${session.tabs.length} tabs active`,
                  startTime: session.startTime,
                  duration: session.duration,
                  status: session.status,
                  aiSummary: session.summary
                }} 
                showResume={session.status === 'completed'} 
                onResume={handleResumeSession}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}