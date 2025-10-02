import { z } from 'zod';

/**
 * Configuration schema for commit message rules
 */
export const ConfigSchema = z.object({
  types: z
    .array(z.string())
    .default([
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
    ]),
  requireScope: z.boolean().default(false),
  maxHeaderLength: z.number().int().positive().default(72),
  maxLineLength: z.number().int().positive().default(100),
  subjectCase: z.enum(['lower', 'sentence', 'any']).default('lower'),
  subjectEmptyForbidden: z.boolean().default(true),
  subjectFullStopForbidden: z.boolean().default(true),
  bodyLeadingBlank: z.boolean().default(true),
  footerLeadingBlank: z.boolean().default(true),
  blockedWords: z.array(z.string()).default([]),
});

export type Config = z.infer<typeof ConfigSchema>;

/**
 * Parsed commit message structure
 */
export interface ParsedCommit {
  header: string;
  type: string | null;
  scope: string | null;
  subject: string | null;
  body: string | null;
  footer: string | null;
  isBreaking: boolean;
  raw: string;
}

/**
 * Validation error or warning
 */
export interface ValidationIssue {
  level: 'error' | 'warning';
  rule: string;
  message: string;
}

/**
 * Complete validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  parsed: ParsedCommit;
  suggestion: string | null;
}

/**
 * Auto-fix options
 */
export interface AutoFixOptions {
  inferType?: boolean;
  fixCase?: boolean;
  fixTrailingPeriod?: boolean;
  wrapLines?: boolean;
  config?: Partial<Config>;
}
