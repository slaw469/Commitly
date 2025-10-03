// React hook for feature flags
// Provides reactive feature flag checking with automatic updates

import { useState, useEffect, useCallback } from 'react';
import {
  type FeatureFlag,
  isFeatureEnabled,
  enableFeature,
  disableFeature,
  toggleFeature,
  getAllFeatureFlags,
  resetFeatureFlags,
  getFeatureConfig,
  requiresAuth,
} from '@/lib/feature-flags';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook for checking if a specific feature is enabled
 * Automatically updates when localStorage changes (cross-tab sync)
 * 
 * @param flag - Feature flag to check
 * @returns Object with enabled state and control functions
 */
export function useFeatureFlag(flag: FeatureFlag) {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(() => isFeatureEnabled(flag));

  // Listen for storage events (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'commitly:feature-flags') {
        setEnabled(isFeatureEnabled(flag));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [flag]);

  // Also listen for popstate (URL changes)
  useEffect(() => {
    const handlePopState = () => {
      setEnabled(isFeatureEnabled(flag));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [flag]);

  const enable = useCallback(() => {
    enableFeature(flag);
    setEnabled(true);
  }, [flag]);

  const disable = useCallback(() => {
    disableFeature(flag);
    setEnabled(false);
  }, [flag]);

  const toggle = useCallback(() => {
    const newState = toggleFeature(flag);
    setEnabled(newState);
    return newState;
  }, [flag]);

  const config = getFeatureConfig(flag);
  const needsAuth = requiresAuth(flag);
  const hasAuth = !!user;
  const canUse = !needsAuth || hasAuth;

  return {
    enabled: enabled && canUse,
    enable,
    disable,
    toggle,
    config,
    requiresAuth: needsAuth,
    hasAuth,
    canUse,
  };
}

/**
 * Hook for managing all feature flags
 * Useful for settings or debug panels
 */
export function useAllFeatureFlags() {
  const { user } = useAuth();
  const [flags, setFlags] = useState(getAllFeatureFlags);

  // Listen for storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'commitly:feature-flags') {
        setFlags(getAllFeatureFlags());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const refreshFlags = useCallback(() => {
    setFlags(getAllFeatureFlags());
  }, []);

  const reset = useCallback(() => {
    resetFeatureFlags();
    setFlags(getAllFeatureFlags());
  }, []);

  const enableFlag = useCallback((flag: FeatureFlag) => {
    enableFeature(flag);
    setFlags(getAllFeatureFlags());
  }, []);

  const disableFlag = useCallback((flag: FeatureFlag) => {
    disableFeature(flag);
    setFlags(getAllFeatureFlags());
  }, []);

  const toggleFlag = useCallback((flag: FeatureFlag) => {
    toggleFeature(flag);
    setFlags(getAllFeatureFlags());
  }, []);

  // Filter flags based on auth requirements
  const availableFlags = flags.filter((f) => {
    if (f.config.requiresAuth && !user) {
      return false;
    }
    return true;
  });

  return {
    flags: availableFlags,
    allFlags: flags,
    refresh: refreshFlags,
    reset,
    enable: enableFlag,
    disable: disableFlag,
    toggle: toggleFlag,
  };
}

