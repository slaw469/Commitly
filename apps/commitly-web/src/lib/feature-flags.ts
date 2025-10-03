// Feature flags system for progressive feature rollout
// Supports both localStorage and URL query parameters

/**
 * Available feature flags
 * Add new flags here as features are developed
 */
export enum FeatureFlag {
  // GitHub App integration (Phase 2)
  GITHUB_APP = 'ghApp',
  
  // Backend API integration
  BACKEND_API = 'backendApi',
  
  // Advanced analytics
  ANALYTICS = 'analytics',
  
  // Experimental features
  EXPERIMENTAL = 'experimental',
  
  // Debug mode
  DEBUG = 'debug',
}

/**
 * Feature flag configuration
 */
interface FeatureFlagConfig {
  name: string;
  description: string;
  defaultEnabled: boolean;
  requiresAuth?: boolean;
}

/**
 * Feature flag metadata
 */
const FEATURE_FLAG_CONFIG: Record<FeatureFlag, FeatureFlagConfig> = {
  [FeatureFlag.GITHUB_APP]: {
    name: 'GitHub App Integration',
    description: 'Enable GitHub App installation and repository monitoring',
    defaultEnabled: false,
    requiresAuth: true,
  },
  [FeatureFlag.BACKEND_API]: {
    name: 'Backend API',
    description: 'Enable backend API calls for data persistence',
    defaultEnabled: false,
  },
  [FeatureFlag.ANALYTICS]: {
    name: 'Analytics',
    description: 'Enable advanced analytics and tracking',
    defaultEnabled: false,
  },
  [FeatureFlag.EXPERIMENTAL]: {
    name: 'Experimental Features',
    description: 'Enable experimental and unstable features',
    defaultEnabled: false,
  },
  [FeatureFlag.DEBUG]: {
    name: 'Debug Mode',
    description: 'Enable debug logging and developer tools',
    defaultEnabled: false,
  },
};

const STORAGE_KEY = 'commitly:feature-flags';

/**
 * Get feature flags from localStorage
 */
function getStoredFlags(): Record<string, boolean> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Record<string, boolean>;
    }
  } catch (error) {
    console.warn('Failed to load feature flags from localStorage:', error);
  }
  return {};
}

/**
 * Save feature flags to localStorage
 */
function setStoredFlags(flags: Record<string, boolean>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
  } catch (error) {
    console.warn('Failed to save feature flags to localStorage:', error);
  }
}

/**
 * Get feature flags from URL query parameters
 * Format: ?feature=ghApp,backendApi or ?feature=ghApp&feature=backendApi
 */
function getURLFlags(): Record<string, boolean> {
  const flags: Record<string, boolean> = {};
  
  try {
    const params = new URLSearchParams(window.location.search);
    const featureParam = params.get('feature');
    
    if (featureParam) {
      // Handle comma-separated values
      const features = featureParam.split(',').map((f) => f.trim());
      features.forEach((feature) => {
        if (feature) {
          flags[feature] = true;
        }
      });
    }
    
    // Also handle multiple ?feature= params
    params.getAll('feature').forEach((value) => {
      value.split(',').forEach((feature) => {
        const trimmed = feature.trim();
        if (trimmed) {
          flags[trimmed] = true;
        }
      });
    });
  } catch (error) {
    console.warn('Failed to parse feature flags from URL:', error);
  }
  
  return flags;
}

/**
 * Check if a feature flag is enabled
 * Priority: URL params > localStorage > default value
 * 
 * @param flag - Feature flag to check
 * @returns true if enabled
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  const urlFlags = getURLFlags();
  const storedFlags = getStoredFlags();
  const config = FEATURE_FLAG_CONFIG[flag];
  
  // URL params take highest priority
  if (flag in urlFlags) {
    return urlFlags[flag];
  }
  
  // Then check localStorage
  if (flag in storedFlags) {
    return storedFlags[flag];
  }
  
  // Fall back to default
  return config?.defaultEnabled ?? false;
}

/**
 * Enable a feature flag in localStorage
 */
export function enableFeature(flag: FeatureFlag): void {
  const flags = getStoredFlags();
  flags[flag] = true;
  setStoredFlags(flags);
}

/**
 * Disable a feature flag in localStorage
 */
export function disableFeature(flag: FeatureFlag): void {
  const flags = getStoredFlags();
  flags[flag] = false;
  setStoredFlags(flags);
}

/**
 * Toggle a feature flag in localStorage
 */
export function toggleFeature(flag: FeatureFlag): boolean {
  const current = isFeatureEnabled(flag);
  if (current) {
    disableFeature(flag);
  } else {
    enableFeature(flag);
  }
  return !current;
}

/**
 * Get all feature flags with their current state
 */
export function getAllFeatureFlags(): Array<{
  flag: FeatureFlag;
  enabled: boolean;
  config: FeatureFlagConfig;
}> {
  return Object.values(FeatureFlag).map((flag) => ({
    flag,
    enabled: isFeatureEnabled(flag),
    config: FEATURE_FLAG_CONFIG[flag],
  }));
}

/**
 * Reset all feature flags to defaults
 */
export function resetFeatureFlags(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to reset feature flags:', error);
  }
}

/**
 * Get feature flag configuration
 */
export function getFeatureConfig(flag: FeatureFlag): FeatureFlagConfig | undefined {
  return FEATURE_FLAG_CONFIG[flag];
}

/**
 * Check if feature requires authentication
 */
export function requiresAuth(flag: FeatureFlag): boolean {
  return FEATURE_FLAG_CONFIG[flag]?.requiresAuth ?? false;
}

/**
 * Generate URL with feature flags
 * Useful for sharing links with specific features enabled
 */
export function getURLWithFeatures(
  baseURL: string,
  features: FeatureFlag[]
): string {
  if (features.length === 0) {
    return baseURL;
  }
  
  const url = new URL(baseURL, window.location.origin);
  const featureString = features.join(',');
  url.searchParams.set('feature', featureString);
  
  return url.toString();
}

/**
 * Parse feature flags from a URL string
 */
export function parseFeaturesFromURL(urlString: string): FeatureFlag[] {
  const features: FeatureFlag[] = [];
  
  try {
    const url = new URL(urlString, window.location.origin);
    const featureParam = url.searchParams.get('feature');
    
    if (featureParam) {
      featureParam.split(',').forEach((feature) => {
        const trimmed = feature.trim();
        if (Object.values(FeatureFlag).includes(trimmed as FeatureFlag)) {
          features.push(trimmed as FeatureFlag);
        }
      });
    }
  } catch (error) {
    console.warn('Failed to parse features from URL:', error);
  }
  
  return features;
}

/**
 * Hook-friendly feature flag checker
 * Returns a reactive function that can be called to check flags
 */
export function createFeatureFlagChecker(): {
  isEnabled: typeof isFeatureEnabled;
  enable: typeof enableFeature;
  disable: typeof disableFeature;
  toggle: typeof toggleFeature;
  getAll: typeof getAllFeatureFlags;
  reset: typeof resetFeatureFlags;
} {
  return {
    isEnabled: isFeatureEnabled,
    enable: enableFeature,
    disable: disableFeature,
    toggle: toggleFeature,
    getAll: getAllFeatureFlags,
    reset: resetFeatureFlags,
  };
}

