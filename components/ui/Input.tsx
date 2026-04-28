import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, icon: Icon, error, hint, id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.8} />
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full rounded-lg border border-[var(--border-app)] bg-[var(--bg)] text-[var(--text-primary)] text-sm transition-colors',
              'px-3 py-2 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]',
              'disabled:cursor-not-allowed disabled:opacity-50',
              Icon && 'pl-9',
              error && 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger-soft)]',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[var(--danger)] mt-1">{error}</p>}
        {hint && !error && <p className="text-xs text-[var(--text-muted)] mt-1">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
