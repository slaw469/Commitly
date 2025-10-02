// File: apps/commitly-web/src/App.tsx

import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Playground from './pages/Playground';
import Presets from './pages/Presets';
import Dashboard from './pages/Dashboard';
import AddProject from './pages/AddProject';
import Formatter from './pages/Formatter';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Docs from './pages/Docs';
import { Toaster } from './components/ui/toaster';

export default function App(): JSX.Element {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/presets" element={<Presets />} />
        <Route path="/formatter" element={<Formatter />} />
        <Route path="/docs" element={<Docs />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-project"
          element={
            <ProtectedRoute>
              <AddProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}
