// Generic localStorage utility with error handling and uid namespacing
// Follows 10x developer best practices for data persistence

import { logger } from './logger';

/**
 * Storage utility for managing localStorage with user-specific namespacing
 * Handles errors gracefully, validates data, and provides type safety
 */

interface StorageOptions {
  fallback?: unknown;
  validate?: (data: unknown) => boolean;
}

/**
 * Check if localStorage is available and functional
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a namespaced storage key
 * Format: commitly:{uid}:{key}
 */
export function getStorageKey(key: string, uid: string | null = null): string {
  if (uid) {
    return `commitly:${uid}:${key}`;
  }
  return `commitly:${key}`;
}

/**
 * Safely get an item from localStorage with error handling
 */
export function getStorageItem<T>(
  key: string,
  uid: string | null = null,
  options: StorageOptions = {}
): T | null {
  if (!isStorageAvailable()) {
    logger.warn('localStorage is not available');
    return (options.fallback as T) ?? null;
  }

  try {
    const storageKey = getStorageKey(key, uid);
    const item = localStorage.getItem(storageKey);

    if (item === null) {
      return (options.fallback as T) ?? null;
    }

    const parsed = JSON.parse(item) as T;

    // Validate data if validator provided
    if (options.validate && !options.validate(parsed)) {
      logger.warn(`Invalid data for key: ${storageKey}`);
      return (options.fallback as T) ?? null;
    }

    return parsed;
  } catch (error) {
    logger.error(`Failed to get storage item for key: ${key}`, error);
    return (options.fallback as T) ?? null;
  }
}

/**
 * Safely set an item in localStorage with error handling
 */
export function setStorageItem<T>(
  key: string,
  value: T,
  uid: string | null = null
): boolean {
  if (!isStorageAvailable()) {
    logger.warn('localStorage is not available');
    return false;
  }

  try {
    const storageKey = getStorageKey(key, uid);
    const serialized = JSON.stringify(value);
    localStorage.setItem(storageKey, serialized);
    return true;
  } catch (error) {
    // Handle quota exceeded error
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      logger.error('localStorage quota exceeded');
    } else {
      logger.error(`Failed to set storage item for key: ${key}`, error);
    }
    return false;
  }
}

/**
 * Remove an item from localStorage
 */
export function removeStorageItem(key: string, uid: string | null = null): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    const storageKey = getStorageKey(key, uid);
    localStorage.removeItem(storageKey);
    return true;
  } catch (error) {
    logger.error(`Failed to remove storage item for key: ${key}`, error);
    return false;
  }
}

/**
 * Clear all items for a specific user
 */
export function clearUserStorage(uid: string): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    const prefix = `commitly:${uid}:`;
    const keysToRemove: string[] = [];

    // Find all keys for this user
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }

    // Remove all matching keys
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    return true;
  } catch (error) {
    logger.error('Failed to clear user storage', error);
    return false;
  }
}

/**
 * Get all storage keys for a user
 */
export function getUserStorageKeys(uid: string): string[] {
  if (!isStorageAvailable()) {
    return [];
  }

  try {
    const prefix = `commitly:${uid}:`;
    const keys: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        // Return the key without the prefix
        keys.push(key.replace(prefix, ''));
      }
    }

    return keys;
  } catch (error) {
    logger.error('Failed to get user storage keys', error);
    return [];
  }
}

/**
 * Migrate data from old key to new key
 * Useful when changing storage structure
 */
export function migrateStorageKey(
  oldKey: string,
  newKey: string,
  uid: string | null = null
): boolean {
  try {
    const oldStorageKey = getStorageKey(oldKey, uid);
    const item = localStorage.getItem(oldStorageKey);

    if (item !== null) {
      const newStorageKey = getStorageKey(newKey, uid);
      localStorage.setItem(newStorageKey, item);
      localStorage.removeItem(oldStorageKey);
      return true;
    }

    return false;
  } catch (error) {
    logger.error('Failed to migrate storage key', error);
    return false;
  }
}

/**
 * Export all user data as JSON
 */
export function exportUserData(uid: string): Record<string, unknown> | null {
  if (!isStorageAvailable()) {
    return null;
  }

  try {
    const prefix = `commitly:${uid}:`;
    const data: Record<string, unknown> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const cleanKey = key.replace(prefix, '');
        const value = localStorage.getItem(key);
        if (value) {
          data[cleanKey] = JSON.parse(value);
        }
      }
    }

    return data;
  } catch (error) {
    logger.error('Failed to export user data', error);
    return null;
  }
}

/**
 * Import user data from JSON
 */
export function importUserData(uid: string, data: Record<string, unknown>): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    Object.entries(data).forEach(([key, value]) => {
      const storageKey = getStorageKey(key, uid);
      localStorage.setItem(storageKey, JSON.stringify(value));
    });
    return true;
  } catch (error) {
    logger.error('Failed to import user data', error);
    return false;
  }
}

