import { useState, useEffect } from 'react';
import { Clock, Target, TrendingUp, Zap, Github, FileText, Calendar, Play, Pause, Square, Brain, Sparkles, Chrome, Star, Info } from 'lucide-react';
import SessionCard from './SessionCard';
import MetricCard from './MetricCard';
import { useSession, useSessionHistory } from '../hooks/useSession';
import { Button } from './ui/button';
import { extensionService } from '../services/extensionService';

interface DashboardProps {
  onNavigate?: (view: 'sessions' | 'ai-insights') => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { 
    currentSession, 
    isActive, 
    duration,
    startSession, 
    pauseSession, 
    resumeSession, 
    endSession,
    addTab,
    startFocusBlock,
    updateProductivity 
  } = useSession();
  
  const { sessions: recentSessions, metrics } = useSessionHistory();
  const [isExtensionConnected, setIsExtensionConnected] = useState(false);
  const [showProductivityModal, setShowProductivityModal] = useState(false);
  const [showProductivityInfo, setShowProductivityInfo] = useState(false);
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);

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
  };

  const handleEndSession = async () => {
    if (!currentSession) return;
    
    const completedSession = await endSession();
    if (completedSession && completedSession.duration && completedSession.duration >= 5) {
      // Show productivity rating modal for sessions longer than 5 minutes
      setPendingSessionId(completedSession.id);
      setShowProductivityModal(true);
    }
  };

  const handleProductivityRating = (rating: number) => {
    if (pendingSessionId) {
      updateProductivity(rating);
    }
    setShowProductivityModal(false);
    setPendingSessionId(null);
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
                Without the extension, session tracking will work with manual tab management only.
              </p>
              <div className="flex items-center space-x-3 mt-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  onClick={() => window.open('https://github.com/slaw469/AI-Time-Doubler/blob/main/extension/README.md', '_blank')}
                >
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
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => onNavigate?.('ai-insights')}>
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
          <p className="text-gray-600 dark:text-gray-300 mb-6">Track your work context so you can quickly pick up where you left off</p>
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
              <Button variant="outline" size="sm" onClick={handleEndSession}>
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
        <div className="text-center mt-2">
          <button 
            onClick={() => setShowProductivityInfo(true)}
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center justify-center mx-auto"
          >
            <Info size={12} className="mr-1" />
            How is this calculated?
          </button>
        </div>
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
            <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium" onClick={() => onNavigate?.('sessions')}>
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

      {/* Productivity Rating Modal */}
      {showProductivityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Rate Your Session</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">How productive did you feel during this session?</p>
            <div className="flex items-center justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  className="text-3xl transition-colors hover:scale-110 transform"
                  onClick={() => handleProductivityRating(rating)}
                >
                  <Star 
                    size={32} 
                    className={rating <= (currentSession?.productivity || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-300'} 
                  />
                </button>
              ))}
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowProductivityModal(false)}
                className="flex-1"
              >
                Skip Rating
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Productivity Info Modal */}
      {showProductivityInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Productivity Score Explained</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p><strong>Your productivity score (1-5 stars) is calculated from:</strong></p>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Session Duration:</strong> Longer focused sessions score higher</li>
                <li><strong>Context Recovery:</strong> How quickly you get back into flow state</li>
                <li><strong>Focus Blocks:</strong> Using dedicated focus modes boosts your score</li>
                <li><strong>Self-Rating:</strong> Your personal assessment after each session</li>
              </ul>
              <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <p className="text-sm"><strong>Tip:</strong> The goal isn't to avoid switching tasks, but to minimize the time it takes to get back into the zone when you do!</p>
              </div>
            </div>
            <Button
              onClick={() => setShowProductivityInfo(false)}
              className="mt-6 w-full"
            >
              Got it!
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}