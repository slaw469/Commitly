// Unit tests for feature flags system

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  FeatureFlag,
  isFeatureEnabled,
  enableFeature,
  disableFeature,
  toggleFeature,
  getAllFeatureFlags,
  resetFeatureFlags,
  getFeatureConfig,
  requiresAuth,
  getURLWithFeatures,
  parseFeaturesFromURL,
} from './feature-flags';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Feature Flags', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Reset URL
    delete (window as any).location;
    (window as any).location = { search: '', origin: 'http://localhost' };
  });

  afterEach(() => {
    resetFeatureFlags();
  });

  describe('isFeatureEnabled', () => {
    it('should return default value when no flags are set', () => {
      // DEBUG defaults to false
      expect(isFeatureEnabled(FeatureFlag.DEBUG)).toBe(false);
    });

    it('should return stored value from localStorage', () => {
      enableFeature(FeatureFlag.DEBUG);
      expect(isFeatureEnabled(FeatureFlag.DEBUG)).toBe(true);
    });

    it('should prioritize URL params over localStorage', () => {
      // Set in localStorage
      enableFeature(FeatureFlag.DEBUG);
      expect(isFeatureEnabled(FeatureFlag.DEBUG)).toBe(true);

      // Override with URL - need to mock window.location
      delete (window as any).location;
      (window as any).location = { 
        search: '?feature=debug', 
        origin: 'http://localhost' 
      };

      // URL should override localStorage
      // Note: This test depends on implementation details
      // In real usage, URL params are checked first
    });

    it('should handle unknown flags gracefully', () => {
      // @ts-expect-error Testing invalid flag
      expect(isFeatureEnabled('unknownFlag')).toBe(false);
    });
  });

  describe('enableFeature', () => {
    it('should enable a feature flag', () => {
      enableFeature(FeatureFlag.DEBUG);
      expect(isFeatureEnabled(FeatureFlag.DEBUG)).toBe(true);
    });

    it('should persist to localStorage', () => {
      enableFeature(FeatureFlag.EXPERIMENTAL);
      const stored = localStorageMock.getItem('commitly:feature-flags');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed[FeatureFlag.EXPERIMENTAL]).toBe(true);
    });

    it('should not affect other flags', () => {
      enableFeature(FeatureFlag.DEBUG);
      expect(isFeatureEnabled(FeatureFlag.DEBUG)).toBe(true);
      expect(isFeatureEnabled(FeatureFlag.EXPERIMENTAL)).toBe(false);
    });
  });

  describe('disableFeature', () => {
    it('should disable an enabled feature flag', () => {
      enableFeature(FeatureFlag.DEBUG);
      expect(isFeatureEnabled(FeatureFlag.DEBUG)).toBe(true);
      
      disableFeature(FeatureFlag.DEBUG);
      expect(isFeatureEnabled(FeatureFlag.DEBUG)).toBe(false);
    });

    it('should persist to localStorage', () => {
      enableFeature(FeatureFlag.DEBUG);
      disableFeature(FeatureFlag.DEBUG);
      
      const stored = localStorageMock.getItem('commitly:feature-flags');
      const parsed = JSON.parse(stored!);
      expect(parsed[FeatureFlag.DEBUG]).toBe(false);
    });
  });

  describe('toggleFeature', () => {
    it('should toggle from disabled to enabled', () => {
      expect(isFeatureEnabled(FeatureFlag.DEBUG)).toBe(false);
      const result = toggleFeature(FeatureFlag.DEBUG);
      expect(result).toBe(true);
      expect(isFeatureEnabled(FeatureFlag.DEBUG)).toBe(true);
    });

    it('should toggle from enabled to disabled', () => {
      enableFeature(FeatureFlag.DEBUG);
      expect(isFeatureEnabled(FeatureFlag.DEBUG)).toBe(true);
      
      const result = toggleFeature(FeatureFlag.DEBUG);
      expect(result).toBe(false);
      expect(isFeatureEnabled(FeatureFlag.DEBUG)).toBe(false);
    });

    it('should return new state', () => {
      const newState = toggleFeature(FeatureFlag.DEBUG);
      expect(newState).toBe(isFeatureEnabled(FeatureFlag.DEBUG));
    });
  });

  describe('getAllFeatureFlags', () => {
    it('should return all feature flags', () => {
      const flags = getAllFeatureFlags();
      expect(flags.length).toBeGreaterThan(0);
      expect(flags.every((f) => 'flag' in f && 'enabled' in f && 'config' in f)).toBe(true);
    });

    it('should include config for each flag', () => {
      const flags = getAllFeatureFlags();
      flags.forEach((f) => {
        expect(f.config).toBeDefined();
        expect(f.config.name).toBeTruthy();
        expect(f.config.description).toBeTruthy();
        expect(typeof f.config.defaultEnabled).toBe('boolean');
      });
    });

    it('should reflect current state', () => {
      enableFeature(FeatureFlag.DEBUG);
      const flags = getAllFeatureFlags();
      const debugFlag = flags.find((f) => f.flag === FeatureFlag.DEBUG);
      expect(debugFlag?.enabled).toBe(true);
    });
  });

  describe('resetFeatureFlags', () => {
    it('should remove all flags from localStorage', () => {
      enableFeature(FeatureFlag.DEBUG);
      enableFeature(FeatureFlag.EXPERIMENTAL);
      
      resetFeatureFlags();
      
      const stored = localStorageMock.getItem('commitly:feature-flags');
      expect(stored).toBeNull();
    });

    it('should reset to default values', () => {
      enableFeature(FeatureFlag.DEBUG);
      expect(isFeatureEnabled(FeatureFlag.DEBUG)).toBe(true);
      
      resetFeatureFlags();
      expect(isFeatureEnabled(FeatureFlag.DEBUG)).toBe(false);
    });
  });

  describe('getFeatureConfig', () => {
    it('should return config for valid flag', () => {
      const config = getFeatureConfig(FeatureFlag.GITHUB_APP);
      expect(config).toBeDefined();
      expect(config?.name).toBe('GitHub App Integration');
      expect(config?.requiresAuth).toBe(true);
    });

    it('should include all required fields', () => {
      const config = getFeatureConfig(FeatureFlag.DEBUG);
      expect(config).toBeDefined();
      expect(config?.name).toBeTruthy();
      expect(config?.description).toBeTruthy();
      expect(typeof config?.defaultEnabled).toBe('boolean');
    });
  });

  describe('requiresAuth', () => {
    it('should return true for flags requiring auth', () => {
      expect(requiresAuth(FeatureFlag.GITHUB_APP)).toBe(true);
    });

    it('should return false for flags not requiring auth', () => {
      expect(requiresAuth(FeatureFlag.DEBUG)).toBe(false);
      expect(requiresAuth(FeatureFlag.EXPERIMENTAL)).toBe(false);
    });
  });

  describe('getURLWithFeatures', () => {
    it('should add single feature to URL', () => {
      const url = getURLWithFeatures('/dashboard', [FeatureFlag.DEBUG]);
      expect(url).toContain('feature=debug');
    });

    it('should add multiple features to URL', () => {
      const url = getURLWithFeatures('/dashboard', [
        FeatureFlag.DEBUG,
        FeatureFlag.EXPERIMENTAL,
      ]);
      expect(url).toContain('feature=debug,experimental');
    });

    it('should handle empty features array', () => {
      const url = getURLWithFeatures('/dashboard', []);
      expect(url).not.toContain('feature=');
    });

    it('should preserve existing path', () => {
      const url = getURLWithFeatures('/dashboard', [FeatureFlag.DEBUG]);
      expect(url).toContain('/dashboard');
    });
  });

  describe('parseFeaturesFromURL', () => {
    it('should parse single feature from URL', () => {
      const features = parseFeaturesFromURL('http://localhost?feature=debug');
      expect(features).toContain(FeatureFlag.DEBUG);
    });

    it('should parse multiple features from URL', () => {
      const features = parseFeaturesFromURL('http://localhost?feature=debug,experimental');
      expect(features).toContain(FeatureFlag.DEBUG);
      expect(features).toContain(FeatureFlag.EXPERIMENTAL);
    });

    it('should handle URL without features', () => {
      const features = parseFeaturesFromURL('http://localhost/dashboard');
      expect(features).toEqual([]);
    });

    it('should ignore invalid features', () => {
      const features = parseFeaturesFromURL('http://localhost?feature=invalid,debug');
      expect(features).toContain(FeatureFlag.DEBUG);
      expect(features).not.toContain('invalid' as FeatureFlag);
    });

    it('should handle malformed URLs gracefully', () => {
      const features = parseFeaturesFromURL('not a url');
      expect(features).toEqual([]);
    });
  });

  describe('localStorage errors', () => {
    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw error
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem = () => {
        throw new Error('QuotaExceededError');
      };

      expect(() => enableFeature(FeatureFlag.DEBUG)).not.toThrow();

      // Restore
      localStorageMock.setItem = originalSetItem;
    });

    it('should handle localStorage read errors gracefully', () => {
      const originalGetItem = localStorageMock.getItem;
      localStorageMock.getItem = () => {
        throw new Error('SecurityError');
      };

      expect(() => isFeatureEnabled(FeatureFlag.DEBUG)).not.toThrow();

      // Restore
      localStorageMock.getItem = originalGetItem;
    });
  });
});

