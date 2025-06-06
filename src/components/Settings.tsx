import React, { useState } from 'react';
import { 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Download,
  Moon,
  Sun,
  Monitor,
  Trash2
} from 'lucide-react';
import { useTheme } from './theme-provider';
import { useSessionHistory } from '../hooks/useSession';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { sessions, metrics, exportData, clearAllData } = useSessionHistory();

  const [notifications, setNotifications] = useState({
    sessionReminders: true,
    contextSwitchAlerts: false,
    dailyDigest: true,
    weeklyReport: true
  });

  const [privacy, setPrivacy] = useState({
    trackUrls: true,
    shareAnalytics: false,
    storeClipboard: false
  });

  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-time-doubler-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      clearAllData();
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h` : `${minutes}m`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Customize your AI Time Doubler experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
            </div>

            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {key === 'sessionReminders' && 'Get reminded to start your focus sessions'}
                      {key === 'contextSwitchAlerts' && 'Alert when you switch contexts frequently'}
                      {key === 'dailyDigest' && 'Daily summary of your productivity'}
                      {key === 'weeklyReport' && 'Weekly insights and recommendations'}
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setNotifications(prev => ({
                        ...prev,
                        [key]: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy & Data</h3>
            </div>

            <div className="space-y-4">
              {Object.entries(privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {key === 'trackUrls' && 'Allow tracking of website URLs for better context'}
                      {key === 'shareAnalytics' && 'Share anonymous usage data to improve the service'}
                      {key === 'storeClipboard' && 'Store clipboard content for session summaries'}
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setPrivacy(prev => ({
                        ...prev,
                        [key]: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Palette className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h3>
            </div>

            <div className="space-y-3">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Monitor }
              ].map(({ value, label, icon: Icon }) => (
                <label key={value} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="theme"
                    value={value}
                    checked={theme === value}
                    onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <Icon size={16} className="text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data</h3>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleExportData}
                className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <Download size={16} className="text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Export Data</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">JSON</span>
              </button>

              <button 
                onClick={handleClearData}
                className="w-full flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                  <span className="font-medium text-red-900 dark:text-red-300">Delete All Data</span>
                </div>
              </button>
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl p-6 border border-primary-200/50 dark:border-primary-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Usage Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sessions Tracked</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{sessions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Focus Time</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDuration(metrics.totalFocusTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg Productivity</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{metrics.averageProductivity.toFixed(1)}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}