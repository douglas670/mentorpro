'use client';

import * as React from 'react';
import { Plus, Calendar, Flame, AlertCircle, Circle, CircleDashed, CheckCircle2, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn, relativeDate } from '@/lib/utils';
import {
  MENTORADOS,
  METAS,
  type Meta,
  type StatusMeta,
  type PrioridadeMeta,
  type CategoriaMeta,
} from '@/lib/mocks-v2';

const COLUNAS: { id: StatusMeta; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; color: string }[] = [
  { id: 'nao-iniciada', label: 'Não iniciada', icon: CircleDashed, color: 'text-[var(--text-muted)]' },
  { id: 'em-progresso', label: 'Em progresso', icon: Circle, color: 'text-[var(--accent)]' },
  { id: 'concluida', label: 'Concluída', icon: CheckCircle2, color: 'text-[var(--success)]' },
  { id: 'atrasada', label: 'Atrasada', icon: AlertCircle, color: 'text-[var(--danger)]' },
];

const PRIO_VARIANT: Record<PrioridadeMeta, 'danger' | 'warning' | 'default'> = {
  alta: 'danger',
  media: 'warning',
  baixa: 'default',
};

const PRIO_LABEL: Record<PrioridadeMeta, string> = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

const CAT_LABEL: Record<CategoriaMeta, string> = {
  profissional: 'Profissional',
  pessoal: 'Pessoal',
  desenvolvimento: 'Desenvolvimento',
};

export default function MetasPage() {
  const [categoria, setCategoria] = React.useState<CategoriaMeta | 'todas'>('todas');

  const metasFiltradas = React.useMemo(() => {
    if (categoria === 'todas') return METAS;
    return METAS.filter(m => m.categoria === categoria);
  }, [categoria]);

  const porColuna = (status: StatusMeta) => metasFiltradas.filter(m => m.status === status);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metas</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {metasFiltradas.length} {metasFiltradas.length === 1 ? 'meta' : 'metas'} no total
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" strokeWidth={2.2} />
          <span className="hidden sm:inline">Nova meta</span>
        </Button>
      </div>

      {/* Filtros de categoria */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] mr-1">
          <Filter className="w-3.5 h-3.5" strokeWidth={2} />
          Categoria:
        </span>
        {(['todas', 'profissional', 'pessoal', 'desenvolvimento'] as const).map(c => {
          const ativo = categoria === c;
          return (
            <button
              key={c}
              onClick={() => setCategoria(c)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium border transition-colors',
                ativo
                  ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]'
                  : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-app)] hover:bg-[var(--surface-hover)]'
              )}
            >
              {c === 'todas' ? 'Todas' : CAT_LABEL[c as CategoriaMeta]}
            </button>
          );
        })}
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUNAS.map(col => {
          const metas = porColuna(col.id);
          const Icon = col.icon;
          return (
            <div key={col.id} className="flex flex-col">
              <div className="flex items-center gap-2 mb-3 px-1">
                <Icon className={cn('w-4 h-4', col.color)} strokeWidth={2} />
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{col.label}</h3>
                <Badge variant="default" size="sm">{metas.length}</Badge>
              </div>
              <div className="bg-[var(--surface)] border border-[var(--border-soft)] rounded-xl p-2 flex-1 space-y-2 min-h-[200px]">
                {metas.length === 0 ? (
                  <div className="text-xs text-[var(--text-muted)] text-center py-8">
                    Sem metas
                  </div>
                ) : (
                  metas.map(meta => <MetaCard key={meta.id} meta={meta} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetaCard({ meta }: { meta: Meta }) {
  const m = MENTORADOS.find(x => x.id === meta.mentoradoId);

  return (
    <Card className="hover:border-[var(--accent)] transition-colors cursor-pointer">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-sm font-semibold leading-snug text-[var(--text-primary)]">{meta.titulo}</p>
        </div>
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">{meta.descricao}</p>

        {meta.status !== 'nao-iniciada' && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Progresso</span>
              <span className="text-[10px] font-semibold">{meta.progresso}%</span>
            </div>
            <ProgressBar
              value={meta.progresso}
              color={meta.status === 'atrasada' ? 'danger' : 'auto'}
              size="sm"
            />
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap mb-3">
          <Badge variant={PRIO_VARIANT[meta.prioridade]} size="sm">
            {meta.prioridade === 'alta' && <Flame className="w-2.5 h-2.5" strokeWidth={2.5} />}
            {PRIO_LABEL[meta.prioridade]}
          </Badge>
          <Badge variant="outline" size="sm">{CAT_LABEL[meta.categoria]}</Badge>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border-soft)]">
          {m ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <Avatar nome={m.nome} size="xs" />
              <span className="text-xs text-[var(--text-secondary)] truncate">{m.nome.split(' ')[0]}</span>
            </div>
          ) : <span className="text-xs text-[var(--text-muted)]">—</span>}
          <span className="inline-flex items-center gap-1 text-[10px] text-[var(--text-muted)] shrink-0">
            <Calendar className="w-3 h-3" strokeWidth={2} />
            {relativeDate(meta.dataFim)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
