// Login page with social auth
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Check, Github, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function Login(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, signInWithGithub, user, error, clearError } = useAuth();
  const [loading, setLoading] = useState<'google' | 'github' | null>(null);

  // Get redirect path from location state or default to dashboard
  const from = (location.state as { from?: string })?.from || '/dashboard';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Show error toast when auth error occurs
  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: error,
      });
      setLoading(null);
    }
  }, [error]);

  const handleGoogleSignIn = async () => {
    setLoading('google');
    clearError();
    try {
      await signInWithGoogle();
      toast({
        variant: 'success',
        title: 'Welcome!',
        description: 'Successfully signed in with Google',
      });
      // Navigation will be handled by useEffect when user state updates
    } catch (error) {
      // Error handling is done in AuthContext and shown via useEffect above
      setLoading(null);
    }
  };

  const handleGithubSignIn = async () => {
    setLoading('github');
    clearError();
    try {
      await signInWithGithub();
      toast({
        variant: 'success',
        title: 'Welcome!',
        description: 'Successfully signed in with GitHub',
      });
      // Navigation will be handled by useEffect when user state updates
    } catch (error) {
      // Error handling is done in AuthContext and shown via useEffect above
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            aria-label="Go to Commitly home page"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10" aria-hidden="true">
              <Check className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold font-display text-foreground">Commitly</h1>
          </Link>
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
          <p className="text-muted-foreground">Sign in to access your dashboard and saved settings</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Choose your preferred sign-in method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign In */}
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={loading !== null}
              aria-label={loading === 'google' ? 'Signing in with Google' : 'Sign in with Google'}
              aria-busy={loading === 'google'}
            >
              {loading === 'google' ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            {/* GitHub Sign In */}
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleGithubSignIn}
              disabled={loading !== null}
              aria-label={loading === 'github' ? 'Signing in with GitHub' : 'Sign in with GitHub'}
              aria-busy={loading === 'github'}
            >
              {loading === 'github' ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                  Signing in...
                </>
              ) : (
                <>
                  <Github className="mr-2 h-5 w-5" aria-hidden="true" />
                  Continue with GitHub
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Continue without account */}
            <Button variant="ghost" size="lg" className="w-full" asChild>
              <Link to="/playground">Continue without account</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

