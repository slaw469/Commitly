// File: apps/commitly-web/src/pages/Settings.tsx
// Fully functional Settings page with CRUD for rule presets

import { useState, useCallback } from 'react';
import { Check, ChevronDown, ChevronUp, Save, RotateCcw, Download, Upload, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSettings, DEFAULT_SETTINGS } from '@/hooks/use-settings';
import { usePresets } from '@/hooks/use-presets';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Config } from '@commitly/core';

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
  onChange: (checked: boolean) => void;
  label: string;
  ariaLabel?: string;
}

function ToggleSwitch({ id, checked, label, ariaLabel, onChange }: ToggleSwitchProps): JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <span className="text-foreground">{label}</span>
      <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          id={id}
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-label={ariaLabel || label}
        />
        <div className="w-11 h-6 bg-secondary rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring transition-colors peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:bg-primary-foreground"></div>
      </label>
    </div>
  );
}

export default function Settings(): JSX.Element {
  const { user } = useAuth();
  const { settings, updateSetting, updateSettings, resetToDefaults, exportSettings, importSettings } = useSettings();
  const { presets, addPreset, getPresetById } = usePresets();
  
  const [openPanel, setOpenPanel] = useState<string>('rules');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [customTypes, setCustomTypes] = useState<string>(settings.types.join(', '));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const togglePanel = (panel: string) => {
    setOpenPanel(openPanel === panel ? '' : panel);
  };

  // Mark as having unsaved changes when settings are modified
  const handleSettingChange = useCallback(<K extends keyof typeof settings>(
    key: K,
    value: typeof settings[K]
  ) => {
    updateSetting(key, value);
    setHasUnsavedChanges(true);
  }, [updateSetting]);

  // Handle custom types input change
  const handleTypesChange = useCallback((value: string) => {
    setCustomTypes(value);
    const typesArray = value.split(',').map(t => t.trim()).filter(t => t.length > 0);
    handleSettingChange('types', typesArray);
  }, [handleSettingChange]);

  // Apply preset to current settings
  const handleApplyPreset = useCallback((presetId: string) => {
    const preset = getPresetById(presetId);
    if (!preset) {
      toast({
        variant: 'destructive',
        title: 'Preset not found',
        description: 'Could not load the selected preset',
      });
      return;
    }

    // Merge preset config with current settings
    updateSettings({
      ...settings,
      ...preset.config,
    });

    // Update custom types display
    if (preset.config.types) {
      setCustomTypes(preset.config.types.join(', '));
    }

    setSelectedPresetId(presetId);
    setHasUnsavedChanges(true);

    toast({
      title: 'Preset applied',
      description: `"${preset.name}" has been applied to your settings`,
    });
  }, [getPresetById, updateSettings, settings]);

  // Save current settings as a new preset
  const handleSaveAsPreset = useCallback(() => {
    const presetName = prompt('Enter a name for this preset:');
    if (!presetName?.trim()) return;

    const config: Partial<Config> = {
      types: settings.types,
      requireScope: settings.requireScope,
      maxHeaderLength: settings.maxHeaderLength,
      maxLineLength: settings.maxLineLength,
      subjectCase: settings.subjectCase,
      subjectEmptyForbidden: settings.subjectEmptyForbidden,
      subjectFullStopForbidden: settings.subjectFullStopForbidden,
      bodyLeadingBlank: settings.bodyLeadingBlank,
      footerLeadingBlank: settings.footerLeadingBlank,
      blockedWords: settings.blockedWords,
    };

    addPreset({
      name: presetName.trim(),
      description: 'Custom preset created from settings',
      config,
    });

    toast({
      title: 'Preset saved',
      description: `"${presetName}" has been saved`,
    });
  }, [settings, addPreset]);

  // Reset settings to defaults
  const handleReset = useCallback(() => {
    if (!confirm('Are you sure you want to reset all settings to defaults?')) {
      return;
    }

    resetToDefaults();
    setCustomTypes(DEFAULT_SETTINGS.types.join(', '));
    setSelectedPresetId('');
    setHasUnsavedChanges(false);

    toast({
      title: 'Settings reset',
      description: 'All settings have been reset to defaults',
    });
  }, [resetToDefaults]);

  // Export settings
  const handleExport = useCallback(() => {
    try {
      exportSettings();
      toast({
        title: 'Settings exported',
        description: 'Your settings have been downloaded',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Export failed',
        description: 'Could not export settings',
      });
    }
  }, [exportSettings]);

  // Import settings
  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        await importSettings(file);
        setCustomTypes(settings.types.join(', '));
        setHasUnsavedChanges(false);

        toast({
          title: 'Settings imported',
          description: 'Your settings have been updated',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Import failed',
          description: error instanceof Error ? error.message : 'Could not import settings',
        });
      }
    };

    input.click();
  }, [importSettings, settings]);

  // Save changes notification
  const handleSaveChanges = useCallback(() => {
    setHasUnsavedChanges(false);
    toast({
      title: 'Settings saved',
      description: 'Your changes have been saved',
    });
  }, []);

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
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </Link>

          <Link
            to="/add-project"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Project
          </Link>

          <Link
            to="/reports"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Reports
          </Link>

          <Link
            to="/formatter"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
              />
            </svg>
            Formatter
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium bg-secondary text-foreground transition-colors"
            aria-current="page"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
          </Link>

          <Link
            to="/docs"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Docs
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold font-display text-foreground">Settings</h2>
            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <span className="text-sm text-muted-foreground mr-2">Unsaved changes</span>
              )}
              <Button variant="outline" size="sm" onClick={handleImport}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {hasUnsavedChanges && (
                <Button variant="primary" size="sm" onClick={handleSaveChanges}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Preset Selection */}
            <div className="bg-card/50 rounded-lg border border-border/50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label htmlFor="preset-select" className="block text-sm font-medium text-foreground mb-2">
                    Apply Preset
                  </label>
                  <select
                    id="preset-select"
                    value={selectedPresetId}
                    onChange={(e) => handleApplyPreset(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-md text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  >
                    <option value="">-- Select a preset --</option>
                    {presets.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.name} - {preset.description}
                      </option>
                    ))}
                  </select>
                </div>
                <Button variant="outline" size="sm" onClick={handleSaveAsPreset} className="mt-6">
                  <Plus className="h-4 w-4 mr-2" />
                  Save as Preset
                </Button>
              </div>
            </div>

            {/* Commit Rules Section */}
            <AccordionSection
              title="Commit Rules"
              isOpen={openPanel === 'rules'}
              onToggle={() => togglePanel('rules')}
            >
              <div className="flex items-center justify-between">
                <label htmlFor="max-header-length" className="text-foreground">
                  Max header length
                </label>
                <input
                  type="number"
                  id="max-header-length"
                  value={settings.maxHeaderLength}
                  onChange={(e) => handleSettingChange('maxHeaderLength', parseInt(e.target.value) || 72)}
                  min={30}
                  max={200}
                  className="w-20 bg-secondary border border-border rounded-md text-center text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  aria-label="Maximum header length"
                />
              </div>

              <ToggleSwitch
                id="require-scope"
                checked={settings.requireScope}
                onChange={(checked) => handleSettingChange('requireScope', checked)}
                label="Require scope (e.g., feat(api): ...)"
              />

              <div className="flex items-center justify-between">
                <label htmlFor="subject-case" className="text-foreground">
                  Subject case
                </label>
                <select
                  id="subject-case"
                  value={settings.subjectCase}
                  onChange={(e) => handleSettingChange('subjectCase', e.target.value as 'lower' | 'sentence' | 'any')}
                  className="w-1/2 bg-secondary border border-border rounded-md text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                >
                  <option value="lower">Lowercase</option>
                  <option value="sentence">Sentence case</option>
                  <option value="any">Any case</option>
                </select>
              </div>

              <ToggleSwitch
                id="blank-line-before-body"
                checked={settings.bodyLeadingBlank}
                onChange={(checked) => handleSettingChange('bodyLeadingBlank', checked)}
                label="Require blank line before body"
              />

              <div className="space-y-2">
                <label htmlFor="allowed-types" className="text-foreground block">
                  Allowed commit types (comma-separated)
                </label>
                <input
                  type="text"
                  id="allowed-types"
                  value={customTypes}
                  onChange={(e) => handleTypesChange(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-md text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  placeholder="feat, fix, docs, style, refactor, test, chore"
                />
              </div>

              <ToggleSwitch
                id="subject-full-stop-forbidden"
                checked={settings.subjectFullStopForbidden}
                onChange={(checked) => handleSettingChange('subjectFullStopForbidden', checked)}
                label="Forbid trailing period in subject"
              />
            </AccordionSection>

            {/* Auto-Fix Behavior Section */}
            <AccordionSection
              title="Auto-Fix Behavior"
              isOpen={openPanel === 'autofix'}
              onToggle={() => togglePanel('autofix')}
            >
              <ToggleSwitch
                id="enable-autofix"
                checked={settings.enableAutoFixSuggestions}
                onChange={(checked) => handleSettingChange('enableAutoFixSuggestions', checked)}
                label="Enable auto-fix suggestions"
              />

              <ToggleSwitch
                id="auto-apply-fixes"
                checked={settings.autoApplyFixesOnCommit}
                onChange={(checked) => handleSettingChange('autoApplyFixesOnCommit', checked)}
                label="Automatically apply fixes on commit"
              />

              <div className="flex items-center justify-between">
                <label htmlFor="preferred-style" className="text-foreground">
                  Preferred style
                </label>
                <select
                  id="preferred-style"
                  value={settings.preferredStyle}
                  onChange={(e) => handleSettingChange('preferredStyle', e.target.value as 'conventional' | 'angular' | 'gitmoji')}
                  className="w-1/2 bg-secondary border border-border rounded-md text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                >
                  <option value="conventional">Conventional Commits</option>
                  <option value="angular">Angular</option>
                  <option value="gitmoji">Gitmoji</option>
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
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
                    settings.gitHooksEnabled ? "bg-success/10 text-success" : "bg-muted/10 text-muted-foreground"
                  )}>
                    <span className={cn("w-2 h-2 rounded-full", settings.gitHooksEnabled ? "bg-success" : "bg-muted-foreground")}></span>
                    {settings.gitHooksEnabled ? 'Active' : 'Inactive'}
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
                    checked={settings.gitHooksEnabled}
                    onChange={(e) => handleSettingChange('gitHooksEnabled', e.target.checked)}
                    aria-label="Toggle git hooks integration"
                  />
                  <div className="w-11 h-6 bg-secondary rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring transition-colors peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:bg-primary-foreground"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-foreground">CI/CD Integration (e.g., GitHub Actions)</span>
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
                    settings.cicdEnabled ? "bg-success/10 text-success" : "bg-muted/10 text-muted-foreground"
                  )}>
                    <span className={cn("w-2 h-2 rounded-full", settings.cicdEnabled ? "bg-success" : "bg-muted-foreground")}></span>
                    {settings.cicdEnabled ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <label htmlFor="cicd" className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="cicd"
                    className="sr-only peer"
                    checked={settings.cicdEnabled}
                    onChange={(e) => handleSettingChange('cicdEnabled', e.target.checked)}
                    aria-label="Toggle CI/CD integration"
                  />
                  <div className="w-11 h-6 bg-secondary rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring transition-colors peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:bg-primary-foreground"></div>
                </label>
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
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Version</span>
                <span className="font-mono">v1.0.0</span>
              </div>

              {user && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Signed in as</span>
                  <span className="font-medium text-foreground">{user.email}</span>
                </div>
              )}
            </AccordionSection>
          </div>
        </main>
      </div>
    </div>
  );
}
