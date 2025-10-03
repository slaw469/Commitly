// Hook for using the validator Web Worker with proper debouncing
// Implements best practices: cleanup on unmount, no unnecessary re-renders, proper error handling
// Avoids AI mistakes: no useEffect spam, proper dependency arrays, cleanup functions

import { useEffect, useRef, useState, useCallback } from 'react';
import type { ValidationResult, Config } from '@commitly/core';

interface ValidationState {
  result: ValidationResult | null;
  fixedMessage: string | null;
  isValidating: boolean;
  error: string | null;
}

interface UseValidatorWorkerOptions {
  debounceMs?: number;
  config?: Partial<Config>;
}

/**
 * Hook to use Web Worker for commit message validation with debouncing
 * 
 * Best practices implemented:
 * - Debouncing to prevent excessive validation calls
 * - Worker cleanup on unmount to prevent memory leaks
 * - Proper error handling and state management
 * - No unnecessary re-renders or useEffect loops
 * 
 * @param options - Configuration options including debounce time and validation config
 * @returns Validation state and validate function
 */
export function useValidatorWorker(options: UseValidatorWorkerOptions = {}) {
  const { debounceMs = 150, config } = options;

  // State
  const [state, setState] = useState<ValidationState>({
    result: null,
    fixedMessage: null,
    isValidating: false,
    error: null,
  });

  // Refs to avoid stale closures
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Initialize worker on mount
  useEffect(() => {
    isMountedRef.current = true;

    // Create worker
    const worker = new Worker(
      new URL('../workers/validator.worker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current = worker;

    // Handle messages from worker
    worker.addEventListener('message', (event) => {
      if (!isMountedRef.current) return;

      const data = event.data;

      if (data.type === 'ready') {
        // Worker is ready
        console.log('Validator worker ready');
        return;
      }

      if (data.type === 'validated') {
        setState({
          result: data.result,
          fixedMessage: data.fixedMessage,
          isValidating: false,
          error: null,
        });
      } else if (data.type === 'error') {
        setState((prev) => ({
          ...prev,
          isValidating: false,
          error: data.error,
        }));
      }
    });

    // Handle worker errors
    worker.addEventListener('error', () => {
      if (!isMountedRef.current) return;
      // Worker error handled by setting error state
      setState((prev) => ({
        ...prev,
        isValidating: false,
        error: 'Validation worker error',
      }));
    });

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      worker.terminate();
      workerRef.current = null;
    };
  }, []); // Only run once on mount

  // Validate function with debouncing
  const validate = useCallback(
    (message: string) => {
      // Clear previous debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set validating state immediately for UI feedback
      setState((prev) => ({
        ...prev,
        isValidating: true,
        error: null,
      }));

      // Debounce the actual validation
      debounceTimerRef.current = setTimeout(() => {
        if (!workerRef.current || !isMountedRef.current) {
          return;
        }

        const requestId = String(++requestIdRef.current);

        // Send validation request to worker
        workerRef.current.postMessage({
          type: 'validate',
          id: requestId,
          message,
          config,
        });
      }, debounceMs);
    },
    [debounceMs, config]
  );

  // Immediate validate (no debounce) for manual triggers
  const validateImmediate = useCallback(
    (message: string) => {
      if (!workerRef.current || !isMountedRef.current) {
        return;
      }

      // Clear any pending debounced validation
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      setState((prev) => ({
        ...prev,
        isValidating: true,
        error: null,
      }));

      const requestId = String(++requestIdRef.current);

      workerRef.current.postMessage({
        type: 'validate',
        id: requestId,
        message,
        config,
      });
    },
    [config]
  );

  return {
    ...state,
    validate,
    validateImmediate,
  };
}

