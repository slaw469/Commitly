import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, TrendingUp, Target, ChevronRight, RefreshCw, Key, AlertTriangle } from 'lucide-react';
import { useSessionHistory, useAI } from '../hooks/useSession';
import { Button } from './ui/button';

export default function AIInsights() {
  const { sessions, generateSummary } = useSessionHistory();
  const { hasApiKey, setApiKey, generateInsights } = useAI();
  const [insights, setInsights] = useState<{
    insights: string[];
    recommendations: string[];
    trends: string[];
  } | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState<string | null>(null);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const completedSessions = sessions.filter(s => s.status === 'completed');
  const sessionsWithSummaries = completedSessions.filter(s => s.summary);
  const recentSessions = completedSessions.slice(-5).reverse();

  useEffect(() => {
    if (completedSessions.length > 0) {
      loadProductivityInsights();
    }
  }, [completedSessions.length]);

  const loadProductivityInsights = async () => {
    if (completedSessions.length === 0) return;
    
    setLoadingInsights(true);
    try {
      const result = await generateInsights(completedSessions);
      setInsights(result);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleGenerateSummary = async (sessionId: string) => {
    setLoadingSummary(sessionId);
    try {
      await generateSummary(sessionId);
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setLoadingSummary(null);
    }
  };

  const handleSetApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setShowApiKeyDialog(false);
      setApiKeyInput('');
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (completedSessions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
        <Brain size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No AI Insights Yet</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Complete some focus sessions to unlock AI-powered productivity insights and summaries.
        </p>
        <div className="inline-flex items-center text-sm text-primary-600 dark:text-primary-400">
          <Sparkles size={16} className="mr-1" />
          Start your first session to begin
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with API Key Setup */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg">
            <Brain size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Insights</h2>
            <p className="text-gray-600 dark:text-gray-300">Intelligent analysis of your productivity patterns</p>
          </div>
        </div>
        
        {!hasApiKey && (
          <Button 
            onClick={() => setShowApiKeyDialog(true)}
            className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600"
          >
            <Key size={16} className="mr-2" />
            Setup OpenAI Key
          </Button>
        )}
      </div>

      {/* API Key Dialog */}
      {showApiKeyDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Setup OpenAI API Key</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Enter your OpenAI API key to enable AI-powered session summaries and insights.
            </p>
            <input
              type="password"
              placeholder="sk-..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
            />
            <div className="flex space-x-3">
              <Button onClick={handleSetApiKey} className="flex-1">
                Save Key
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowApiKeyDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {!hasApiKey && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-200">OpenAI API Key Required</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Add your OpenAI API key to unlock AI-powered session summaries and productivity insights. 
                Mock insights are shown below for demonstration.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Productivity Insights Overview */}
      {insights && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Key Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Sparkles size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Key Insights</h3>
            </div>
            <div className="space-y-3">
              {insights.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <ChevronRight size={16} className="text-primary-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg">
                <Target size={20} className="text-success-600 dark:text-success-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Recommendations</h3>
            </div>
            <div className="space-y-3">
              {insights.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <ChevronRight size={16} className="text-success-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trends */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                <TrendingUp size={20} className="text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Trends</h3>
            </div>
            <div className="space-y-3">
              {insights.trends.map((trend, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <ChevronRight size={16} className="text-accent-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{trend}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Refresh Insights Button */}
      <div className="flex justify-center">
        <Button
          onClick={loadProductivityInsights}
          disabled={loadingInsights}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw size={16} className={loadingInsights ? 'animate-spin' : ''} />
          <span>{loadingInsights ? 'Generating Insights...' : 'Refresh Insights'}</span>
        </Button>
      </div>

      {/* Session Summaries */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Session Summaries</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {sessionsWithSummaries.length} of {completedSessions.length} sessions analyzed
          </div>
        </div>

        <div className="space-y-4">
          {recentSessions.map((session) => (
            <div 
              key={session.id} 
              className="border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{session.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>{formatDuration(session.duration || 0)}</span>
                    <span>{session.tabs.length} tabs</span>
                    <span>{session.focusBlocks.length} focus blocks</span>
                  </div>
                </div>
                {!session.summary && (
                  <Button
                    size="sm"
                    onClick={() => handleGenerateSummary(session.id)}
                    disabled={loadingSummary === session.id}
                  >
                    <Sparkles size={14} className="mr-1" />
                    {loadingSummary === session.id ? 'Generating...' : 'Generate Summary'}
                  </Button>
                )}
              </div>

              {session.summary ? (
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {session.summary.content}
                  </p>
                  
                  {session.summary.keyPoints.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-2">Key Points:</h5>
                      <ul className="space-y-1">
                        {session.summary.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0 mt-2"></span>
                            <span className="text-gray-600 dark:text-gray-400">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {session.summary.nextSteps.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-2">Next Steps:</h5>
                      <ul className="space-y-1">
                        {session.summary.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <ChevronRight size={14} className="text-success-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600 dark:text-gray-400">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>Focus: {session.summary.focusArea}</span>
                      <span>Confidence: {Math.round(session.summary.confidence * 100)}%</span>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      Generated {new Date(session.summary.generatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No AI summary available yet. Click "Generate Summary" above.
                </div>
              )}
            </div>
          ))}
        </div>

        {completedSessions.length > 5 && (
          <div className="text-center mt-6">
            <Button variant="outline">
              View All Sessions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 