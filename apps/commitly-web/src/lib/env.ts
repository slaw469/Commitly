// Environment variable validation using Zod
// This ensures all required environment variables are present and valid at build time

import { z } from 'zod';

const envSchema = z.object({
  // Firebase Configuration (all required for auth to work)
  VITE_FIREBASE_API_KEY: z.string().min(1, 'Firebase API key is required'),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase auth domain is required'),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase project ID is required'),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase storage bucket is required'),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z
    .string()
    .min(1, 'Firebase messaging sender ID is required'),
  VITE_FIREBASE_APP_ID: z.string().min(1, 'Firebase app ID is required'),
  VITE_FIREBASE_MEASUREMENT_ID: z.string().optional(),

  // Optional: Error monitoring
  VITE_SENTRY_DSN: z.string().url().optional(),

  // Optional: Environment
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).optional(),
});

// Validate environment variables
function validateEnv() {
  try {
    const parsed = envSchema.parse(import.meta.env);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors.map((err) => `  - ${err.path.join('.')}: ${err.message}`);

      console.error('❌ Environment validation failed:');
      console.error(missing.join('\n'));
      console.error('\n📝 Please check your .env file and ensure all required variables are set.');
      console.error('   See .env.example for reference.');

      throw new Error('Invalid environment configuration');
    }
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnv();

// Export individual variables for convenience
export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const isDevelopment = env.VITE_APP_ENV === 'development' || import.meta.env.DEV;
export const isProduction = env.VITE_APP_ENV === 'production' || import.meta.env.PROD;

