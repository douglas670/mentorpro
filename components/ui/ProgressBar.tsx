import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: 'accent' | 'success' | 'warning' | 'danger' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeMap = { sm: 'h-1', md: 'h-1.5', lg: 'h-2' };

export function ProgressBar({ value, max = 100, className, color = 'accent', size = 'md', showLabel }: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);

  let resolvedColor = color;
  if (color === 'auto') {
    if (pct >= 75) resolvedColor = 'success';
    else if (pct >= 40) resolvedColor = 'accent';
    else if (pct >= 15) resolvedColor = 'warning';
    else resolvedColor = 'danger';
  }

  const colorClass = {
    accent: 'bg-[var(--accent)]',
    success: 'bg-[var(--success)]',
    warning: 'bg-[var(--warning)]',
    danger: 'bg-[var(--danger)]',
  }[resolvedColor as 'accent' | 'success' | 'warning' | 'danger'];

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-[var(--surface-hover)] rounded-full overflow-hidden', sizeMap[size])}>
        <div className={cn('h-full transition-all duration-300', colorClass)} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && (
        <p className="text-xs text-[var(--text-muted)] mt-1">{Math.round(pct)}%</p>
      )}
    </div>
  );
}
