import { cosmiconfig } from 'cosmiconfig';
import type { Config } from '@commitly/core';
import { ConfigSchema } from '@commitly/core';

const explorer = cosmiconfig('commitly', {
  searchPlaces: [
    'package.json',
    '.commitlyrc',
    '.commitlyrc.json',
    '.commitlyrc.yaml',
    '.commitlyrc.yml',
    '.commitlyrc.js',
    '.commitlyrc.cjs',
    'commitly.config.js',
    'commitly.config.cjs',
  ],
});

/**
 * Loads configuration from various sources
 * @param cwd - Working directory to search from
 * @returns Parsed configuration or null if not found
 */
export async function loadConfig(cwd?: string): Promise<Partial<Config> | null> {
  try {
    const result = await explorer.search(cwd);
    
    if (!result || result.isEmpty) {
      return null;
    }

    // Validate config using zod schema (partial)
    const validated = ConfigSchema.partial().parse(result.config);
    return validated;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error loading config: ${error.message}`);
    }
    return null;
  }
}

/**
 * Loads config from a specific file
 * @param filepath - Path to config file
 * @returns Parsed configuration
 */
export async function loadConfigFromFile(filepath: string): Promise<Partial<Config> | null> {
  try {
    const result = await explorer.load(filepath);
    
    if (!result || result.isEmpty) {
      return null;
    }

    const validated = ConfigSchema.partial().parse(result.config);
    return validated;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error loading config from ${filepath}: ${error.message}`);
    }
    return null;
  }
}

