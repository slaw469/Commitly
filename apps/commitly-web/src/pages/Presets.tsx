// File: apps/commitly-web/src/pages/Presets.tsx

import { useState, useMemo, useCallback } from 'react';
import { Home, Plus, Trash2, Download, Upload, CheckCircle2 } from 'lucide-react';
import type { Config } from '@commitly/core';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input, Label } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface Preset {
  id: string;
  name: string;
  description: string;
  config: Partial<Config>;
  createdAt: string;
}

interface Props {
  initialPresets?: Preset[];
}

const STORAGE_KEY = 'commitly-presets';

const defaultPresets: Preset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard Conventional Commits configuration',
    config: {
      types: ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'],
      requireScope: false,
      maxHeaderLength: 72,
      maxLineLength: 100,
      subjectCase: 'lower',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'strict',
    name: 'Strict',
    description: 'Stricter rules with required scopes',
    config: {
      types: ['feat', 'fix', 'docs', 'refactor', 'test', 'chore'],
      requireScope: true,
      maxHeaderLength: 50,
      maxLineLength: 72,
      subjectCase: 'lower',
      blockedWords: ['wip', 'todo', 'fixme'],
    },
    createdAt: new Date().toISOString(),
  },
];

function loadPresets(): Preset[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load presets:', error);
  }
  return defaultPresets;
}

function savePresetsToStorage(presets: Preset[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error('Failed to save presets:', error);
    toast({
      variant: 'destructive',
      title: 'Failed to save',
      description: 'Could not save presets to localStorage',
    });
  }
}

export default function Presets({ initialPresets }: Props): JSX.Element {
  const [presets, setPresets] = useState<Preset[]>(() => initialPresets ?? loadPresets());
  const [newPresetName, setNewPresetName] = useState<string>('');
  const [newPresetDescription, setNewPresetDescription] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleCreatePreset = useCallback(() => {
    if (!newPresetName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Name required',
        description: 'Please enter a preset name',
      });
      return;
    }

    const newPreset: Preset = {
      id: `preset-${Date.now()}`,
      name: newPresetName.trim(),
      description: newPresetDescription.trim(),
      config: {
        ...defaultPresets[0].config,
      },
      createdAt: new Date().toISOString(),
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    savePresetsToStorage(updated);

    setNewPresetName('');
    setNewPresetDescription('');
    setIsCreating(false);

    toast({
      variant: 'success',
      title: 'Preset created',
      description: `"${newPreset.name}" has been saved`,
    });
  }, [newPresetName, newPresetDescription, presets]);

  const handleDeletePreset = useCallback((id: string) => {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;
    
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    savePresetsToStorage(updated);

    toast({
      variant: 'default',
      title: 'Preset deleted',
      description: `"${preset.name}" has been removed`,
    });
  }, [presets]);

  const handleExportPresets = useCallback(() => {
    try {
      const dataStr = JSON.stringify(presets, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `commitly-presets-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        variant: 'success',
        title: 'Presets exported',
        description: 'Your presets have been downloaded',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Export failed',
        description: 'Could not export presets',
      });
    }
  }, [presets]);

  const handleImportPresets = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string) as Preset[];
          const updated = [...presets, ...imported];
          setPresets(updated);
          savePresetsToStorage(updated);

          toast({
            variant: 'success',
            title: 'Presets imported',
            description: `${imported.length} preset(s) added`,
          });
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Import failed',
            description: 'Invalid preset file format',
          });
        }
      };
      reader.readAsText(file);
    };

    input.click();
  }, [presets]);

  const sortedPresets = useMemo(() => {
    return [...presets].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [presets]);

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
            <h2 className="text-xl font-bold font-display text-foreground">Presets</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleImportPresets}>
              <Upload className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPresets} disabled={presets.length === 0}>
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsCreating(!isCreating)}>
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">New Preset</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Create New Preset */}
          {isCreating && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Preset</CardTitle>
                <CardDescription>Define a custom configuration preset</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="preset-name" required>Preset Name</Label>
                    <Input
                      id="preset-name"
                      value={newPresetName}
                      onChange={(e) => setNewPresetName(e.target.value)}
                      placeholder="My Custom Preset"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preset-description">Description</Label>
                    <Input
                      id="preset-description"
                      value={newPresetDescription}
                      onChange={(e) => setNewPresetDescription(e.target.value)}
                      placeholder="Describe this preset..."
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 ml-auto">
                  <Button variant="outline" size="sm" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleCreatePreset}>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Create Preset
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}

          {/* Presets List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Saved Presets ({presets.length})
              </h3>
            </div>

            {sortedPresets.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">No Presets Yet</h3>
                    <p className="text-muted-foreground text-sm max-w-md mb-4">
                      Create your first preset or import existing ones
                    </p>
                    <Button variant="primary" size="sm" onClick={() => setIsCreating(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Create Preset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedPresets.map((preset) => (
                  <Card key={preset.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{preset.name}</CardTitle>
                          {preset.description && (
                            <CardDescription>{preset.description}</CardDescription>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePreset(preset.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Types</span>
                          <span className="font-medium text-foreground">
                            {preset.config.types?.length ?? 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Max Header</span>
                          <span className="font-medium text-foreground">
                            {preset.config.maxHeaderLength ?? 72} chars
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Require Scope</span>
                          <span className={cn(
                            'font-medium',
                            preset.config.requireScope ? 'text-success' : 'text-muted-foreground'
                          )}>
                            {preset.config.requireScope ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-border/50">
                          <span className="text-xs text-muted-foreground">
                            Created {new Date(preset.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

