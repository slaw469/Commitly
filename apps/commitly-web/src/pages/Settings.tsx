// File: apps/commitly-web/src/pages/Settings.tsx

import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface CommitRulesSettings {
  maxSubjectLength: number;
  requireTypeScope: boolean;
  subjectSentenceCase: boolean;
  requireBlankLineBeforeBody: boolean;
  allowedCommitTypes: string;
}

interface AutoFixSettings {
  enableAutoFixSuggestions: boolean;
  autoApplyFixesOnCommit: boolean;
  preferredStyle: string;
}

interface IntegrationSettings {
  gitHooksEnabled: boolean;
  cicdEnabled: boolean;
  gitHooksStatus: 'active' | 'inactive';
  cicdStatus: 'active' | 'inactive';
}

interface AppearanceSettings {
  theme: 'light' | 'dark';
  defaultTheme: 'system' | 'light' | 'dark';
}

interface GeneralSettings {
  version: string;
}

interface Props {
  commitRules?: CommitRulesSettings;
  autoFix?: AutoFixSettings;
  integrations?: IntegrationSettings;
  appearance?: AppearanceSettings;
  general?: GeneralSettings;
}

// Demo data - realistic default settings
const demoCommitRules: CommitRulesSettings = {
  maxSubjectLength: 50,
  requireTypeScope: true,
  subjectSentenceCase: false,
  requireBlankLineBeforeBody: true,
  allowedCommitTypes: 'feat, fix, docs, style, refactor, test, chore',
};

const demoAutoFix: AutoFixSettings = {
  enableAutoFixSuggestions: true,
  autoApplyFixesOnCommit: false,
  preferredStyle: 'Conventional Commits',
};

const demoIntegrations: IntegrationSettings = {
  gitHooksEnabled: true,
  cicdEnabled: true,
  gitHooksStatus: 'active',
  cicdStatus: 'active',
};

const demoAppearance: AppearanceSettings = {
  theme: 'dark',
  defaultTheme: 'system',
};

const demoGeneral: GeneralSettings = {
  version: 'v1.2.3',
};

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionSection({
  title,
  isOpen,
  onToggle,
  children,
}: AccordionSectionProps): JSX.Element {
  return (
    <div className="bg-card/50 rounded-lg border border-border/50">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t-lg transition-colors hover:bg-card/70"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold font-display text-foreground">{title}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground transition-transform" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform" />
        )}
      </button>
      {isOpen && <div className="p-4 border-t border-border/50 space-y-6">{children}</div>}
    </div>
  );
}

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  label: string;
  ariaLabel?: string;
}

function ToggleSwitch({ id, checked, label, ariaLabel }: ToggleSwitchProps): JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <span className="text-foreground">{label}</span>
      <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          id={id}
          className="sr-only peer"
          defaultChecked={checked}
          aria-label={ariaLabel || label}
        />
        <div className="w-11 h-6 bg-secondary rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring transition-colors peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:bg-primary-foreground"></div>
      </label>
    </div>
  );
}

