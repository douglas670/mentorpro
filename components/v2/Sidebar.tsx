'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Target,
  BookOpen,
  BarChart3,
  Settings,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> };

const NAV: Item[] = [
  { href: '/v2', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/v2/mentorados', label: 'Mentorados', icon: Users },
  { href: '/v2/calendario', label: 'Calendário', icon: Calendar },
  { href: '/v2/mensagens', label: 'Mensagens', icon: MessageSquare },
  { href: '/v2/metas', label: 'Metas', icon: Target },
  { href: '/v2/biblioteca', label: 'Biblioteca', icon: BookOpen },
  { href: '/v2/relatorios', label: 'Relatórios', icon: BarChart3 },
];

const InstagramGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
  </svg>
);

const NAV_FOOTER: Item[] = [
  { href: '/v2/instagram', label: 'Instagram', icon: InstagramGlyph as Item['icon'] },
  { href: '/v2/configuracoes', label: 'Configurações', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  const isActive = (href: string) => {
    if (href === '/v2') return pathname === '/v2';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-[var(--bg)] border-b border-[var(--border-app)]">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" strokeWidth={2} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2.2} />
          </div>
          <span className="font-semibold tracking-tight">Mentor Pro</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[var(--surface)] border-r border-[var(--border-app)] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-soft)]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" strokeWidth={2.2} />
                </div>
                <span className="font-semibold tracking-tight">Mentor Pro</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarBody isActive={isActive} />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:bottom-0 md:w-64 bg-[var(--surface)] border-r border-[var(--border-app)] z-20">
        <div className="flex items-center justify-between gap-2 p-5 border-b border-[var(--border-soft)]">
          <Link href="/v2" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <p className="font-semibold tracking-tight leading-tight">Mentor Pro</p>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">v2.0 Preview</p>
            </div>
          </Link>
          <ThemeToggle />
        </div>
        <SidebarBody isActive={isActive} />
      </aside>
    </>
  );
}

function SidebarBody({ isActive }: { isActive: (href: string) => boolean }) {
  return (
    <>
      <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-0.5">
        {NAV.map(item => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
        <div className="my-3 border-t border-[var(--border-soft)]" />
        {NAV_FOOTER.map(item => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </nav>
      <UserCard />
    </>
  );
}

function NavLink({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        active
          ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
          : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
      )}
    >
      <Icon className="w-4 h-4 shrink-0" strokeWidth={1.8} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function UserCard() {
  return (
    <div className="p-3 border-t border-[var(--border-soft)]">
      <Link
        href="/v2/configuracoes"
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors group"
      >
        <Avatar nome="Douglas Moraes" size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate">Douglas Moraes</p>
          <p className="text-xs text-[var(--text-muted)] truncate">douglas@ldxcapital.com.br</p>
        </div>
      </Link>
    </div>
  );
}
