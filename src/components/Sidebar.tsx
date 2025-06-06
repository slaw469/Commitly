import React from 'react';
import { LayoutDashboard, History, Puzzle, Settings, Chrome, Zap } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onViewChange: (view: 'dashboard' | 'sessions' | 'integrations' | 'settings') => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sessions', label: 'Session History', icon: History },
  { id: 'integrations', label: 'Integrations', icon: Puzzle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, currentView, onViewChange }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white/90 backdrop-blur-md border-r border-gray-200/50 z-40">
      <div className="p-6">
        {/* Extension Status */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-success-50 to-primary-50 border border-success-200/50">
          <div className="flex items-center space-x-2 mb-2">
            <Chrome size={16} className="text-success-600" />
            <span className="text-sm font-medium text-success-800">Extension Connected</span>
          </div>
          <p className="text-xs text-success-600">Actively tracking 5 tabs</p>
          <div className="mt-2 flex items-center space-x-1">
            <Zap size={12} className="text-success-500" />
            <span className="text-xs text-success-600">Last sync: 2 min ago</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as any)}
                className={clsx(
                  'w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-4 rounded-xl bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Today's Focus</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sessions</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Focus Time</span>
              <span className="font-medium">6.2h</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Context Switches</span>
              <span className="font-medium text-red-600">12</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}