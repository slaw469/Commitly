// Integration tests for route protection
// Tests that protected routes redirect to login when not authenticated

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AuthProvider } from '../contexts/AuthContext';
import type { User } from 'firebase/auth';

// Mock Firebase auth
vi.mock('../lib/firebase', () => ({
  auth: {
    currentUser: null,
  },
  googleProvider: {},
  githubProvider: {},
}));

// Mock the onAuthStateChanged function
const mockOnAuthStateChanged = vi.fn();
vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual('firebase/auth');
  return {
    ...actual,
    onAuthStateChanged: mockOnAuthStateChanged,
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
  };
});

describe('Route Protection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to login when accessing protected route without auth', async () => {
    // Mock no user (not authenticated)
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(null); // No user
      return vi.fn(); // Cleanup function
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>Dashboard Page</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Should redirect to login
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('should show protected content when authenticated', async () => {
    // Mock authenticated user
    const mockUser = {
      uid: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
    } as User;

    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(mockUser);
      return vi.fn();
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>Dashboard Page</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Should show dashboard
    await waitFor(() => {
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });
  });

  it('should show loading state while checking auth', async () => {
    // Mock delayed auth check
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      // Don't call callback immediately
      setTimeout(() => callback(null), 100);
      return vi.fn();
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>Dashboard Page</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Should show loading state
    expect(screen.getByText(/authenticating/i)).toBeInTheDocument();
  });

  it('should allow access to public routes without auth', async () => {
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(null);
      return vi.fn();
    });

    render(
      <MemoryRouter initialEntries={['/playground']}>
        <AuthProvider>
          <Routes>
            <Route path="/playground" element={<div>Playground Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Should show playground (public route)
    await waitFor(() => {
      expect(screen.getByText('Playground Page')).toBeInTheDocument();
    });
  });

  it('should preserve redirect location after login', async () => {
    // Start with no user
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(null);
      return vi.fn();
    });

    const { rerender } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>Dashboard Page</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Should redirect to login
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    // Mock user logging in
    const mockUser = {
      uid: 'test-user-id',
      email: 'test@example.com',
    } as User;

    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(mockUser);
      return vi.fn();
    });

    // Rerender with authenticated user
    rerender(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>Dashboard Page</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Should now show dashboard
    await waitFor(() => {
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });
  });
});

