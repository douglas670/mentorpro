'use client';

import * as React from 'react';
import {
  Search,
  Plus,
  LayoutGrid,
  Rows3,
  Calendar,
  Mail,
  Filter,
  MoreHorizontal,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn, relativeDate, formatTime } from '@/lib/utils';
import { MENTORADOS, type Mentorado, type StatusMentoria } from '@/lib/mocks-v2';

const STATUS_LABEL: Record<StatusMentoria, string> = {
  ativo: 'Ativo',
  pausa: 'Em pausa',
  concluido: 'Concluído',
};

const STATUS_VARIANT: Record<StatusMentoria, 'success' | 'warning' | 'accent'> = {
  ativo: 'success',
  pausa: 'warning',
  concluido: 'accent',
};

export default function MentoradosPage() {
  const [busca, setBusca] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<StatusMentoria[]>([]);
  const [especialidadeFilter, setEspecialidadeFilter] = React.useState('');
  const [view, setView] = React.useState<'cards' | 'tabela'>('cards');

  const especialidades = React.useMemo(() => {
    const set = new Set(MENTORADOS.map(m => m.especialidade));
    return Array.from(set).map(e => ({ value: e, label: e }));
  }, []);

  const filtrados = React.useMemo(() => {
    const q = busca.trim().toLowerCase();
    return MENTORADOS.filter(m => {
      if (q && !m.nome.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q)) return false;
      if (statusFilter.length > 0 && !statusFilter.includes(m.statusMentoria)) return false;
      if (especialidadeFilter && m.especialidade !== especialidadeFilter) return false;
      return true;
    });
  }, [busca, statusFilter, especialidadeFilter]);

  const toggleStatus = (s: StatusMentoria) => {
    setStatusFilter(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]));
  };

  const limparFiltros = () => {
    setBusca('');
    setStatusFilter([]);
    setEspecialidadeFilter('');
  };

  const filtrosAtivos = busca || statusFilter.length > 0 || especialidadeFilter;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentorados</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {filtrados.length} de {MENTORADOS.length} {MENTORADOS.length === 1 ? 'mentorado' : 'mentorados'}
            {filtrosAtivos ? ' (filtrado)' : ''}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" strokeWidth={2.2} />
          <span className="hidden sm:inline">Novo mentorado</span>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Buscar por nome ou e-mail..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
          <div className="sm:w-64">
            <Select
              options={especialidades}
              placeholder="Todas as especialidades"
              value={especialidadeFilter}
              onChange={e => setEspecialidadeFilter(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-[var(--border-app)] bg-[var(--bg)] p-1">
            <button
              onClick={() => setView('cards')}
              className={cn(
                'inline-flex items-center justify-center rounded-md w-9 h-9 transition-colors',
                view === 'cards'
                  ? 'bg-[var(--surface-hover)] text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
              aria-label="Visualizar em cards"
              aria-pressed={view === 'cards'}
            >
              <LayoutGrid className="w-4 h-4" strokeWidth={2} />
            </button>
            <button
              onClick={() => setView('tabela')}
              className={cn(
                'inline-flex items-center justify-center rounded-md w-9 h-9 transition-colors',
                view === 'tabela'
                  ? 'bg-[var(--surface-hover)] text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
              aria-label="Visualizar em tabela"
              aria-pressed={view === 'tabela'}
            >
              <Rows3 className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] mr-1">
            <Filter className="w-3.5 h-3.5" strokeWidth={2} />
            Status:
          </span>
          {(['ativo', 'pausa', 'concluido'] as StatusMentoria[]).map(s => {
            const ativo = statusFilter.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleStatus(s)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium border transition-colors',
                  ativo
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]'
                    : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-app)] hover:bg-[var(--surface-hover)]'
                )}
              >
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    s === 'ativo' && 'bg-[var(--success)]',
                    s === 'pausa' && 'bg-[var(--warning)]',
                    s === 'concluido' && 'bg-[var(--accent)]'
                  )}
                />
                {STATUS_LABEL[s]}
              </button>
            );
          })}
          {filtrosAtivos && (
            <button
              onClick={limparFiltros}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline-offset-2 hover:underline ml-auto"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      {filtrados.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[var(--surface-hover)] flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-[var(--text-muted)]" strokeWidth={2} />
            </div>
            <h3 className="text-base font-semibold">Nenhum mentorado encontrado</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Ajuste os filtros ou limpe a busca para ver outros resultados.
            </p>
            {filtrosAtivos && (
              <Button variant="secondary" className="mt-4" onClick={limparFiltros}>
                Limpar filtros
              </Button>
            )}
          </CardContent>
        </Card>
      ) : view === 'cards' ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map(m => (
            <MentoradoCard key={m.id} m={m} />
          ))}
        </div>
      ) : (
        <MentoradoTabela mentorados={filtrados} />
      )}
    </div>
  );
}

function MentoradoCard({ m }: { m: Mentorado }) {
  return (
    <Card className="overflow-hidden hover:border-[var(--accent)] transition-colors group">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Avatar nome={m.nome} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-[var(--text-primary)] truncate">{m.nome}</h3>
                <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5 truncate">
                  <Mail className="w-3 h-3 shrink-0" strokeWidth={2} />
                  <span className="truncate">{m.email}</span>
                </p>
              </div>
              <button
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Mais ações"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2">
              <Badge variant={STATUS_VARIANT[m.statusMentoria]} size="sm">
                {STATUS_LABEL[m.statusMentoria]}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--border-soft)] space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
              Especialidade
            </p>
            <p className="text-sm text-[var(--text-secondary)]">{m.especialidade}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Progresso
              </p>
              <span className="text-xs font-semibold text-[var(--text-primary)]">{m.progresso}%</span>
            </div>
            <ProgressBar value={m.progresso} color="auto" size="sm" />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" strokeWidth={2} />
            {m.dataProximaReuniao ? (
              <span className="text-[var(--text-secondary)]">
                Próxima:{' '}
                <span className="text-[var(--text-primary)] font-medium">
                  {relativeDate(m.dataProximaReuniao)} às {formatTime(m.dataProximaReuniao)}
                </span>
              </span>
            ) : (
              <span className="text-[var(--text-muted)]">Sem reunião agendada</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MentoradoTabela({ mentorados }: { mentorados: Mentorado[] }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface)] text-[var(--text-muted)]">
            <tr className="text-left">
              <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider">Mentorado</th>
              <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider">Especialidade</th>
              <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider">Progresso</th>
              <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider">Próxima reunião</th>
              <th className="px-5 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {mentorados.map((m, i) => (
              <tr
                key={m.id}
                className={cn(
                  'border-t border-[var(--border-soft)] hover:bg-[var(--surface-hover)] transition-colors',
                  i === 0 && 'border-t-0'
                )}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar nome={m.nome} size="sm" />
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--text-primary)] truncate">{m.nome}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <Badge variant={STATUS_VARIANT[m.statusMentoria]} size="sm">
                    {STATUS_LABEL[m.statusMentoria]}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-[var(--text-secondary)]">{m.especialidade}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <ProgressBar value={m.progresso} color="auto" size="sm" className="flex-1" />
                    <span className="text-xs font-medium text-[var(--text-primary)] w-9 text-right">
                      {m.progresso}%
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  {m.dataProximaReuniao ? (
                    <span className="text-[var(--text-secondary)]">
                      {relativeDate(m.dataProximaReuniao)}
                      <span className="text-[var(--text-muted)]"> · {formatTime(m.dataProximaReuniao)}</span>
                    </span>
                  ) : (
                    <span className="text-[var(--text-muted)]">—</span>
                  )}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    aria-label="Mais ações"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
