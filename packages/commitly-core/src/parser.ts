import type { ParsedCommit } from './types';

const HEADER_PATTERN = /^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/;
const BREAKING_PATTERN = /^BREAKING[ -]CHANGE:\s*(.+)/im;

/**
 * Parses a commit message into structured components
 * @param message - Raw commit message
 * @returns Parsed commit structure
 */
export function parseCommitMessage(message: string): ParsedCommit {
  const lines = message.split('\n');
  const header = lines[0] ?? '';
  
  // Find the first blank line to separate header from body
  let bodyStartIndex = 1;
  while (bodyStartIndex < lines.length && lines[bodyStartIndex]?.trim() === '') {
    bodyStartIndex++;
  }

  // Find footer (last paragraph or BREAKING CHANGE section)
  let footerStartIndex = lines.length;
  let hasFooter = false;
  
  // Look for BREAKING CHANGE or conventional footer patterns
  for (let i = lines.length - 1; i >= bodyStartIndex; i--) {
    const line = lines[i] ?? '';
    if (line.match(/^[A-Z][A-Za-z-]+:\s+/)) {
      footerStartIndex = i;
      hasFooter = true;
    } else if (line.trim() === '' && hasFooter) {
      break;
    } else if (!hasFooter && line.trim() !== '') {
      break;
    }
  }

  const bodyLines = lines.slice(bodyStartIndex, footerStartIndex);
  const footerLines = footerStartIndex < lines.length ? lines.slice(footerStartIndex) : [];

  const body = bodyLines.length > 0 ? bodyLines.join('\n').trim() : null;
  const footer = footerLines.length > 0 ? footerLines.join('\n').trim() : null;

  // Parse header
  const match = header.match(HEADER_PATTERN);
  let type: string | null = null;
  let scope: string | null = null;
  let subject: string | null = null;
  let isBreaking = false;

  if (match) {
    type = match[1] ?? null;
    scope = match[2] ?? null;
    isBreaking = match[3] === '!';
    subject = match[4] ?? null;
  } else {
    // Fallback: treat entire header as subject if it doesn't match pattern
    subject = header || null;
  }

  // Check for BREAKING CHANGE in footer
  if (footer && BREAKING_PATTERN.test(footer)) {
    isBreaking = true;
  }

  return {
    header,
    type,
    scope,
    subject,
    body,
    footer,
    isBreaking,
    raw: message,
  };
}

/**
 * Reconstructs a commit message from parsed components
 * @param parsed - Parsed commit structure
 * @returns Reconstructed commit message
 */
export function reconstructCommitMessage(parsed: ParsedCommit): string {
  const parts: string[] = [];

  // Build header
  if (parsed.type && parsed.subject) {
    let header = parsed.type;
    if (parsed.scope) {
      header += `(${parsed.scope})`;
    }
    if (parsed.isBreaking) {
      header += '!';
    }
    header += `: ${parsed.subject}`;
    parts.push(header);
  } else if (parsed.subject) {
    parts.push(parsed.subject);
  }

  // Add body with leading blank line
  if (parsed.body) {
    parts.push('');
    parts.push(parsed.body);
  }

  // Add footer with leading blank line
  if (parsed.footer) {
    parts.push('');
    parts.push(parsed.footer);
  }

  return parts.join('\n');
}

