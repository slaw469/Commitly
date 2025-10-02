// File: apps/commitly-web/src/components/theme-toggle.tsx

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps): JSX.Element {
  const isDark = true; // Always dark mode by default

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('h-9 w-9 p-0', className)}
      aria-label="Toggle theme"
      title="Theme (Dark Mode)"
      disabled
    >
      <Moon className="h-4 w-4 text-primary" />
    </Button>
  );
}

