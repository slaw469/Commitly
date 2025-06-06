import React, { useState } from 'react';
import { Search, Filter, Calendar, Clock, Target } from 'lucide-react';
import SessionCard from './SessionCard';

export default function SessionHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const sessions = [
    {
      id: '1',
      title: 'React Component Refactoring',
      summary: 'Working on breaking down the UserProfile component into smaller, reusable pieces. Currently focusing on extracting the avatar and contact info sections.',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      duration: 134,
      status: 'active' as const,
      tabs: [
        { title: 'UserProfile.tsx - VS Code', url: 'vscode://file/project/src/components/UserProfile.tsx', favicon: '🔧' },
        { title: 'React Documentation', url: 'https://react.dev/learn', favicon: '📚' },
        { title: 'GitHub PR #234', url: 'https://github.com/company/project/pull/234', favicon: '🔗' }
      ]
    },
    {
      id: '2',
      title: 'API Integration Debug',
      summary: 'Investigated authentication timeout issues with the payment gateway. Found the root cause in token refresh logic and implemented a fix.',
      startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
      duration: 90,
      status: 'completed' as const
    },
    {
      id: '3',
      title: 'Database Schema Design',
      summary: 'Designed new user preferences table structure. Added proper indexes for performance optimization and foreign key constraints.',
      startTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
      duration: 120,
      status: 'completed' as const
    },
    {
      id: '4',
      title: 'Client Presentation Prep',
      summary: 'Created comprehensive slides for quarterly review meeting. Gathered performance metrics, user engagement data, and growth projections.',
      startTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
      duration: 75,
      status: 'completed' as const
    },
    {
      id: '5',
      title: 'Code Review & Testing',
      summary: 'Reviewed pull requests from team members. Focused on security best practices and performance optimizations in the authentication module.',
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      duration: 60,
      status: 'completed' as const
    },
    {
      id: '6',
      title: 'Documentation Writing',
      summary: 'Updated API documentation for the new user management endpoints. Added examples and improved error handling descriptions.',
      startTime: new Date(Date.now() - 26 * 60 * 60 * 1000),
      duration: 45,
      status: 'completed' as const
    }
  ];

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && session.status === selectedFilter;
  });

  const totalSessions = sessions.length;
  const totalTime = sessions.reduce((acc, session) => acc + (session.duration || 0), 0);
  const avgSessionTime = Math.round(totalTime / totalSessions);

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
            <span className="text-2xl font-bold text-gray-900">{Math.round(totalTime / 60)}h</span>
          </div>
          <p className="text-sm text-gray-600">Total Focus Time</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="text-accent-500" size={20} />
            <span className="text-2xl font-bold text-gray-900">{avgSessionTime}m</span>
          </div>
          <p className="text-sm text-gray-600">Avg Session</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <div className="flex items-center space-x-3 mb-2">
            <Filter className="text-red-500" size={20} />
            <span className="text-2xl font-bold text-gray-900">94%</span>
          </div>
          <p className="text-sm text-gray-600">Efficiency Score</p>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Sessions ({filteredSessions.length})
          </h2>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard 
                key={session.id} 
                session={session} 
                showResume={session.status === 'completed'} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}