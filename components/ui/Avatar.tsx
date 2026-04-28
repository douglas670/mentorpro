import * as React from 'react';
import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  nome: string;
  src?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'busy';
}

const sizeMap = {
  xs: { w: 'w-6 h-6', text: 'text-[10px]' },
  sm: { w: 'w-8 h-8', text: 'text-xs' },
  md: { w: 'w-10 h-10', text: 'text-sm' },
  lg: { w: 'w-14 h-14', text: 'text-lg' },
  xl: { w: 'w-20 h-20', text: 'text-2xl' },
};

const statusColor = {
  online: 'bg-[var(--success)]',
  offline: 'bg-[var(--text-muted)]',
  busy: 'bg-[var(--danger)]',
};

export function Avatar({ nome, src, size = 'md', className, showStatus, status = 'offline' }: AvatarProps) {
  const dim = sizeMap[size];
  const dot = size === 'xs' ? 'w-1.5 h-1.5' : size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-2.5 h-2.5' : 'w-3 h-3';

  return (
    <div className={cn('relative shrink-0', className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={nome} className={cn('rounded-full object-cover', dim.w)} />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold text-white',
            'bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)]',
            dim.w,
            dim.text
          )}
        >
          {getInitials(nome)}
        </div>
      )}
      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-[var(--surface)]',
            dot,
            statusColor[status]
          )}
        />
      )}
    </div>
  );
}
