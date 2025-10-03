// Protected route wrapper for authenticated pages
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-background"
        role="status"
        aria-live="polite"
        aria-label="Loading authentication status"
      >
        <div className="text-center">
          <Loader2
            className="h-8 w-8 animate-spin text-primary mx-auto mb-4"
            aria-hidden="true"
          />
          <p className="text-muted-foreground">Authenticating...</p>
          <span className="sr-only">Loading, please wait</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-background"
        role="alert"
        aria-live="assertive"
      >
        <div className="text-center max-w-md p-6">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Authentication Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Return to Login
          </a>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  return <>{children}</>;
}

