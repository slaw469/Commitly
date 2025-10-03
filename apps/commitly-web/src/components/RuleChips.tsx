// Live rule validation chips component
// Shows visual feedback for each validation rule with clear status indicators
// Implements accessibility best practices and clean visual design

import { Check, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ParsedCommit, ValidationResult } from '@commitly/core';

interface RuleChipProps {
  label: string;
  status: 'pass' | 'fail' | 'info';
  message?: string;
}

function RuleChip({ label, status, message }: RuleChipProps): JSX.Element {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
        status === 'pass' && 'bg-success/10 text-success border border-success/20',
        status === 'fail' && 'bg-destructive/10 text-destructive border border-destructive/20',
        status === 'info' && 'bg-muted text-muted-foreground border border-border/50'
      )}
      role="status"
      aria-label={message || label}
      title={message}
    >
      {status === 'pass' && <Check className="h-3 w-3" aria-hidden="true" />}
      {status === 'fail' && <X className="h-3 w-3" aria-hidden="true" />}
      {status === 'info' && <Info className="h-3 w-3" aria-hidden="true" />}
      <span>{label}</span>
    </div>
  );
}

interface ParseStripProps {
  parsed: ParsedCommit;
  className?: string;
}

/**
 * Shows parsed sections of the commit message (header/body/footer)
 * Provides clear visual separation and parsing feedback
 */
export function ParseStrip({ parsed, className }: ParseStripProps): JSX.Element {
  const hasHeader = parsed.header.length > 0;
  const hasBody = parsed.body !== null && parsed.body.length > 0;
  const hasFooter = parsed.footer !== null && parsed.footer.length > 0;

  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="region" aria-label="Parsed commit structure">
      <RuleChip
        label="Header"
        status={hasHeader ? 'pass' : 'info'}
        message={hasHeader ? `Header: ${parsed.header.length} chars` : 'No header'}
      />
      {parsed.type && (
        <RuleChip
          label={`Type: ${parsed.type}`}
          status="pass"
          message={`Commit type: ${parsed.type}`}
        />
      )}
      {parsed.scope && (
        <RuleChip
          label={`Scope: ${parsed.scope}`}
          status="pass"
          message={`Commit scope: ${parsed.scope}`}
        />
      )}
      {parsed.isBreaking && (
        <RuleChip
          label="BREAKING"
          status="fail"
          message="Contains breaking changes"
        />
      )}
      <RuleChip
        label="Body"
        status={hasBody ? 'pass' : 'info'}
        message={hasBody ? `Body: ${parsed.body!.length} chars` : 'No body'}
      />
      <RuleChip
        label="Footer"
        status={hasFooter ? 'pass' : 'info'}
        message={hasFooter ? `Footer: ${parsed.footer!.length} chars` : 'No footer'}
      />
    </div>
  );
}

interface RuleChipsProps {
  result: ValidationResult;
  className?: string;
}

/**
 * Live rule chips showing validation status for all rules
 * Provides at-a-glance feedback on commit message quality
 */
export function RuleChips({ result, className }: RuleChipsProps): JSX.Element {
  const { errors, warnings, parsed } = result;

  // Create rule status map
  const ruleStatus = new Map<string, 'pass' | 'fail'>();

  // Mark failed rules
  errors.forEach((error) => ruleStatus.set(error.rule, 'fail'));
  warnings.forEach((warning) => ruleStatus.set(warning.rule, 'fail'));

  // Common rules to display
  const rules = [
    {
      key: 'type',
      label: 'Type',
      status: ruleStatus.get('type-empty') || ruleStatus.get('type-enum') || (parsed.type ? 'pass' : 'fail'),
      message: parsed.type ? `Type: ${parsed.type}` : 'Type required',
    },
    {
      key: 'subject',
      label: 'Subject',
      status: ruleStatus.get('subject-empty') || ruleStatus.get('subject-case') || ruleStatus.get('subject-full-stop') || (parsed.subject ? 'pass' : 'fail'),
      message: parsed.subject ? 'Subject valid' : 'Subject required',
    },
    {
      key: 'header-length',
      label: `Header Length (${parsed.header.length}/72)`,
      status: ruleStatus.get('header-max-length') || (parsed.header.length <= 72 ? 'pass' : 'fail'),
      message: parsed.header.length <= 72 ? 'Header length OK' : 'Header too long',
    },
  ];

  // Add scope rule if scope exists
  if (parsed.scope) {
    rules.splice(1, 0, {
      key: 'scope',
      label: `Scope: ${parsed.scope}`,
      status: 'pass' as const,
      message: `Scope: ${parsed.scope}`,
    });
  }

  // Add body rules if body exists
  if (parsed.body) {
    rules.push({
      key: 'body-blank',
      label: 'Body Format',
      status: ruleStatus.get('body-leading-blank') || ruleStatus.get('body-max-line-length') || 'pass',
      message: 'Body formatting OK',
    });
  }

  // Add footer rules if footer exists
  if (parsed.footer) {
    rules.push({
      key: 'footer-blank',
      label: 'Footer Format',
      status: ruleStatus.get('footer-leading-blank') || 'pass',
      message: 'Footer formatting OK',
    });
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Main Rules */}
      <div className="flex flex-wrap gap-2" role="region" aria-label="Validation rules">
        {rules.map((rule) => (
          <RuleChip
            key={rule.key}
            label={rule.label}
            status={rule.status}
            message={rule.message}
          />
        ))}
      </div>

      {/* Parse Strip */}
      <div className="pt-2 border-t border-border/50">
        <h4 className="text-xs font-semibold text-muted-foreground mb-2">Parsed Structure</h4>
        <ParseStrip parsed={parsed} />
      </div>
    </div>
  );
}

