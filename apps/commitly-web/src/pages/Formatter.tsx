// File: apps/commitly-web/src/pages/Formatter.tsx

import { useState, useCallback, useMemo } from 'react';
import { Check, Sparkles, AlertCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { validate, suggestFix } from '@commitly/core';
import type { ValidationResult } from '@commitly/core';
import { cn } from '@/lib/utils';

interface Props {
  defaultMessage?: string;
  autoApplyRules?: boolean;
}

// Demo data - realistic commit message example
const demoMessage = `feat: Add new login flow
- Implemented new UI for login screen
- Added backend authentication endpoint
- this breaks the old login flow, see ticket #123
BREAKING CHANGE: The login API is now changed.`;

export default function Formatter({
  defaultMessage = demoMessage,
  autoApplyRules = true,
}: Props): JSX.Element {
  const [inputMessage, setInputMessage] = useState<string>(defaultMessage);
  const [autoApply, setAutoApply] = useState<boolean>(autoApplyRules);
  const [showQuickTips, setShowQuickTips] = useState<boolean>(false);

  // Validate input message
  const validationResult: ValidationResult = useMemo(() => {
    return validate(inputMessage);
  }, [inputMessage]);

  // Generate auto-fixed message
  const fixedMessage = useMemo(() => {
    return suggestFix(inputMessage);
  }, [inputMessage]);

  // Calculate character count
  const charCount = useMemo(() => {
    const headerLength = validationResult.parsed.header.length;
    return headerLength;
  }, [validationResult]);

  // Generate diff display
  const diffLines = useMemo(() => {
    if (!fixedMessage) return [];

    const originalLines = inputMessage.split('\n');
    const fixedLines = fixedMessage.split('\n');
    const diff: Array<{ type: 'removed' | 'added' | 'unchanged'; text: string }> = [];

    let i = 0;
    let j = 0;

    while (i < originalLines.length || j < fixedLines.length) {
      const origLine = originalLines[i] ?? '';
      const fixLine = fixedLines[j] ?? '';

      if (i < originalLines.length && j < fixedLines.length && origLine === fixLine) {
        diff.push({ type: 'unchanged', text: origLine });
        i++;
        j++;
      } else {
        if (i < originalLines.length) {
          diff.push({ type: 'removed', text: origLine });
          i++;
        }
        if (j < fixedLines.length && (i >= originalLines.length || origLine !== fixLine)) {
          diff.push({ type: 'added', text: fixLine });
          j++;
        }
      }
    }

    return diff;
  }, [inputMessage, fixedMessage]);

  // Handle manual lint
  const handleLintMessage = useCallback(() => {
    // Validation already happens automatically via memo
    // This could trigger additional UI feedback if needed
  }, []);

  // Handle auto-fix application
  const handleAutoFix = useCallback(() => {
    if (fixedMessage) {
      setInputMessage(fixedMessage);
    }
  }, [fixedMessage]);

  // Copy fixed message to clipboard
  const handleCopyFixed = useCallback(() => {
    if (fixedMessage) {
      navigator.clipboard.writeText(fixedMessage);
    }
  }, [fixedMessage]);

  const totalIssues = validationResult.errors.length + validationResult.warnings.length;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-sidebar border-r border-border/50 p-4">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <Check className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold font-display text-foreground">Commitly</h1>
        </div>

        <nav className="flex flex-col gap-2" role="navigation" aria-label="Main navigation">
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </a>

          <a
            href="/reports"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Reports
          </a>

          <a
            href="/formatter"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium bg-secondary text-foreground transition-colors"
            aria-current="page"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
              />
            </svg>
            Formatter
          </a>

          <a
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </a>

          <a
            href="/docs"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Docs
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-2xl font-bold font-display text-foreground">Commit Message Formatter</h2>
            <div className="flex items-center gap-2">
              <label htmlFor="auto-apply-toggle" className="text-sm text-muted-foreground">
                Apply Rules Automatically
              </label>
              <input
                id="auto-apply-toggle"
                type="checkbox"
                checked={autoApply}
                onChange={(e) => setAutoApply(e.target.checked)}
                className="sr-only peer"
                aria-label="Apply rules automatically"
              />
              <div
                onClick={() => setAutoApply(!autoApply)}
                className="relative inline-flex items-center cursor-pointer w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors"
                style={{
                  backgroundColor: autoApply ? 'hsl(var(--primary))' : undefined,
                }}
              />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-6 gap-6">
          {/* Two-Panel Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
            {/* Input Panel */}
            <section className="glassmorphism rounded-lg flex flex-col" aria-label="Input message">
              <header className="p-4 border-b border-border/50">
                <h3 className="font-semibold text-foreground">Input Message</h3>
              </header>

              <div className="flex-1 p-4">
                <label htmlFor="commit-input" className="sr-only">
                  Commit message input
                </label>
                <textarea
                  id="commit-input"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="w-full h-full min-h-[300px] bg-transparent border-0 focus:ring-0 resize-none font-mono text-foreground text-sm p-0 placeholder:text-muted-foreground focus-visible:outline-none"
                  placeholder="feat: Add new login flow&#10;- Implemented new UI for login screen&#10;- Added backend authentication endpoint&#10;- this breaks the old login flow, see ticket #123&#10;BREAKING CHANGE: The login API is now changed."
                  aria-describedby="input-status"
                />
              </div>

              <footer className="p-4 border-t border-border/50" id="input-status">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    {totalIssues > 0 ? (
                      <>
                        <AlertTriangle className="h-4 w-4 text-warning" aria-hidden="true" />
                        <span className="text-muted-foreground">
                          {totalIssues} {totalIssues === 1 ? 'issue' : 'issues'} found
                        </span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 text-success" aria-hidden="true" />
                        <span className="text-success">No issues found</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      {charCount}/72
                    </span>
                  </div>
                </div>

                {/* Issues List */}
                {(validationResult.errors.length > 0 || validationResult.warnings.length > 0) && (
                  <div className="space-y-2 text-sm" role="list" aria-label="Validation issues">
                    {validationResult.errors.map((error, index) => (
                      <div key={`error-${index}`} className="flex items-start gap-2" role="listitem">
                        <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <div className="flex-1">
                          <p className="text-foreground">{error.message}</p>
                          <p className="text-muted-foreground font-mono text-xs mt-0.5">
                            Rule: <span className="text-destructive/80">{error.rule}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                    {validationResult.warnings.map((warning, index) => (
                      <div key={`warning-${index}`} className="flex items-start gap-2" role="listitem">
                        <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <div className="flex-1">
                          <p className="text-foreground">{warning.message}</p>
                          <p className="text-muted-foreground font-mono text-xs mt-0.5">
                            Rule: <span className="text-warning/80">{warning.rule}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </footer>
            </section>

            {/* Output Panel - Auto-Fixed Message (Diff) */}
            <section className="glassmorphism rounded-lg flex flex-col" aria-label="Auto-fixed message">
              <header className="p-4 border-b border-border/50">
                <h3 className="font-semibold text-foreground">Auto-Fixed Message (Diff)</h3>
              </header>

              <div className="flex-1 p-4 overflow-y-auto">
                {fixedMessage ? (
                  <div className="font-mono text-sm space-y-1">
                    {diffLines.map((line, index) => (
                      <div
                        key={index}
                        className={cn(
                          'px-2 py-1 rounded',
                          line.type === 'removed' && 'bg-destructive/10 text-destructive',
                          line.type === 'added' && 'bg-success/10 text-success',
                          line.type === 'unchanged' && 'text-muted-foreground'
                        )}
                      >
                        <span className="select-none mr-2" aria-hidden="true">
                          {line.type === 'removed' && '-'}
                          {line.type === 'added' && '+'}
                        </span>
                        {line.text || ' '}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    <div className="text-center">
                      <Check className="h-12 w-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
                      <p>No fixes needed</p>
                      <p className="text-xs mt-1">Your commit message is already compliant!</p>
                    </div>
                  </div>
                )}
              </div>

              {fixedMessage && (
                <footer className="p-4 border-t border-border/50">
                  <button
                    onClick={handleCopyFixed}
                    className="w-full bg-secondary text-foreground font-medium py-2 px-4 rounded-md hover:bg-border transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Copy Fixed Message
                  </button>
                </footer>
              )}
            </section>
          </div>

          {/* Action Buttons */}
          <div className="flex-shrink-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleLintMessage}
                className="flex items-center gap-2 bg-secondary text-foreground font-medium py-2 px-4 rounded-md hover:bg-border transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                Lint Message
              </button>
              <button
                onClick={handleAutoFix}
                disabled={!fixedMessage}
                className="flex items-center gap-2 bg-primary text-primary-foreground font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity text-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Auto-Fix Message
              </button>
            </div>

            <button
              onClick={() => setShowQuickTips(!showQuickTips)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-2 py-1"
              aria-expanded={showQuickTips}
            >
              <Lightbulb className="h-4 w-4" aria-hidden="true" />
              <span>Quick Tips</span>
            </button>
          </div>

          {/* Quick Tips Panel */}
          {showQuickTips && (
            <section className="glassmorphism rounded-lg p-6" aria-label="Quick tips">
              <h4 className="text-base font-bold font-display text-foreground mb-4">
                Conventional Commits Quick Tips
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h5 className="font-bold text-foreground mb-2">Structure</h5>
                  <pre className="font-mono text-muted-foreground text-xs bg-secondary p-3 rounded overflow-x-auto">
                    {`<type>(<scope>): <subject>

<body>

<footer>`}
                  </pre>
                </div>

                <div>
                  <h5 className="font-bold text-foreground mb-2">Common Types</h5>
                  <ul className="space-y-1.5 text-muted-foreground" role="list">
                    <li>
                      <span className="font-mono text-primary">feat</span>: A new feature
                    </li>
                    <li>
                      <span className="font-mono text-primary">fix</span>: A bug fix
                    </li>
                    <li>
                      <span className="font-mono text-primary">docs</span>: Documentation only changes
                    </li>
                    <li>
                      <span className="font-mono text-primary">style</span>: Code style changes
                    </li>
                    <li>
                      <span className="font-mono text-primary">refactor</span>: A code change that neither fixes a bug
                      nor adds a feature
                    </li>
                    <li>
                      <span className="font-mono text-primary">chore</span>: Build process or auxiliary tool changes
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-foreground mb-2">Key Rules</h5>
                  <ul className="space-y-1.5 text-muted-foreground" role="list">
                    <li>Subject line must be 50 chars or less</li>
                    <li>Subject line must be lowercase</li>
                    <li>Use the imperative, present tense</li>
                    <li>Body is optional, wraps at 72 chars</li>
                    <li>Footer for BREAKING CHANGE or issue refs</li>
                  </ul>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

