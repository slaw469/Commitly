import { useState, useEffect } from 'react';
import { Clock, Target, TrendingUp, Zap, Github, FileText, Calendar, Play, Pause, Square, Brain, Sparkles, Chrome } from 'lucide-react';
import SessionCard from './SessionCard';
import MetricCard from './MetricCard';
import { useSession, useSessionHistory } from '../hooks/useSession';
import { Button } from './ui/button';
import { extensionService } from '../services/extensionService';

export default function Dashboard() {
  const { 
    currentSession, 
    isActive, 
    duration,
    startSession, 
    pauseSession, 
    resumeSession, 
    endSession,
    addTab,
    startFocusBlock 
  } = useSession();
  
  const { sessions: recentSessions, metrics } = useSessionHistory();
  const [isExtensionConnected, setIsExtensionConnected] = useState(false);

  useEffect(() => {
    // Check initial extension status
    setIsExtensionConnected(extensionService.isAvailable());

    // Listen for extension status changes
    extensionService.onMessage('extensionConnected', () => {
      setIsExtensionConnected(true);
    });

    extensionService.onMessage('extensionNotFound', () => {
      setIsExtensionConnected(false);
    });

    return () => {
      extensionService.offMessage('extensionConnected');
      extensionService.offMessage('extensionNotFound');
    };
  }, []);

  // Get last 3 completed sessions for display
  const completedSessions = recentSessions
    .filter(s => s.status === 'completed')
    .slice(-3)
    .reverse();

  const sessionsWithSummaries = completedSessions.filter(s => s.summary);

  const handleStartSession = () => {
    const title = `Focus Session ${new Date().toLocaleTimeString()}`;
    startSession(title);
    
    // Add some demo tabs to simulate activity (only if extension not connected)
    if (!isExtensionConnected) {
      setTimeout(() => {
        addTab('React Documentation - Components', 'https://react.dev/learn/your-first-component', '📚');
        addTab('GitHub - AI Time Doubler', 'https://github.com/user/ai-time-doubler', '🔗');
        addTab('Notion - Project Notes', 'https://notion.so/project-notes', '📝');
      }, 1000);
    }
  };

  const handleFocusBlock = (type: string) => {
    startFocusBlock(type as any, `${type.toLowerCase()} session`);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Ready to pick up where you left off?</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Extension Status Indicator */}
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
            isExtensionConnected 
              ? 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-300' 
              : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
          }`}>
            <Chrome size={16} />
            <span>{isExtensionConnected ? 'Extension Connected' : 'Extension Not Found'}</span>
          </div>
          
          {metrics.averageProductivity > 0 && (
            <div className="px-4 py-2 bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-300 rounded-lg font-medium text-sm">
              ✨ {metrics.averageProductivity.toFixed(1)}/5 avg productivity
            </div>
          )}
        </div>
      </div>

      {/* Extension Notice */}
      {!isExtensionConnected && (
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
          <div className="flex items-start space-x-3">
            <Chrome size={20} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Chrome Extension Recommended</h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                For real browser tab tracking, install the AI Time Doubler Chrome extension. 
                Currently showing simulated data for demonstration.
              </p>
              <div className="flex items-center space-x-3 mt-3">
                <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                  Install Extension
                </Button>
                <span className="text-xs text-yellow-600 dark:text-yellow-400">
                  Load from extension/ folder in Developer Mode
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Quick Access */}
      {sessionsWithSummaries.length > 0 && (
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Brain size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI Insights Available</h3>
                <p className="text-white/90 text-sm">
                  {sessionsWithSummaries.length} sessions analyzed with AI-powered summaries
                </p>
              </div>
            </div>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Sparkles size={16} className="mr-2" />
              View Insights
            </Button>
          </div>
        </div>
      )}

      {/* Session Controls */}
      {!currentSession ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Start a New Session</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Begin tracking your focus time and eliminate context switching</p>
          <Button onClick={handleStartSession} className="mr-4">
            <Play size={16} className="mr-2" />
            Start Session
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-success-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {currentSession.title}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatDuration(duration)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {isActive ? (
                <Button variant="outline" size="sm" onClick={pauseSession}>
                  <Pause size={14} className="mr-1" />
                  Pause
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={resumeSession}>
                  <Play size={14} className="mr-1" />
                  Resume
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={endSession}>
                <Square size={14} className="mr-1" />
                End
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Focus Blocks */}
      {currentSession && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Focus Blocks</h3>
          <div className="flex flex-wrap gap-2">
            {['DEEP_WORK', 'CODING', 'WRITING', 'RESEARCH', 'MEETING'].map((type) => (
              <Button 
                key={type} 
                variant="outline" 
                size="sm" 
                onClick={() => handleFocusBlock(type)}
              >
                {type.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Active Session"
          value={currentSession ? formatDuration(duration) : "No Session"}
          change={currentSession ? `${currentSession.tabs.length} tabs` : "Start one now"}
          icon={Clock}
          color="success"
        />
        <MetricCard
          title="Focus Sessions"
          value={metrics.totalSessions.toString()}
          change={metrics.totalSessions > 0 ? `${formatDuration(metrics.totalFocusTime)} total` : "None yet"}
          icon={Target}
          color="primary"
        />
        <MetricCard
          title="Productivity Score"
          value={metrics.averageProductivity > 0 ? `${metrics.averageProductivity.toFixed(1)}/5` : "No data"}
          change={metrics.averageProductivity > 0 ? "Average rating" : "Complete sessions"}
          icon={TrendingUp}
          color="accent"
        />
        <MetricCard
          title="Context Switches"
          value={currentSession ? currentSession.contextSwitches.toString() : "0"}
          change={currentSession ? "This session" : "No active session"}
          icon={Zap}
          color="red"
        />
      </div>

      {/* Current Session Details */}
      {currentSession && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Current Session</h2>
            <div className="flex items-center space-x-2 text-success-600 dark:text-success-400">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Active for {formatDuration(duration)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Session Overview */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Active Tabs ({currentSession.tabs.length})</h3>
                  {currentSession.tabs.length > 0 ? (
                    <div className="space-y-2">
                      {currentSession.tabs.slice(0, 3).map((tab) => (
                        <div key={tab.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-lg">{tab.favicon || '🌐'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{tab.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{tab.domain}</p>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDuration(Math.floor(tab.timeSpent / 60))}
                          </span>
                        </div>
                      ))}
                      {currentSession.tabs.length > 3 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          +{currentSession.tabs.length - 3} more tabs
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No tabs tracked yet</p>
                  )}
                </div>

                {currentSession.focusBlocks.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Focus Blocks</h3>
                    <div className="space-y-2">
                      {currentSession.focusBlocks.slice(-3).map((block) => (
                        <div key={block.id} className="flex items-center justify-between p-2 bg-primary-50 dark:bg-primary-900/20 rounded">
                          <span className="text-sm text-gray-900 dark:text-white">{block.type.replace('_', ' ')}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {block.duration ? formatDuration(block.duration) : 'Active'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions & Integrations */}
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl border border-primary-200/50 dark:border-primary-700/50">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Session Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="text-gray-900 dark:text-white">{formatDuration(duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Context Switches:</span>
                    <span className="text-gray-900 dark:text-white">{currentSession.contextSwitches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Focus Blocks:</span>
                    <span className="text-gray-900 dark:text-white">{currentSession.focusBlocks.length}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Connected Tools</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Github size={16} className="text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">GitHub</span>
                    </div>
                    <span className="text-xs text-success-600 dark:text-success-400 font-medium">Ready</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText size={16} className="text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Notion</span>
                    </div>
                    <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">Ready</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Calendar</span>
                    </div>
                    <span className="text-xs text-accent-600 dark:text-accent-400 font-medium">Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      {completedSessions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Sessions</h2>
            <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium">
              View All Sessions →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedSessions.map((session) => (
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
                showResume={true} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}