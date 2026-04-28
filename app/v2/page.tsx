'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Users,
  Calendar,
  Target,
  TrendingUp,
  CheckCircle2,
  MessageSquare,
  Star,
  UserPlus,
  Quote,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn, relativeDate, formatTime } from '@/lib/utils';
import {
  MENTORADOS,
  REUNIOES,
  METAS,
  ATIVIDADES,
  fraseDoDia,
  type TipoAtividade,
} from '@/lib/mocks-v2';

const ATIVIDADE_ICON: Record<TipoAtividade, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  reuniao: Calendar,
  meta_concluida: CheckCircle2,
  feedback: Star,
  mensagem: MessageSquare,
  mentorado_novo: UserPlus,
};

const ATIVIDADE_COLOR: Record<TipoAtividade, string> = {
  reuniao: 'text-[var(--accent)] bg-[var(--accent-soft)]',
  meta_concluida: 'text-[var(--success)] bg-[var(--success-soft)]',
  feedback: 'text-[var(--warning)] bg-[var(--warning-soft)]',
  mensagem: 'text-[var(--accent)] bg-[var(--accent-soft)]',
  mentorado_novo: 'text-[var(--success)] bg-[var(--success-soft)]',
};

export default function DashboardPage() {
  const ativos = MENTORADOS.filter(m => m.statusMentoria === 'ativo').length;
  const reunioesAgendadas = REUNIOES.filter(r => r.status === 'agendada').length;
  const metasEmProgresso = METAS.filter(m => m.status === 'em-progresso').length;
  const totalMetas = METAS.length;
  const concluidas = METAS.filter(m => m.status === 'concluida').length;
  const taxaConclusao = totalMetas ? Math.round((concluidas / totalMetas) * 100) : 0;

  const proximasReunioes = REUNIOES
    .filter(r => r.status === 'agendada')
    .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
    .slice(0, 4);

  const atividadesRecentes = [...ATIVIDADES]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 6);

  const destaques = MENTORADOS
    .filter(m => m.statusMentoria === 'ativo')
    .sort((a, b) => b.progresso - a.progresso)
    .slice(0, 3);

  const mentoradoById = (id: string) => MENTORADOS.find(m => m.id === id);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-7xl mx-auto">
      {/* Saudação */}
      <div className="mb-8">
        <p className="text-sm text-[var(--text-muted)] mb-1">Bem-vindo de volta,</p>
        <h1 className="text-3xl font-bold tracking-tight">Douglas 👋</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Aqui está o resumo do seu dia.
        </p>
      </div>

      {/* Frase motivacional */}
      <Card className="mb-6 border-[var(--accent)]/20 bg-gradient-to-br from-[var(--accent-soft)] to-transparent">
        <CardContent className="flex items-start gap-3">
          <div className="w-9 h-9 shrink-0 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center">
            <Quote className="w-4 h-4 text-[var(--accent)]" strokeWidth={2} />
          </div>
          <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed pt-1.5">
            {fraseDoDia()}
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Mentorados ativos"
          value={ativos}
          hint={`${MENTORADOS.length} no total`}
          color="accent"
        />
        <StatCard
          icon={Calendar}
          label="Reuniões agendadas"
          value={reunioesAgendadas}
          hint="próximas"
          color="success"
        />
        <StatCard
          icon={Target}
          label="Metas em progresso"
          value={metasEmProgresso}
          hint={`${totalMetas} no total`}
          color="warning"
        />
        <StatCard
          icon={TrendingUp}
          label="Taxa de conclusão"
          value={`${taxaConclusao}%`}
          hint={`${concluidas} concluídas`}
          color="accent"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Próximas reuniões */}
        <div className="lg:col-span-2">
          <SectionHeader title="Próximas reuniões" href="/v2/calendario" />
          <Card>
            <CardContent className="p-0">
              {proximasReunioes.length === 0 ? (
                <div className="p-6 text-center text-sm text-[var(--text-muted)]">
                  Nenhuma reunião agendada.
                </div>
              ) : (
                <ul className="divide-y divide-[var(--border-soft)]">
                  {proximasReunioes.map(r => {
                    const m = mentoradoById(r.mentoradoId);
                    return (
                      <li key={r.id} className="flex items-center gap-3 p-4 hover:bg-[var(--surface-hover)] transition-colors">
                        {m && <Avatar nome={m.nome} size="md" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">{r.titulo}</p>
                          <p className="text-xs text-[var(--text-secondary)] truncate">
                            {m?.nome ?? 'Mentorado'} · {r.duracao}min
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {relativeDate(r.dataHora)}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {formatTime(r.dataHora)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Mentorados em destaque */}
          <div className="mt-6">
            <SectionHeader title="Mentorados em destaque" href="/v2/mentorados" />
            <div className="grid sm:grid-cols-3 gap-3">
              {destaques.map(m => (
                <Link
                  key={m.id}
                  href="/v2/mentorados"
                  className="block group"
                >
                  <Card className="h-full group-hover:border-[var(--accent)] transition-colors">
                    <CardContent>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar nome={m.nome} size="md" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold truncate">{m.nome}</p>
                          <p className="text-xs text-[var(--text-muted)] truncate">{m.especialidade}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                          Progresso
                        </span>
                        <span className="text-xs font-semibold">{m.progresso}%</span>
                      </div>
                      <ProgressBar value={m.progresso} color="auto" size="sm" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Atividade recente */}
        <div>
          <SectionHeader title="Atividade recente" />
          <Card>
            <CardContent className="p-5">
              <ul className="space-y-4">
                {atividadesRecentes.map(a => {
                  const Icon = ATIVIDADE_ICON[a.tipo];
                  const m = mentoradoById(a.mentoradoId);
                  return (
                    <li key={a.id} className="flex gap-3">
                      <div className={cn('w-8 h-8 shrink-0 rounded-lg flex items-center justify-center', ATIVIDADE_COLOR[a.tipo])}>
                        <Icon className="w-4 h-4" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-sm text-[var(--text-secondary)] leading-snug">
                          <span className="font-medium text-[var(--text-primary)]">{m?.nome ?? 'Alguém'}</span>{' '}
                          {a.descricao}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{relativeDate(a.data)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  color,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string | number;
  hint?: string;
  color: 'accent' | 'success' | 'warning' | 'danger';
}) {
  const colorMap = {
    accent: 'text-[var(--accent)] bg-[var(--accent-soft)]',
    success: 'text-[var(--success)] bg-[var(--success-soft)]',
    warning: 'text-[var(--warning)] bg-[var(--warning-soft)]',
    danger: 'text-[var(--danger)] bg-[var(--danger-soft)]',
  };

  return (
    <Card>
      <CardContent>
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-3', colorMap[color])}>
          <Icon className="w-4 h-4" strokeWidth={2} />
        </div>
        <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">{label}</p>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {hint && <p className="text-xs text-[var(--text-muted)] mt-0.5">{hint}</p>}
      </CardContent>
    </Card>
  );
}

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
        >
          Ver tudo
          <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
        </Link>
      )}
    </div>
  );
}
