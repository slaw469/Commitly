// Hook for managing commit message rule presets
// Uses uid-namespaced localStorage for user-specific presets

import { useCallback } from 'react';
import type { Config } from '@commitly/core';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from './use-local-storage';

export interface Preset {
  id: string;
  name: string;
  description: string;
  config: Partial<Config>;
  createdAt: string;
  updatedAt?: string;
}

const PRESETS_KEY = 'presets';

// Default presets available to all users
const DEFAULT_PRESETS: Preset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard Conventional Commits configuration',
    config: {
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
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'strict',
    name: 'Strict',
    description: 'Stricter rules with required scopes',
    config: {
      types: ['feat', 'fix', 'docs', 'refactor', 'test', 'chore'],
      requireScope: true,
      maxHeaderLength: 50,
      maxLineLength: 72,
      subjectCase: 'lower',
      blockedWords: ['wip', 'todo', 'fixme'],
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'angular',
    name: 'Angular',
    description: 'Angular commit message convention',
    config: {
      types: ['build', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'test'],
      requireScope: false,
      maxHeaderLength: 72,
      maxLineLength: 100,
      subjectCase: 'lower',
      subjectEmptyForbidden: true,
      subjectFullStopForbidden: true,
      bodyLeadingBlank: true,
      footerLeadingBlank: true,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gitmoji',
    name: 'Gitmoji',
    description: 'Gitmoji convention with emoji support',
    config: {
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
      maxHeaderLength: 80,
      maxLineLength: 100,
      subjectCase: 'lower',
      subjectEmptyForbidden: true,
      subjectFullStopForbidden: true,
    },
    createdAt: new Date().toISOString(),
  },
];

// Validator for preset data
function isValidPreset(data: unknown): data is Preset {
  if (typeof data !== 'object' || data === null) return false;

  const preset = data as Record<string, unknown>;
  return (
    typeof preset.id === 'string' &&
    typeof preset.name === 'string' &&
    typeof preset.description === 'string' &&
    typeof preset.config === 'object' &&
    preset.config !== null &&
    typeof preset.createdAt === 'string'
  );
}

// Validator for preset array
function isValidPresetArray(data: unknown): data is Preset[] {
  return Array.isArray(data) && data.every(isValidPreset);
}

/**
 * Hook for managing user-specific presets with localStorage persistence
 * Automatically namespaced by user ID
 */
export function usePresets() {
  const { user } = useAuth();

  const [presets, setPresets, clearPresets, isLoading] = useLocalStorage<Preset[]>(
    PRESETS_KEY,
    {
      uid: user?.uid ?? null,
      defaultValue: DEFAULT_PRESETS,
      validate: isValidPresetArray,
    }
  );

  const addPreset = useCallback(
    (preset: Omit<Preset, 'id' | 'createdAt'>) => {
      const newPreset: Preset = {
        ...preset,
        id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      const currentPresets = presets ?? DEFAULT_PRESETS;
      setPresets([...currentPresets, newPreset]);

      return newPreset;
    },
    [presets, setPresets]
  );

  const updatePreset = useCallback(
    (id: string, updates: Partial<Omit<Preset, 'id' | 'createdAt'>>) => {
      const currentPresets = presets ?? DEFAULT_PRESETS;
      const updated = currentPresets.map((preset) =>
        preset.id === id
          ? { ...preset, ...updates, updatedAt: new Date().toISOString() }
          : preset
      );
      setPresets(updated);

      return updated.find((p) => p.id === id) ?? null;
    },
    [presets, setPresets]
  );

  const deletePreset = useCallback(
    (id: string) => {
      const currentPresets = presets ?? DEFAULT_PRESETS;
      const filtered = currentPresets.filter((preset) => preset.id !== id);
      setPresets(filtered);
    },
    [presets, setPresets]
  );

  const getPresetById = useCallback(
    (id: string) => {
      const currentPresets = presets ?? DEFAULT_PRESETS;
      return currentPresets.find((preset) => preset.id === id) ?? null;
    },
    [presets]
  );

  const resetToDefaults = useCallback(() => {
    setPresets(DEFAULT_PRESETS);
  }, [setPresets]);

  const exportPresets = useCallback(() => {
    const currentPresets = presets ?? DEFAULT_PRESETS;
    const dataStr = JSON.stringify(currentPresets, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `commitly-presets-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [presets]);

  const importPresets = useCallback(
    (file: File): Promise<number> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string) as unknown;

            if (!isValidPresetArray(imported)) {
              reject(new Error('Invalid preset file format'));
              return;
            }

            // Merge with existing presets, avoiding duplicates by ID
            const currentPresets = presets ?? DEFAULT_PRESETS;
            const existingIds = new Set(currentPresets.map((p) => p.id));
            const newPresets = imported.filter((p) => !existingIds.has(p.id));

            if (newPresets.length === 0) {
              reject(new Error('No new presets to import (all IDs already exist)'));
              return;
            }

            setPresets([...currentPresets, ...newPresets]);
            resolve(newPresets.length);
          } catch (error) {
            reject(new Error('Failed to parse preset file'));
          }
        };

        reader.onerror = () => {
          reject(new Error('Failed to read preset file'));
        };

        reader.readAsText(file);
      });
    },
    [presets, setPresets]
  );

  return {
    presets: presets ?? DEFAULT_PRESETS,
    isLoading,
    addPreset,
    updatePreset,
    deletePreset,
    getPresetById,
    resetToDefaults,
    clearPresets,
    exportPresets,
    importPresets,
  };
}

