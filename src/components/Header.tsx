import React, { useState, useEffect } from 'react';
import { Menu, Brain, Bell, User, Settings, LogOut } from 'lucide-react';
import { ModeToggle } from './mode-toggle';

interface HeaderProps {
  onToggleSidebar: () => void;
  onNavigate?: (view: 'settings') => void;
}

export default function Header({ onToggleSidebar, onNavigate }: HeaderProps) {
  const [userName, setUserName] = useState('User');
  const [userInitials, setUserInitials] = useState('U');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Load user name from localStorage or set default
    const savedName = localStorage.getItem('ai-time-doubler-username');
    if (savedName && savedName.trim()) {
      setUserName(savedName);
      setUserInitials(getInitials(savedName));
    } else {
      // Try to get name from browser if available
      const browserName = navigator.userAgent.includes('Chrome') ? 'Chrome User' : 'User';
      setUserName(browserName);
      setUserInitials(getInitials(browserName));
    }

    // Check for notifications (can be extended later)
    checkNotifications();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const checkNotifications = () => {
    // Check for various notification conditions
    const sessions = JSON.parse(localStorage.getItem('ai-time-doubler-sessions') || '[]');
    let count = 0;

    // Check if user has completed sessions but no productivity ratings
    const unratedSessions = sessions.filter((s: any) => s.status === 'completed' && s.productivity === 0);
    count += unratedSessions.length;

    // Check if user hasn't started a session today
    const today = new Date().toDateString();
    const todaySessions = sessions.filter((s: any) => new Date(s.startTime).toDateString() === today);
    if (todaySessions.length === 0) {
      count += 1;
    }

    setNotificationCount(count);
  };

  const handleNotificationClick = () => {
    // Navigate to settings or show notification panel
    if (onNavigate) {
      onNavigate('settings');
    }
  };

  const handleSetUserName = () => {
    const newName = prompt('Enter your name:', userName);
    if (newName && newName.trim()) {
      setUserName(newName.trim());
      setUserInitials(getInitials(newName.trim()));
      localStorage.setItem('ai-time-doubler-username', newName.trim());
    }
  };

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out? This will clear your current session data.')) {
      localStorage.removeItem('ai-time-doubler-current-session');
      window.location.reload();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white">
              <Brain size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Time Doubler</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Remember where you left off</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={handleNotificationClick}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
            title="View notifications and settings"
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-medium">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
          
          <ModeToggle />
          
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-medium">
                {userInitials}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{userName}</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <button
                  onClick={handleSetUserName}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <User size={16} />
                  <span>Edit Name</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate?.('settings');
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <hr className="my-2 border-gray-200 dark:border-gray-600" />
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </header>
  );
}