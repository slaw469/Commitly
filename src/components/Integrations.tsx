import React, { useState, useEffect } from 'react';
import { Github, FileText, Calendar, Chrome, Slack, Check, AlertCircle, Plus } from 'lucide-react';
import { extensionService } from '../services/extensionService';
import { useSession, useSessionHistory } from '../hooks/useSession';

export default function Integrations() {
  const [isExtensionConnected, setIsExtensionConnected] = useState(false);
  const { currentSession } = useSession();
  const { sessions, metrics } = useSessionHistory();

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

  const integrations = [
    {
      id: 'chrome',
      name: 'Chrome Extension',
      description: 'Track browser activity and tab management',
      icon: Chrome,
      status: isExtensionConnected ? 'connected' : 'available',
      data: isExtensionConnected && currentSession ? {
        activeTabs: currentSession.tabs.length,
        contextSwitches: currentSession.contextSwitches,
        timeTracked: `${Math.floor((Date.now() - new Date(currentSession.startTime).getTime()) / 1000 / 60)}m`
      } : null,
      lastSync: isExtensionConnected ? 'Live' : null
    },
    {
      id: 'ai-insights',
      name: 'AI Insights',
      description: 'Generate productivity summaries and recommendations',
      icon: Github, // Using Github icon as placeholder for AI
      status: 'connected',
      data: {
        totalSessions: sessions.length,
        avgProductivity: metrics.averageProductivity.toFixed(1),
        totalFocusTime: `${Math.floor(metrics.totalFocusTime / 60)}h`
      },
      lastSync: sessions.length > 0 ? 'Recently' : 'No data'
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Track commits, PRs, and development activity',
      icon: Github,
      status: 'available',
      data: null,
      lastSync: null
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Sync tasks, notes, and project documentation',
      icon: FileText,
      status: 'available',
      data: null,
      lastSync: null
    },
    {
      id: 'calendar',
      name: 'Google Calendar',
      description: 'Align sessions with your meeting schedule',
      icon: Calendar,
      status: 'available',
      data: null,
      lastSync: null
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Monitor team communications and mentions',
      icon: Slack,
      status: 'available',
      data: null,
      lastSync: null
    }
  ];

  const connectedIntegrations = integrations.filter(i => i.status === 'connected');
  const totalDataPoints = connectedIntegrations.reduce((acc, integration) => {
    if (integration.id === 'chrome' && integration.data) {
      return acc + integration.data.activeTabs + integration.data.contextSwitches;
    }
    if (integration.id === 'ai-insights' && integration.data) {
      return acc + integration.data.totalSessions;
    }
    return acc;
  }, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'success';
      case 'error':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <Check size={16} className="text-success-600" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <Plus size={16} className="text-gray-400" />;
    }
  };

  const handleConnect = (integrationId: string) => {
    switch (integrationId) {
      case 'github':
        // In a real app, this would initiate OAuth flow
        alert('GitHub integration coming soon! This would typically open an OAuth dialog to connect your GitHub account for automatic commit and PR tracking.');
        break;
      case 'notion':
        alert('Notion integration coming soon! This would connect to your Notion workspace to sync tasks, notes, and project documentation.');
        break;
      case 'calendar':
        alert('Google Calendar integration coming soon! This would sync your calendar events to align focus sessions with your meeting schedule.');
        break;
      case 'slack':
        alert('Slack integration coming soon! This would monitor your team communications and mentions during focus sessions.');
        break;
      case 'chrome':
        // For Chrome extension, provide installation instructions
        if (confirm('Chrome Extension needed! Would you like to open the installation instructions?')) {
          window.open('https://github.com/slaw469/AI-Time-Doubler/blob/main/extension/README.md', '_blank');
        }
        break;
      default:
        alert('Integration setup coming soon!');
    }
  };

  const handleConfigure = (integrationId: string) => {
    alert(`Configure ${integrationId} settings - feature coming soon!`);
  };

  const handleDisconnect = (integrationId: string) => {
    if (confirm(`Are you sure you want to disconnect ${integrationId}? This will stop data syncing.`)) {
      // In a real app, this would revoke OAuth tokens and clean up
      alert(`${integrationId} disconnected successfully!`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 mt-1">Connect your tools for smarter context tracking</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-200 font-medium">
          Browse More Integrations
        </button>
      </div>

      {/* Integration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <div className="text-2xl font-bold text-gray-900 mb-1">{connectedIntegrations.length}</div>
          <div className="text-sm text-gray-600">Connected</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <div className="text-2xl font-bold text-gray-900 mb-1">{totalDataPoints}</div>
          <div className="text-sm text-gray-600">Data Points Today</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <div className="text-2xl font-bold text-gray-900 mb-1">{isExtensionConnected ? '100%' : '0%'}</div>
          <div className="text-sm text-gray-600">Extension Status</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <div className="text-2xl font-bold text-gray-900 mb-1">{isExtensionConnected ? 'Live' : 'N/A'}</div>
          <div className="text-sm text-gray-600">Sync Status</div>
        </div>
      </div>

      {/* Integrations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const statusColor = getStatusColor(integration.status);
          
          return (
            <div key={integration.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <Icon size={24} className="text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(integration.status)}
                  <span className={`text-sm font-medium ${
                    statusColor === 'success' ? 'text-success-600' :
                    statusColor === 'red' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {integration.status === 'connected' ? 'Connected' :
                     integration.status === 'error' ? 'Error' : 'Available'}
                  </span>
                </div>
              </div>

              {integration.data && (
                <div className="mb-4">
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(integration.data).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-semibold text-gray-900">{value}</div>
                        <div className="text-xs text-gray-500 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                {integration.lastSync && (
                  <span className="text-xs text-gray-500">
                    Last sync: {integration.lastSync}
                  </span>
                )}
                
                <div className="flex space-x-2 ml-auto">
                  {integration.status === 'connected' && (
                    <>
                      <button 
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        onClick={() => handleConfigure(integration.id)}
                      >
                        Configure
                      </button>
                      <button 
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        onClick={() => handleDisconnect(integration.name)}
                      >
                        Disconnect
                      </button>
                    </>
                  )}
                  {integration.status === 'available' && (
                    <button 
                      className="px-3 py-1 text-xs bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                      onClick={() => handleConnect(integration.id)}
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Marketplace */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-200/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Coming Soon</h3>
            <p className="text-sm text-gray-600">More integrations are being added regularly</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Linear', 'Figma', 'VS Code', 'Jira'].map((tool) => (
            <div key={tool} className="flex items-center space-x-2 p-3 bg-white/60 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">{tool[0]}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">{tool}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}