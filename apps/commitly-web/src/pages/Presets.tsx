// File: apps/commitly-web/src/pages/Presets.tsx

import { useState, useMemo } from 'react';
import { Home, Plus, Trash2, Download, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input, Label } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { usePresets } from '@/hooks/use-presets';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  // No longer need initialPresets as we use the hook
}

// Skeleton loader component for presets
function PresetSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-5 bg-secondary rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-secondary rounded w-2/3"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-secondary rounded"></div>
          <div className="h-4 bg-secondary rounded"></div>
          <div className="h-4 bg-secondary rounded w-5/6"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Presets(_props: Props): JSX.Element {
  const { user } = useAuth();
  const {
    presets,
    isLoading,
    addPreset,
    deletePreset,
    exportPresets,
    importPresets,
  } = usePresets();

  const [newPresetName, setNewPresetName] = useState<string>('');
  const [newPresetDescription, setNewPresetDescription] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleCreatePreset = () => {
    if (!newPresetName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Name required',
        description: 'Please enter a preset name',
      });
      return;
    }

    try {
      const newPreset = addPreset({
        name: newPresetName.trim(),
        description: newPresetDescription.trim(),
        config: {
          types: [
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
          ],
          requireScope: false,
          maxHeaderLength: 72,
          maxLineLength: 100,
          subjectCase: 'lower',
        },
      });

      setNewPresetName('');
      setNewPresetDescription('');
      setIsCreating(false);

      toast({
        title: 'Preset created',
        description: `"${newPreset.name}" has been saved successfully`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to create preset',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  };

  const handleDeletePreset = async (id: string) => {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;

    setIsDeleting(id);
    try {
      deletePreset(id);
      toast({
        title: 'Preset deleted',
        description: `"${preset.name}" has been removed`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete preset',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleExportPresets = () => {
    try {
      exportPresets();
      toast({
        title: 'Presets exported',
        description: 'Your presets have been downloaded successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Could not export presets',
      });
    }
  };

  const handleImportPresets = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsImporting(true);
      try {
        const count = await importPresets(file);
        toast({
          title: 'Presets imported',
          description: `Successfully imported ${count} preset${count !== 1 ? 's' : ''}`,
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Import failed',
          description: error instanceof Error ? error.message : 'Invalid preset file format',
        });
      } finally {
        setIsImporting(false);
      }
    };

    input.click();
  };

  const sortedPresets = useMemo(() => {
    return [...presets].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [presets]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="inline-flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>
            <div className="h-4 w-px bg-border" />
            <h2 className="text-xl font-bold font-display text-foreground">Presets</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleImportPresets}
              disabled={isImporting}
              aria-label="Import presets from file"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Import</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPresets}
              disabled={presets.length === 0}
              aria-label="Export presets to file"
            >
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreating(!isCreating)}
              aria-label={isCreating ? 'Cancel creating preset' : 'Create new preset'}
              aria-expanded={isCreating}
            >
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
                    <Label htmlFor="preset-name" className="required">
                      Preset Name
                    </Label>
                    <Input
                      id="preset-name"
                      value={newPresetName}
                      onChange={(e) => setNewPresetName(e.target.value)}
                      placeholder="My Custom Preset"
                      className="mt-2"
                      aria-required="true"
                      aria-describedby="preset-name-hint"
                    />
                    <span id="preset-name-hint" className="sr-only">
                      Enter a unique name for your preset
                    </span>
                  </div>
                  <div>
                    <Label htmlFor="preset-description">Description</Label>
                    <Input
                      id="preset-description"
                      value={newPresetDescription}
                      onChange={(e) => setNewPresetDescription(e.target.value)}
                      placeholder="Describe this preset..."
                      className="mt-2"
                      aria-describedby="preset-description-hint"
                    />
                    <span id="preset-description-hint" className="sr-only">
                      Optional: Describe what this preset is used for
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreating(false)}
                    aria-label="Cancel creating preset"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleCreatePreset}
                    aria-label="Create preset"
                  >
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
              {user && (
                <span className="text-xs text-muted-foreground" aria-label="User account info">
                  Saved to: {user.email}
                </span>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="status" aria-label="Loading presets">
                <PresetSkeleton />
                <PresetSkeleton />
                <PresetSkeleton />
                <PresetSkeleton />
                <span className="sr-only">Loading presets...</span>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && sortedPresets.length === 0 && (
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
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsCreating(true)}
                      aria-label="Create your first preset"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create Preset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Presets Grid */}
            {!isLoading && sortedPresets.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label="Presets list">
                {sortedPresets.map((preset) => (
                  <Card key={preset.id} role="listitem">
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
                          disabled={isDeleting === preset.id}
                          className="h-8 w-8 p-0"
                          aria-label={`Delete ${preset.name} preset`}
                        >
                          {isDeleting === preset.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                          )}
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
                          <span
                            className={cn(
                              'font-medium',
                              preset.config.requireScope ? 'text-success' : 'text-muted-foreground'
                            )}
                          >
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
