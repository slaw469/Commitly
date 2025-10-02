// File: apps/commitly-web/src/components/ui/button.tsx

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, asChild, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button';
    return (
      <Comp
        ref={ref as any}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-secondary text-foreground hover:bg-border': variant === 'default',
            'bg-primary text-primary-foreground hover:opacity-90 font-bold': variant === 'primary',
            'bg-destructive text-destructive-foreground hover:opacity-90': variant === 'destructive',
            'border border-border bg-transparent hover:bg-secondary': variant === 'outline',
            'hover:bg-secondary hover:text-foreground': variant === 'ghost',
          },
          {
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          className
        )}
        {...(asChild ? {} : props)}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
