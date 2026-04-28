'use client';

import * as React from 'react';
import {
  BarChart3,
  Target,
  Calendar,
  Users,
  Star,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/lib/utils';
import { MENTORADOS, REUNIOES, METAS } from '@/lib/mocks-v2';

export default function RelatoriosPage() {
  const totalMentorados = MENTORADOS.length;
  const ativos = MENTORADOS.filter(m => m.statusMentoria === 'ativo').length;
  const totalReunioes = REUNIOES.length;
  const concluidas = REUNIOES.filter(r => r.status === 'concluida').length;
  const ratings = REUNIOES.filter(r => r.rating).map(r => r.rating!);
  const nps = ratings.length ? (ratings.reduce((s, r) => s + r, 0) / ratings.length).toFixed(1) : '—';
  const metasConcluidas = METAS.filter(m => m.status === 'concluida').length;
  const taxaConclusao = METAS.length ? Math.round((metasConcluidas / METAS.length) * 100) : 0;

  // Reuniões por status
  const reunioesPorStatus = [
    { nome: 'Agendadas', valor: REUNIOES.filter(r => r.status === 'agendada').length },
    { nome: 'Concluídas', valor: concluidas },
    { nome: 'Canceladas', valor: REUNIOES.filter(r => r.status === 'cancelada').length },
  ];

  // Metas por status
  const metasPorStatus = [
    { nome: 'Não iniciada', valor: METAS.filter(m => m.status === 'nao-iniciada').length, color: '#94a3b8' },
    { nome: 'Em progresso', valor: METAS.filter(m => m.status === 'em-progresso').length, color: '#6366f1' },
    { nome: 'Concluída', valor: metasConcluidas, color: '#10b981' },
    { nome: 'Atrasada', valor: METAS.filter(m => m.status === 'atrasada').length, color: '#ef4444' },
  ];

  // Top 5 mentorados por progresso
  const topMentorados = [...MENTORADOS]
    .filter(m => m.statusMentoria === 'ativo')
    .sort((a, b) => b.progresso - a.progresso)
    .slice(0, 5);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Métricas e análises da sua mentoria
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Mentorados ativos" value={ativos} hint={`de ${totalMentorados}`} color="accent" />
        <StatCard icon={Calendar} label="Reuniões totais" value={totalReunioes} hint={`${concluidas} concluídas`} color="success" />
        <StatCard icon={Target} label="Conclusão de metas" value={`${taxaConclusao}%`} hint={`${metasConcluidas}/${METAS.length}`} color="warning" />
        <StatCard icon={Star} label="Avaliação média" value={nps} hint={`${ratings.length} avaliações`} color="accent" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Reuniões por status */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold tracking-tight">Reuniões por status</h2>
              <BarChart3 className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={2} />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reunioesPorStatus} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false} />
                  <XAxis dataKey="nome" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'var(--surface-hover)' }}
                    contentStyle={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border-app)',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Bar dataKey="valor" fill="var(--accent)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Metas por status */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold tracking-tight">Metas por status</h2>
              <Target className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={2} />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metasPorStatus.filter(m => m.valor > 0)}
                    dataKey="valor"
                    nameKey="nome"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {metasPorStatus.filter(m => m.valor > 0).map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="var(--surface)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border-app)',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11, color: 'var(--text-secondary)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top mentorados */}
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold tracking-tight">Top mentorados por progresso</h2>
              <Users className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={2} />
            </div>
            <div className="space-y-3">
              {topMentorados.map((m, i) => (
                <div key={m.id} className="flex items-center gap-3">
                  <span className="w-5 text-xs text-[var(--text-muted)] font-medium tabular-nums">#{i + 1}</span>
                  <Avatar nome={m.nome} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.nome}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{m.especialidade}</p>
                  </div>
                  <div className="w-32 sm:w-48">
                    <ProgressBar value={m.progresso} color="auto" size="sm" />
                  </div>
                  <span className="w-10 text-right text-xs font-semibold tabular-nums">{m.progresso}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
  color: 'accent' | 'success' | 'warning';
}) {
  const colorMap = {
    accent: 'text-[var(--accent)] bg-[var(--accent-soft)]',
    success: 'text-[var(--success)] bg-[var(--success-soft)]',
    warning: 'text-[var(--warning)] bg-[var(--warning-soft)]',
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