export default function Settings({
  commitRules = demoCommitRules,
  autoFix = demoAutoFix,
  integrations = demoIntegrations,
  appearance = demoAppearance,
  general = demoGeneral,
}: Props): JSX.Element {
  const [openPanel, setOpenPanel] = useState<string>('rules');

  const togglePanel = (panel: string) => {
    setOpenPanel(openPanel === panel ? '' : panel);
  };

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
            href="/add-project"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Project
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
                d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
              />
            </svg>
            Formatter
          </a>

          <a
            href="/settings"
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
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
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-6 py-4">
            <h2 className="text-2xl font-bold font-display text-foreground">Settings</h2>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Commit Rules Section */}
            <AccordionSection
              title="Commit Rules"
              isOpen={openPanel === 'rules'}
              onToggle={() => togglePanel('rules')}
            >
              <div className="flex items-center justify-between">
                <label htmlFor="max-length" className="text-foreground">
                  Max subject length
                </label>
                <input
                  type="number"
                  id="max-length"
                  name="max-length"
                  className="w-20 bg-secondary border border-border rounded-md text-center text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  defaultValue={commitRules.maxSubjectLength}
                  aria-label="Maximum subject length"
                />
              </div>

              <ToggleSwitch
                id="require-type-scope"
                checked={commitRules.requireTypeScope}
                label="Require type/scope (e.g., feat(api): ...)"
              />

              <ToggleSwitch
                id="subject-sentence-case"
                checked={commitRules.subjectSentenceCase}
                label="Subject must be sentence case"
              />

              <ToggleSwitch
                id="require-blank-line"
                checked={commitRules.requireBlankLineBeforeBody}
                label="Require blank line before body"
              />

              <div className="flex items-center justify-between">
                <label htmlFor="allowed-types" className="text-foreground">
                  Allowed commit types
                </label>
                <select
                  id="allowed-types"
                  name="allowed-types"
                  className="w-1/2 bg-secondary border border-border rounded-md text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  defaultValue={commitRules.allowedCommitTypes}
                  aria-label="Select allowed commit types"
                >
                  <option>feat, fix, docs, style, refactor, test, chore</option>
                  <option>Conventional Commits v1.0.0</option>
                  <option>Custom</option>
                </select>
              </div>
            </AccordionSection>

            {/* Auto-Fix Behavior Section */}
            <AccordionSection
              title="Auto-Fix Behavior"
              isOpen={openPanel === 'autofix'}
              onToggle={() => togglePanel('autofix')}
            >
              <ToggleSwitch
                id="enable-autofix"
                checked={autoFix.enableAutoFixSuggestions}
                label="Enable auto-fix suggestions"
              />

              <ToggleSwitch
                id="auto-apply-fixes"
                checked={autoFix.autoApplyFixesOnCommit}
                label="Automatically apply fixes on commit"
              />

              <div className="flex items-center justify-between">
                <label htmlFor="preferred-style" className="text-foreground">
                  Preferred style
                </label>
                <select
                  id="preferred-style"
                  name="preferred-style"
                  className="w-1/2 bg-secondary border border-border rounded-md text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  defaultValue={autoFix.preferredStyle}
                  aria-label="Select preferred commit style"
                >
                  <option>Conventional Commits</option>
                  <option>Angular</option>
                  <option>Atom</option>
                </select>
              </div>
            </AccordionSection>

            {/* Integrations Section */}
            <AccordionSection
              title="Integrations"
              isOpen={openPanel === 'integrations'}
              onToggle={() => togglePanel('integrations')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-foreground">Git Hooks (pre-commit)</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                    <span className="w-2 h-2 bg-success rounded-full"></span>
                    {integrations.gitHooksStatus === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <label
                  htmlFor="git-hooks"
                  className="relative inline-flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="git-hooks"
                    className="sr-only peer"
                    defaultChecked={integrations.gitHooksEnabled}
                    aria-label="Toggle git hooks integration"
                  />
                  <div className="w-11 h-6 bg-secondary rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring transition-colors peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:bg-primary-foreground"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-foreground">CI/CD Integration (e.g., GitHub Actions)</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                    <span className="w-2 h-2 bg-success rounded-full"></span>
                    {integrations.cicdStatus === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <label htmlFor="cicd" className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="cicd"
                    className="sr-only peer"
                    defaultChecked={integrations.cicdEnabled}
                    aria-label="Toggle CI/CD integration"
                  />
                  <div className="w-11 h-6 bg-secondary rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring transition-colors peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:bg-primary-foreground"></div>
                </label>
              </div>
            </AccordionSection>

            {/* Appearance Section */}
            <AccordionSection
              title="Appearance"
              isOpen={openPanel === 'appearance'}
              onToggle={() => togglePanel('appearance')}
            >
              <div className="flex items-center justify-between">
                <span className="text-foreground">Theme</span>
                <div className="flex items-center gap-2" role="group" aria-label="Theme selection">
                  <button
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      appearance.theme === 'light'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    )}
                    aria-pressed={appearance.theme === 'light'}
                  >
                    Light
                  </button>
                  <button
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      appearance.theme === 'dark'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    )}
                    aria-pressed={appearance.theme === 'dark'}
                  >
                    Dark
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="default-theme" className="text-foreground">
                  Default theme
                </label>
                <select
                  id="default-theme"
                  name="default-theme"
                  className="w-1/2 bg-secondary border border-border rounded-md text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  defaultValue={appearance.defaultTheme}
                  aria-label="Select default theme"
                >
                  <option>System</option>
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>
            </AccordionSection>

            {/* General Section */}
            <AccordionSection
              title="General"
              isOpen={openPanel === 'general'}
              onToggle={() => togglePanel('general')}
            >
              <div className="flex items-center justify-between">
                <span className="text-foreground">Reset all settings to their default values.</span>
                <button className="bg-secondary text-foreground font-medium py-2 px-4 rounded-md hover:bg-border transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  Reset to Default
                </button>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Version</span>
                <span className="font-mono">{general.version}</span>
              </div>
            </AccordionSection>
          </div>
        </main>
      </div>
    </div>
  );
}
