// File: apps/commitly-web/src/hooks/use-validation-history.ts

import { useState, useEffect, useCallback } from 'react';
import type { ValidationResult } from '@commitly/core';

const HISTORY_KEY = 'commitly-validation-history';
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

function loadHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load validation history:', error);
  }
  return [];
}

function saveHistory(history: HistoryItem[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save validation history:', error);
  }
}

export function useValidationHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addToHistory = useCallback((message: string, validationResult: ValidationResult) => {
    const historyItem: HistoryItem = {
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      timestamp: new Date().toISOString(),
      valid: validationResult.valid,
      errorCount: validationResult.errors.length,
      warningCount: validationResult.warnings.length,
      validationResult,
    };

    setHistory((prev) => {
      const newHistory = [historyItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
      return newHistory;
    });

    return historyItem;
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  const removeItem = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
    removeItem,
  };
}

