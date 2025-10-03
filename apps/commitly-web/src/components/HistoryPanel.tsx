// File: apps/commitly-web/src/components/HistoryPanel.tsx

import { History, Trash2, CheckCircle2, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { HistoryItem } from '@/hooks/use-validation-history';
import { toast } from '@/hooks/use-toast';

interface HistoryPanelProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
  onLoadMessage: (message: string) => void;
  isLoading?: boolean;
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return then.toLocaleDateString();
}

// Skeleton loader for history items
function HistoryItemSkeleton() {
  return (
    <div className="p-3 rounded-md border border-border/30 bg-secondary/20 animate-pulse">
      <div className="flex items-start gap-2">
        <div className="w-4 h-4 bg-secondary rounded-full mt-0.5"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-secondary rounded w-3/4"></div>
          <div className="h-3 bg-secondary rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

export function HistoryPanel({
  history,
  onClearHistory,
  onRemoveItem,
  onLoadMessage,
  isLoading = false,
}: HistoryPanelProps): JSX.Element {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState<boolean>(false);

  const handleClearHistory = async () => {
    setIsClearing(true);
    try {
      onClearHistory();
      toast({
        title: 'History cleared',
        description: 'All validation history has been removed',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to clear history',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleRemoveItem = async (id: string) => {
    setDeletingId(id);
    try {
      onRemoveItem(id);
      toast({
        title: 'Item removed',
        description: 'Validation history item removed',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to remove item',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleLoadMessage = (message: string) => {
    try {
      onLoadMessage(message);
      toast({
        title: 'Message loaded',
        description: 'Loaded from validation history',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to load message',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Validation History</CardTitle>
          </div>
          <CardDescription>Loading your recent validations...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2" role="status" aria-label="Loading validation history">
            <HistoryItemSkeleton />
            <HistoryItemSkeleton />
            <HistoryItemSkeleton />
            <span className="sr-only">Loading validation history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Validation History</CardTitle>
          </div>
          <CardDescription>Your recent validations will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground opacity-50 mb-3" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">No validation history yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Validate a commit message to see it here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" aria-hidden="true" />
            <CardTitle className="text-base">Validation History</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearHistory}
            disabled={isClearing}
            className="h-8 px-2 text-xs"
            aria-label="Clear all validation history"
          >
            {isClearing ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Clearing...
              </>
            ) : (
              'Clear All'
            )}
          </Button>
        </div>
        <CardDescription>
          {history.length} recent validation{history.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="space-y-2 max-h-96 overflow-y-auto"
          role="list"
          aria-label="Validation history items"
        >
          {history.map((item) => (
            <div
              key={item.id}
              role="listitem"
              className={cn(
                'group relative p-3 rounded-md border cursor-pointer transition-colors',
                'hover:bg-secondary/50 focus-within:ring-2 focus-within:ring-ring',
                item.valid
                  ? 'border-success/30 bg-success/5'
                  : 'border-destructive/30 bg-destructive/5'
              )}
              onClick={() => handleLoadMessage(item.message)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleLoadMessage(item.message);
                }
              }}
              tabIndex={0}
              aria-label={`Load validation from ${formatTimeAgo(item.timestamp)}: ${item.message.split('\n')[0]}`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
                  {item.valid ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono text-foreground truncate">
                    {item.message.split('\n')[0]}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(item.timestamp)}
                    </span>
                    {item.errorCount > 0 && (
                      <span className="text-xs text-destructive" aria-label={`${item.errorCount} errors`}>
                        {item.errorCount} error{item.errorCount > 1 ? 's' : ''}
                      </span>
                    )}
                    {item.warningCount > 0 && (
                      <span className="text-xs text-warning" aria-label={`${item.warningCount} warnings`}>
                        {item.warningCount} warning{item.warningCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(item.id);
                  }}
                  disabled={deletingId === item.id}
                  aria-label={`Remove validation from ${formatTimeAgo(item.timestamp)}`}
                >
                  {deletingId === item.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
