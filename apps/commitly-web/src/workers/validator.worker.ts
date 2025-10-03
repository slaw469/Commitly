// Web Worker for commit message validation
// Runs validation in a separate thread to prevent UI blocking
// Implements best practices: no shared state, proper message handling, graceful error handling

import { validateCommit, suggestFix } from '@commitly/core';
import type { Config, ValidationResult } from '@commitly/core';

export interface ValidationRequest {
  type: 'validate';
  id: string;
  message: string;
  config?: Partial<Config>;
}

export interface ValidationResponse {
  type: 'validated';
  id: string;
  result: ValidationResult;
  fixedMessage: string | null;
  timestamp: number;
}

export interface ErrorResponse {
  type: 'error';
  id: string;
  error: string;
  timestamp: number;
}

// Handle messages from the main thread
self.addEventListener('message', (event: MessageEvent<ValidationRequest>) => {
  const { type, id, message, config } = event.data;

  if (type !== 'validate') {
    const errorResponse: ErrorResponse = {
      type: 'error',
      id,
      error: `Unknown message type: ${type}`,
      timestamp: Date.now(),
    };
    self.postMessage(errorResponse);
    return;
  }

  try {
    // Validate the commit message
    const result = validateCommit(message, config);

    // Get auto-fix suggestion
    const fixedMessage = suggestFix(message, config);

    // Send results back to main thread
    const response: ValidationResponse = {
      type: 'validated',
      id,
      result,
      fixedMessage,
      timestamp: Date.now(),
    };

    self.postMessage(response);
  } catch (error) {
    // Handle validation errors gracefully
    const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
    const errorResponse: ErrorResponse = {
      type: 'error',
      id,
      error: errorMessage,
      timestamp: Date.now(),
    };
    self.postMessage(errorResponse);
  }
});

// Signal that the worker is ready
self.postMessage({ type: 'ready' });

