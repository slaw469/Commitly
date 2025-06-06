import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Download,
  Moon,
  Sun,
  Chrome,
  Trash2
} from 'lucide-react';

export default function Settings() {
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

  const [theme, setTheme] = useState('light');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Customize your AI Time Doubler experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl font-bold">
                  JD
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="john@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>

            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-gray-600">
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
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Privacy & Data</h3>
            </div>

            <div className="space-y-4">
              {Object.entries(privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-gray-600">
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
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Palette className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
            </div>

            <div className="space-y-3">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Chrome }
              ].map(({ value, label, icon: Icon }) => (
                <label key={value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value={value}
                    checked={theme === value}
                    onChange={(e) => setTheme(e.target.value)}
                    className="text-primary-600"
                  />
                  <Icon size={16} className="text-gray-600" />
                  <span className="font-medium text-gray-900">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Data</h3>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <Download size={16} className="text-gray-600" />
                  <span className="font-medium text-gray-900">Export Data</span>
                </div>
                <span className="text-sm text-gray-600">JSON</span>
              </button>

              <button className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <Trash2 size={16} className="text-red-600" />
                  <span className="font-medium text-red-900">Delete All Data</span>
                </div>
              </button>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-200/50">
            <h3 className="font-semibold text-gray-900 mb-4">Account Usage</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sessions Tracked</span>
                <span className="text-sm font-medium text-gray-900">2,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Focus Time</span>
                <span className="text-sm font-medium text-gray-900">247h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm font-medium text-gray-900">Jan 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}