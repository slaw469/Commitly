// Hook for managing validation history with uid namespacing
// Stores the last N validation results per user

import { useCallback } from 'react';
import type { ValidationResult } from '@commitly/core';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from './use-local-storage';

const HISTORY_KEY = 'history';
const MAX_HISTORY_ITEMS = 50;

export interface HistoryItem {
  id: string;
  message: string;
  timestamp: string;
  valid: boolean;
  errorCount: number;
  warningCount: number;
  validationResult: ValidationResult;
}

// Validator for history item
function isValidHistoryItem(data: unknown): data is HistoryItem {
  if (typeof data !== 'object' || data === null) return false;

  const item = data as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.message === 'string' &&
    typeof item.timestamp === 'string' &&
    typeof item.valid === 'boolean' &&
    typeof item.errorCount === 'number' &&
    typeof item.warningCount === 'number' &&
    typeof item.validationResult === 'object'
  );
}

// Validator for history array
function isValidHistoryArray(data: unknown): data is HistoryItem[] {
  return Array.isArray(data) && data.every(isValidHistoryItem);
}

/**
 * Hook for managing validation history with localStorage persistence
 * Automatically namespaced by user ID
 * 
 * If user is not logged in, stores in global namespace for anonymous use
 */
export function useValidationHistory() {
  const { user } = useAuth();

  const [history, setHistory, clearHistory, isLoading] = useLocalStorage<HistoryItem[]>(
    HISTORY_KEY,
    {
      uid: user?.uid ?? null,
      defaultValue: [],
      validate: isValidHistoryArray,
    }
  );

  const addToHistory = useCallback(
    (message: string, validationResult: ValidationResult) => {
      const historyItem: HistoryItem = {
        id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        message,
        timestamp: new Date().toISOString(),
        valid: validationResult.valid,
        errorCount: validationResult.errors.length,
        warningCount: validationResult.warnings.length,
        validationResult,
      };

      const currentHistory = history ?? [];
      const newHistory = [historyItem, ...currentHistory].slice(0, MAX_HISTORY_ITEMS);
      setHistory(newHistory);

      return historyItem;
    },
    [history, setHistory]
  );

  const removeItem = useCallback(
    (id: string) => {
      const currentHistory = history ?? [];
      setHistory(currentHistory.filter((item) => item.id !== id));
    },
    [history, setHistory]
  );

  const getHistoryStats = useCallback(() => {
    const currentHistory = history ?? [];
    return {
      total: currentHistory.length,
      valid: currentHistory.filter((item) => item.valid).length,
      invalid: currentHistory.filter((item) => !item.valid).length,
      avgErrorCount:
        currentHistory.reduce((sum, item) => sum + item.errorCount, 0) / currentHistory.length ||
        0,
      avgWarningCount:
        currentHistory.reduce((sum, item) => sum + item.warningCount, 0) / currentHistory.length ||
        0,
    };
  }, [history]);

  return {
    history: history ?? [],
    isLoading,
    addToHistory,
    clearHistory,
    removeItem,
    getHistoryStats,
  };
}
