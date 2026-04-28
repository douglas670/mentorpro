'use client';

import * as React from 'react';
import { CheckCircle2, ExternalLink, Heart, MessageCircle, Image as ImageIcon, Users, Grid3x3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const InstagramGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
  </svg>
);

const PERFIL = {
  username: '@dmoraessoares',
  nome: 'Douglas Moraes',
  bio: 'Mentor de empresários · Estratégia & operações · LDX Capital',
  posts: 142,
  seguidores: 8420,
  seguindo: 312,
  conectado: true,
};

const POSTS_MOCK = [
  { id: 1, gradient: 'from-purple-500 to-pink-500', likes: 234, comments: 18 },
  { id: 2, gradient: 'from-orange-400 to-rose-500', likes: 187, comments: 12 },
  { id: 3, gradient: 'from-cyan-400 to-blue-600', likes: 421, comments: 34 },
  { id: 4, gradient: 'from-emerald-400 to-teal-600', likes: 312, comments: 22 },
  { id: 5, gradient: 'from-fuchsia-500 to-violet-600', likes: 567, comments: 41 },
  { id: 6, gradient: 'from-amber-400 to-orange-600', likes: 289, comments: 19 },
  { id: 7, gradient: 'from-pink-400 to-rose-600', likes: 198, comments: 15 },
  { id: 8, gradient: 'from-indigo-500 to-purple-700', likes: 345, comments: 27 },
  { id: 9, gradient: 'from-green-400 to-emerald-600', likes: 412, comments: 31 },
];

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')}k`;
  return n.toString();
}

export default function InstagramPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center">
              <InstagramGlyph className="w-5 h-5 text-white" />
            </span>
            Instagram
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Conecte sua conta para acompanhar engajamento
          </p>
        </div>
      </div>

      {PERFIL.conectado ? (
        <>
          {/* Card status conectado */}
          <Card className="mb-6 border-[var(--success)]/20 bg-gradient-to-br from-[var(--success-soft)] to-transparent">
            <CardContent className="flex items-center gap-3">
              <div className="w-9 h-9 shrink-0 rounded-lg bg-[var(--success-soft)] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)]" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Instagram conectado
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Última sincronização há 12 minutos
                </p>
              </div>
              <Button variant="secondary" size="sm">
                Desconectar
              </Button>
            </CardContent>
          </Card>

          {/* Perfil */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-0.5">
                    <div className="w-full h-full rounded-full bg-[var(--bg)]" />
                  </div>
                  <Avatar nome={PERFIL.nome} size="xl" className="relative" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold tracking-tight">{PERFIL.username}</h2>
                    <Badge variant="success" size="sm">
                      <CheckCircle2 className="w-2.5 h-2.5" strokeWidth={2.5} />
                      Conta business
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--text-primary)] font-medium">{PERFIL.nome}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{PERFIL.bio}</p>
                  <a
                    href="https://instagram.com/dmoraessoares"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline mt-2"
                  >
                    Ver no Instagram
                    <ExternalLink className="w-3 h-3" strokeWidth={2} />
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-[var(--border-soft)]">
                <Stat icon={ImageIcon} label="Posts" value={formatNum(PERFIL.posts)} />
                <Stat icon={Users} label="Seguidores" value={formatNum(PERFIL.seguidores)} />
                <Stat icon={Users} label="Seguindo" value={formatNum(PERFIL.seguindo)} />
              </div>
            </CardContent>
          </Card>

          {/* Posts recentes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold tracking-tight flex items-center gap-2">
                <Grid3x3 className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={2} />
                Posts recentes
              </h2>
              <span className="text-xs text-[var(--text-muted)]">{POSTS_MOCK.length} posts</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {POSTS_MOCK.map(p => (
                <button
                  key={p.id}
                  className={cn(
                    'aspect-square rounded-lg bg-gradient-to-br relative overflow-hidden group',
                    p.gradient
                  )}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 text-white opacity-0 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold">
                      <Heart className="w-4 h-4 fill-current" strokeWidth={2} />
                      {p.likes}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold">
                      <MessageCircle className="w-4 h-4 fill-current" strokeWidth={2} />
                      {p.comments}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center mb-4">
              <InstagramGlyph className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-1">Conecte sua conta business</h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-5">
              Acompanhe seus posts, seguidores e engajamento direto dentro do Mentor Pro.
            </p>
            <Button>
              <InstagramGlyph className="w-4 h-4" />
              Conectar Instagram
            </Button>
            <p className="text-[10px] text-[var(--text-muted)] mt-4">
              Funciona com contas Business ou Creator
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center">
      <Icon className="w-4 h-4 text-[var(--text-muted)] mx-auto mb-1" strokeWidth={2} />
      <p className="text-xl font-bold tracking-tight tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
    </div>
  );
}
