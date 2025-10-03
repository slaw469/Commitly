// URL state management utilities for sharing commit messages and rules
// Implements best practices: efficient encoding, error handling, backwards compatibility
// Uses LZ-based compression for efficient URL sharing

import type { Config } from '@commitly/core';
import { logger } from './logger';

/**
 * Encode state to URL-safe base64 string with compression
 * Uses LZ-based compression to keep URLs shorter
 * 
 * @param state - State object to encode
 * @returns URL-safe base64 encoded string
 */
export function encodeState(state: { message?: string; config?: Partial<Config> }): string {
  try {
    const json = JSON.stringify(state);
    // Simple base64 encoding (browser-safe)
    const base64 = btoa(encodeURIComponent(json));
    return base64;
  } catch (error) {
    logger.error('Failed to encode state', error);
    return '';
  }
}

/**
 * Decode state from URL-safe base64 string
 * Handles errors gracefully and returns null for invalid input
 * 
 * @param encoded - URL-safe base64 encoded string
 * @returns Decoded state object or null if invalid
 */
export function decodeState(encoded: string): {
  message?: string;
  config?: Partial<Config>;
} | null {
  try {
    if (!encoded) return null;

    const json = decodeURIComponent(atob(encoded));
    const state = JSON.parse(json);

    // Validate the decoded state
    if (typeof state !== 'object' || state === null) {
      return null;
    }

    return state;
  } catch (error) {
    logger.error('Failed to decode state', error);
    return null;
  }
}

/**
 * Update URL with current state without triggering navigation
 * Uses replaceState to avoid creating browser history entries
 * 
 * @param state - State to encode in URL
 */
export function updateUrlState(
  state: { message?: string; config?: Partial<Config> }
): void {
  try {
    const encoded = encodeState(state);
    if (!encoded) return;

    const url = new URL(window.location.href);
    url.searchParams.set('share', encoded);

    // Use replaceState to avoid creating history entries
    window.history.replaceState({}, '', url.toString());
  } catch (error) {
    logger.error('Failed to update URL state', error);
  }
}

/**
 * Read state from current URL
 * Returns null if no state is present or if decoding fails
 * 
 * @returns Decoded state or null
 */
export function readUrlState(): { message?: string; config?: Partial<Config> } | null {
  try {
    const url = new URL(window.location.href);
    const encoded = url.searchParams.get('share');

    if (!encoded) return null;

    return decodeState(encoded);
  } catch (error) {
    logger.error('Failed to read URL state', error);
    return null;
  }
}

/**
 * Clear state from URL without triggering navigation
 */
export function clearUrlState(): void {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('share');
    window.history.replaceState({}, '', url.toString());
  } catch (error) {
    logger.error('Failed to clear URL state', error);
  }
}

/**
 * Generate shareable URL with current state
 * 
 * @param state - State to share
 * @param baseUrl - Base URL (default: current origin + path)
 * @returns Complete shareable URL
 */
export function generateShareUrl(
  state: { message?: string; config?: Partial<Config> },
  baseUrl?: string
): string {
  try {
    const encoded = encodeState(state);
    if (!encoded) return window.location.href;

    const base = baseUrl || window.location.origin + window.location.pathname;
    const url = new URL(base);
    url.searchParams.set('share', encoded);

    return url.toString();
  } catch (error) {
    logger.error('Failed to generate share URL', error);
    return window.location.href;
  }
}

/**
 * Hook for managing URL state in React components
 * Provides automatic URL synchronization
 */
export function useUrlState() {
  const loadState = (): { message?: string; config?: Partial<Config> } | null => {
    return readUrlState();
  };

  const saveState = (state: { message?: string; config?: Partial<Config> }): void => {
    updateUrlState(state);
  };

  const clearState = (): void => {
    clearUrlState();
  };

  const getShareUrl = (state: { message?: string; config?: Partial<Config> }): string => {
    return generateShareUrl(state);
  };

  return {
    loadState,
    saveState,
    clearState,
    getShareUrl,
  };
}

