import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md font-medium border whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-[var(--surface-hover)] text-[var(--text-secondary)] border-[var(--border-app)]',
        accent: 'bg-[var(--accent-soft)] text-[var(--accent)] border-transparent',
        success: 'bg-[var(--success-soft)] text-[var(--success)] border-transparent',
        warning: 'bg-[var(--warning-soft)] text-[var(--warning)] border-transparent',
        danger: 'bg-[var(--danger-soft)] text-[var(--danger)] border-transparent',
        outline: 'bg-transparent text-[var(--text-secondary)] border-[var(--border-app)]',
      },
      size: {
        sm: 'text-[10px] px-2 py-0.5',
        md: 'text-xs px-2.5 py-0.5',
        lg: 'text-sm px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
