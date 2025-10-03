// Hook for managing default commit message validation settings
// Provides CRUD operations for user settings with localStorage persistence

import { useCallback } from 'react';
import type { Config } from '@commitly/core';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from './use-local-storage';

// Settings configuration interface
export interface Settings extends Config {
  // Additional UI-specific settings
  enableAutoFixSuggestions: boolean;
  autoApplyFixesOnCommit: boolean;
  preferredStyle: 'conventional' | 'angular' | 'gitmoji';
  gitHooksEnabled: boolean;
  cicdEnabled: boolean;
}

const SETTINGS_KEY = 'settings';

// Default settings following Conventional Commits specification
export const DEFAULT_SETTINGS: Settings = {
  // Core validation rules
  types: [
    'feat',
    'fix',
    'docs',
    'style',
    'refactor',
    'perf',
    'test',
    'build',
    'ci',
    'chore',
    'revert',
  ],
  requireScope: false,
  maxHeaderLength: 72,
  maxLineLength: 100,
  subjectCase: 'lower',
  subjectEmptyForbidden: true,
  subjectFullStopForbidden: true,
  bodyLeadingBlank: true,
  footerLeadingBlank: true,
  blockedWords: [],
  
  // UI-specific settings
  enableAutoFixSuggestions: true,
  autoApplyFixesOnCommit: false,
  preferredStyle: 'conventional',
  gitHooksEnabled: false,
  cicdEnabled: false,
};

// Validator for settings data
function isValidSettings(data: unknown): data is Settings {
  if (typeof data !== 'object' || data === null) return false;

  const settings = data as Record<string, unknown>;
  
  // Validate core required fields
  return (
    Array.isArray(settings.types) &&
    typeof settings.requireScope === 'boolean' &&
    typeof settings.maxHeaderLength === 'number' &&
    typeof settings.maxLineLength === 'number' &&
    (settings.subjectCase === 'lower' || 
     settings.subjectCase === 'sentence' || 
     settings.subjectCase === 'any') &&
    typeof settings.enableAutoFixSuggestions === 'boolean'
  );
}

/**
 * Hook for managing user-specific settings with localStorage persistence
 * Automatically namespaced by user ID when authenticated
 */
export function useSettings() {
  const { user } = useAuth();

  const [settings, setSettings, clearSettings, isLoading] = useLocalStorage<Settings>(
    SETTINGS_KEY,
    {
      uid: user?.uid ?? null,
      defaultValue: DEFAULT_SETTINGS,
      validate: isValidSettings,
    }
  );

  // Get current settings or defaults
  const currentSettings = settings ?? DEFAULT_SETTINGS;

  // Update specific setting field
  const updateSetting = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      const updated = {
        ...currentSettings,
        [key]: value,
      };
      setSettings(updated);
    },
    [currentSettings, setSettings]
  );

  // Update multiple settings at once
  const updateSettings = useCallback(
    (updates: Partial<Settings>) => {
      const updated = {
        ...currentSettings,
        ...updates,
      };
      setSettings(updated);
    },
    [currentSettings, setSettings]
  );

  // Reset to default settings
  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, [setSettings]);

  // Export settings as JSON
  const exportSettings = useCallback(() => {
    const dataStr = JSON.stringify(currentSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `commitly-settings-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [currentSettings]);

  // Import settings from JSON file
  const importSettings = useCallback(
    (file: File): Promise<void> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string) as unknown;

            if (!isValidSettings(imported)) {
              reject(new Error('Invalid settings file format'));
              return;
            }

            setSettings(imported);
            resolve();
          } catch (error) {
            reject(new Error('Failed to parse settings file'));
          }
        };

        reader.onerror = () => {
          reject(new Error('Failed to read settings file'));
        };

        reader.readAsText(file);
      });
    },
    [setSettings]
  );

  // Get config object (without UI-specific fields) for validation
  const getValidationConfig = useCallback((): Config => {
    const {
      enableAutoFixSuggestions,
      autoApplyFixesOnCommit,
      preferredStyle,
      gitHooksEnabled,
      cicdEnabled,
      ...config
    } = currentSettings;
    
    return config;
  }, [currentSettings]);

  return {
    settings: currentSettings,
    isLoading,
    updateSetting,
    updateSettings,
    resetToDefaults,
    clearSettings,
    exportSettings,
    importSettings,
    getValidationConfig,
  };
}

