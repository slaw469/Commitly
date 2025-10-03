// Type-safe localStorage hook with React integration
// Uses the storage utility for consistent error handling and uid namespacing

import { useState, useEffect, useCallback, useRef } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/lib/storage';

export interface UseLocalStorageOptions<T> {
  /**
   * User ID for namespacing (if null, uses global namespace)
   */
  uid?: string | null;

  /**
   * Default value if storage is empty
   */
  defaultValue?: T;

  /**
   * Custom validator function
   */
  validate?: (data: unknown) => data is T;

  /**
   * Serialize function (default: JSON.stringify)
   */
  serialize?: (value: T) => string;

  /**
   * Deserialize function (default: JSON.parse)
   */
  deserialize?: (value: string) => T;
}

/**
 * Custom hook for managing localStorage with React state synchronization
 * Automatically handles uid namespacing when user is authenticated
 * 
 * @example
 * ```typescript
 * const { user } = useAuth();
 * const [presets, setPresets] = useLocalStorage('presets', {
 *   uid: user?.uid,
 *   defaultValue: []
 * });
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T> = {}
): [T | null, (value: T | null) => void, () => void, boolean] {
  const { uid = null, defaultValue, validate } = options;

  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  // Initialize state from localStorage
  const [storedValue, setStoredValue] = useState<T | null>(() => {
    const item = getStorageItem<T>(key, uid, {
      fallback: defaultValue,
      validate: validate as ((data: unknown) => boolean) | undefined,
    });
    return item;
  });

  // Track loading state
  const [isLoading, setIsLoading] = useState(false);

  // Store the current uid in a ref to detect changes
  const prevUidRef = useRef(uid);

  // Reload from storage when uid changes (user logs in/out)
  useEffect(() => {
    if (prevUidRef.current !== uid) {
      prevUidRef.current = uid;
      const item = getStorageItem<T>(key, uid, {
        fallback: defaultValue,
        validate: validate as ((data: unknown) => boolean) | undefined,
      });
      if (isMounted.current) {
        setStoredValue(item);
      }
    }
  }, [uid, key, defaultValue, validate]);

  // Set value and persist to localStorage
  const setValue = useCallback(
    (value: T | null) => {
      try {
        setIsLoading(true);

        if (value === null) {
          removeStorageItem(key, uid);
          if (isMounted.current) {
            setStoredValue(null);
          }
        } else {
          const success = setStorageItem(key, value, uid);
          if (success && isMounted.current) {
            setStoredValue(value);
          }
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [key, uid]
  );

  // Clear value from storage
  const clearValue = useCallback(() => {
    removeStorageItem(key, uid);
    if (isMounted.current) {
      setStoredValue(null);
    }
  }, [key, uid]);

  // Listen for storage events from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const storageKey = uid ? `commitly:${uid}:${key}` : `commitly:${key}`;

      if (e.key === storageKey && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue) as T;
          if (validate && !validate(newValue)) {
            return;
          }
          if (isMounted.current) {
            setStoredValue(newValue);
          }
        } catch (error) {
          console.error('Failed to parse storage event value', error);
        }
      } else if (e.key === storageKey && e.newValue === null) {
        if (isMounted.current) {
          setStoredValue(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, uid, validate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return [storedValue, setValue, clearValue, isLoading];
}

/**
 * Hook for managing an array in localStorage
 * Provides helper methods for array operations
 */
export function useLocalStorageArray<T>(
  key: string,
  options: UseLocalStorageOptions<T[]> = {}
): {
  value: T[] | null;
  setValue: (value: T[] | null) => void;
  addItem: (item: T) => void;
  removeItem: (predicate: (item: T) => boolean) => void;
  updateItem: (predicate: (item: T) => boolean, updates: Partial<T>) => void;
  clearValue: () => void;
  isLoading: boolean;
} {
  const [value, setValue, clearValue, isLoading] = useLocalStorage<T[]>(key, {
    ...options,
    defaultValue: options.defaultValue ?? ([] as T[]),
  });

  const addItem = useCallback(
    (item: T) => {
      const currentValue = value ?? ([] as T[]);
      setValue([...currentValue, item]);
    },
    [value, setValue]
  );

  const removeItem = useCallback(
    (predicate: (item: T) => boolean) => {
      const currentValue = value ?? ([] as T[]);
      setValue(currentValue.filter((item) => !predicate(item)));
    },
    [value, setValue]
  );

  const updateItem = useCallback(
    (predicate: (item: T) => boolean, updates: Partial<T>) => {
      const currentValue = value ?? ([] as T[]);
      setValue(
        currentValue.map((item) => (predicate(item) ? { ...item, ...updates } : item))
      );
    },
    [value, setValue]
  );

  return {
    value,
    setValue,
    addItem,
    removeItem,
    updateItem,
    clearValue,
    isLoading,
  };
}

