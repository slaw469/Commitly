// Structured logging utility to replace console.log/warn/error
// Provides better debugging and can be integrated with error monitoring services

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment: boolean;
  private enabledLevels: Set<LogLevel>;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.enabledLevels = new Set<LogLevel>(
      this.isDevelopment ? ['debug', 'info', 'warn', 'error'] : ['warn', 'error']
    );
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    if (!this.enabledLevels.has(level)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...context,
    };

    // In development, use console for immediate feedback
    if (this.isDevelopment) {
      const logFn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
      logFn(`[${level.toUpperCase()}]`, message, context || '');
      return;
    }

    // In production, send to error monitoring service (e.g., Sentry)
    // For now, only log errors and warnings
    if (level === 'error' || level === 'warn') {
      // TODO: Integrate with Sentry or other monitoring service
      // Sentry.captureMessage(message, { level, extra: context });
      
      // Fallback to console for now
      console[level](JSON.stringify(logData));
    }
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorContext = {
      ...context,
      ...(error instanceof Error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }),
    };
    this.log('error', message, errorContext);
  }
}

// Export singleton instance
export const logger = new Logger();

// Helper for feature flag logging
export function logFeatureFlag(flagName: string, value: boolean) {
  logger.debug(`Feature flag: ${flagName}`, { flagName, value });
}

// Helper for storage operations
export function logStorageOperation(operation: string, key: string, success: boolean) {
  if (!success) {
    logger.warn(`Storage operation failed: ${operation}`, { operation, key });
  }
}

// Helper for worker communication
export function logWorkerEvent(event: string, data?: unknown) {
  logger.debug(`Worker event: ${event}`, { event, data });
}

