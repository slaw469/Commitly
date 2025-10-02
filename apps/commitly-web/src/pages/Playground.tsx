// File: apps/commitly-web/src/pages/Playground.tsx

import { useMemo, useCallback, useState, useEffect } from 'react';
import { Check, Sparkles, AlertCircle, AlertTriangle, Copy, CheckCircle2, Home, Keyboard } from 'lucide-react';
import { validate, suggestFix } from '@commitly/core';
import type { ValidationResult } from '@commitly/core';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea, Label } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface Props {
  defaultMessage?: string;
}

const demoMessage = `feat: Add new login flow
- Implemented new UI for login screen
- Added backend authentication endpoint
- this breaks the old login flow, see ticket #123
BREAKING CHANGE: The login API is now changed.`;

const exampleTemplates = [
  {
    name: 'Feature',
    message: 'feat(auth): add social login integration',
  },
  {
    name: 'Bug Fix',
    message: 'fix(api): resolve timeout issue in user endpoint',
  },
  {
    name: 'Documentation',
    message: 'docs: update installation instructions',
  },
  {
    name: 'Breaking Change',
    message: 'feat(api)!: redesign authentication flow\n\nBREAKING CHANGE: Old auth tokens are no longer valid',
  },
];

export default function Playground({ defaultMessage = demoMessage }: Props): JSX.Element {
  const [inputMessage, setInputMessage] = useState<string>(defaultMessage);
  const [copiedFixed, setCopiedFixed] = useState<boolean>(false);

  const validationResult: ValidationResult = useMemo(() => {
    return validate(inputMessage);
  }, [inputMessage]);

  const fixedMessage = useMemo(() => {
    return suggestFix(inputMessage);
  }, [inputMessage]);

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

  const handleApplyFix = useCallback(() => {
    if (fixedMessage) {
      setInputMessage(fixedMessage);
      toast({
        variant: 'success',
        title: 'Auto-fix applied',
        description: 'Your commit message has been fixed',
      });
    }
  }, [fixedMessage]);

  const handleCopyFixed = useCallback(() => {
    if (fixedMessage) {
      navigator.clipboard.writeText(fixedMessage);
      setCopiedFixed(true);
      setTimeout(() => setCopiedFixed(false), 2000);
      toast({
        variant: 'success',
        title: 'Copied to clipboard',
        description: 'Fixed commit message copied',
      });
    }
  }, [fixedMessage]);

  const handleLoadTemplate = useCallback((template: string) => {
    setInputMessage(template);
    toast({
      variant: 'default',
      title: 'Template loaded',
      description: 'Example commit message loaded',
    });
  }, []);

  const totalIssues = validationResult.errors.length + validationResult.warnings.length;
  const charCount = validationResult.parsed.header.length;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter - Show validation result
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        toast({
          variant: totalIssues === 0 ? 'success' : 'destructive',
          title: totalIssues === 0 ? 'Valid commit' : `${totalIssues} issue(s) found`,
          description: totalIssues === 0 ? 'Your commit message is valid' : 'Check the issues below',
        });
      }
      
      // Cmd/Ctrl + Shift + F - Apply auto-fix
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        handleApplyFix();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [totalIssues, handleApplyFix]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="/" className="inline-flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </a>
            </Button>
            <div className="h-4 w-px bg-border" />
            <h2 className="text-xl font-bold font-display text-foreground">Commit Playground</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              title="Keyboard shortcuts: Cmd/Ctrl+Enter to validate, Cmd/Ctrl+Shift+F to auto-fix"
              className="h-9 w-9 p-0"
            >
              <Keyboard className="h-4 w-4" />
            </Button>
            <a href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column - Templates */}
          <aside className="xl:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Example Templates</CardTitle>
                <CardDescription>Load a template to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {exampleTemplates.map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadTemplate(template.message)}
                      className="w-full justify-start text-left h-auto py-2"
                    >
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-medium text-xs">{template.name}</span>
                        <span className="text-xs text-muted-foreground font-mono truncate w-full">
                          {template.message.split('\n')[0]}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Validation</span>
                    {totalIssues === 0 ? (
                      <span className="inline-flex items-center gap-1 text-success text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-destructive text-sm font-medium">
                        <AlertCircle className="h-4 w-4" />
                        {totalIssues} {totalIssues === 1 ? 'issue' : 'issues'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Header Length</span>
                    <span className={cn(
                      'text-sm font-medium',
                      charCount > 72 ? 'text-destructive' : 'text-muted-foreground'
                    )}>
                      {charCount}/72
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Auto-fix</span>
                    {fixedMessage ? (
                      <span className="text-primary text-sm font-medium">Available</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not needed</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Center Column - Editor & Diff */}
          <div className="xl:col-span-9 space-y-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Commit Message</CardTitle>
                    <CardDescription>Type or paste your commit message here</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {totalIssues > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium">
                        <AlertTriangle className="h-3 w-3" />
                        {totalIssues} {totalIssues === 1 ? 'issue' : 'issues'}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="commit-input">Message</Label>
                    <Textarea
                      id="commit-input"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="min-h-[200px] font-mono text-sm mt-2"
                      placeholder="feat(scope): add amazing feature"
                      error={validationResult.errors.length > 0}
                    />
                  </div>

                  {/* Issues List */}
                  {(validationResult.errors.length > 0 || validationResult.warnings.length > 0) && (
                    <div className="space-y-2 pt-4 border-t border-border/50">
                      {validationResult.errors.map((error, index) => (
                        <div key={`error-${index}`} className="flex items-start gap-2 p-3 rounded-md bg-destructive/10">
                          <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-destructive">{error.message}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Rule: <code className="font-mono">{error.rule}</code>
                            </p>
                          </div>
                        </div>
                      ))}
                      {validationResult.warnings.map((warning, index) => (
                        <div key={`warning-${index}`} className="flex items-start gap-2 p-3 rounded-md bg-warning/10">
                          <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-warning">{warning.message}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Rule: <code className="font-mono">{warning.rule}</code>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Auto-Fix Section */}
            {fixedMessage && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Auto-Fixed Message</CardTitle>
                      <CardDescription>Smart suggestions to fix your commit message</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyFixed}
                        disabled={copiedFixed}
                      >
                        {copiedFixed ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button variant="primary" size="sm" onClick={handleApplyFix}>
                        <Sparkles className="h-4 w-4 mr-1" />
                        Apply Fix
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-sm space-y-1 bg-card p-4 rounded-md border border-border/50">
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
                        <span className="select-none mr-2">
                          {line.type === 'removed' && '-'}
                          {line.type === 'added' && '+'}
                          {line.type === 'unchanged' && ' '}
                        </span>
                        {line.text || ' '}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success State */}
            {totalIssues === 0 && !fixedMessage && (
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-4">
                      <Check className="h-8 w-8 text-success" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Perfect Commit Message!</h3>
                    <p className="text-muted-foreground text-sm max-w-md">
                      Your commit message follows all Conventional Commits rules. No fixes needed.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

