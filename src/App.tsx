import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SessionHistory from './components/SessionHistory';
import Integrations from './components/Integrations';
import Settings from './components/Settings';
import { ThemeProvider } from './components/theme-provider';

type ViewType = 'landing' | 'dashboard' | 'sessions' | 'integrations' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const renderCurrentView = () => {
    if (!isLoggedIn && currentView === 'landing') {
      return <LandingPage onLogin={handleLogin} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'sessions':
        return <SessionHistory />;
      case 'integrations':
        return <Integrations />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (!isLoggedIn && currentView === 'landing') {
    return (
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <LandingPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="flex">
          <Sidebar 
            isOpen={sidebarOpen}
            currentView={currentView}
            onViewChange={setCurrentView}
          />
          
          <main className={`flex-1 transition-all duration-200 ${sidebarOpen ? 'ml-64' : 'ml-0'} pt-16`}>
            <div className="p-6">
              {renderCurrentView()}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;