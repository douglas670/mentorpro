'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Plus,
  LayoutGrid,
  Rows3,
  Mail,
  Filter,
  MoreHorizontal,
  Building2,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

type StatusMentoria = 'aplicacao' | 'ativo' | 'pausa' | 'concluido' | 'incompleto';

type Mentorado = {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  empresaNome: string | null;
  faturamentoMensal: string | null;
  faturamentoIdeal: string | null;
  cidade: string | null;
  estado: string | null;
  produtoServico: string | null;
  status: StatusMentoria;
  dataAplicacao: string | null;
  pontuacao: number;
  inviteToken: string;
};

const STATUS_LABEL: Record<StatusMentoria, string> = {
  aplicacao: 'Aplicação',
  ativo: 'Ativo',
  pausa: 'Em pausa',
  concluido: 'Concluído',
  incompleto: 'Incompleto',
};

const STATUS_VARIANT: Record<StatusMentoria, 'warning' | 'success' | 'default' | 'accent' | 'danger'> = {
  aplicacao: 'warning',
  ativo: 'success',
  pausa: 'default',
  concluido: 'accent',
  incompleto: 'danger',
};

const STATUS_DOT: Record<StatusMentoria, string> = {
  aplicacao: 'bg-[var(--warning)]',
  ativo: 'bg-[var(--success)]',
  pausa: 'bg-[var(--text-muted)]',
  concluido: 'bg-[var(--accent)]',
  incompleto: 'bg-[var(--danger)]',
};

async function fetchMentorados(): Promise<Mentorado[]> {
  const res = await fetch('/api/mentorados');
  if (!res.ok) throw new Error('Falha ao carregar mentorados');
  return res.json();
}

async function createMentorado(data: { nome: string; email?: string; status: StatusMentoria }): Promise<Mentorado> {
  const res = await fetch('/api/mentorados', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao criar mentorado');
  return res.json();
}

export default function MentoradosPage() {
  const [busca, setBusca] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<StatusMentoria[]>([]);
  const [view, setView] = React.useState<'cards' | 'tabela'>('cards');
  const [novoOpen, setNovoOpen] = React.useState(false);

  const { data: mentorados, isLoading, error } = useQuery({
    queryKey: ['mentorados'],
    queryFn: fetchMentorados,
  });

  const filtrados = React.useMemo(() => {
    if (!mentorados) return [];
    const q = busca.trim().toLowerCase();
    return mentorados.filter(m => {
      if (q) {
        const haystack = [m.nome, m.email, m.empresaNome, m.cidade].filter(Boolean).join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (statusFilter.length > 0 && !statusFilter.includes(m.status)) return false;
      return true;
    });
  }, [mentorados, busca, statusFilter]);

  const toggleStatus = (s: StatusMentoria) => {
    setStatusFilter(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]));
  };

  const limparFiltros = () => {
    setBusca('');
    setStatusFilter([]);
  };

  const filtrosAtivos = busca || statusFilter.length > 0;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentorados</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {isLoading
              ? 'Carregando...'
              : `${filtrados.length} de ${mentorados?.length ?? 0}${filtrosAtivos ? ' (filtrado)' : ''}`}
          </p>
        </div>
        <Button onClick={() => setNovoOpen(true)}>
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
              placeholder="Buscar por nome, e-mail, empresa ou cidade..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
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
          {(['aplicacao', 'ativo', 'pausa', 'concluido', 'incompleto'] as StatusMentoria[]).map(s => {
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
                <span className={cn('w-1.5 h-1.5 rounded-full', STATUS_DOT[s])} />
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
      {isLoading ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-[var(--text-muted)]">
            Carregando mentorados...
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-sm text-[var(--danger)] font-medium">Erro ao carregar</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Tente recarregar a página</p>
          </CardContent>
        </Card>
      ) : filtrados.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[var(--surface-hover)] flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-[var(--text-muted)]" strokeWidth={2} />
            </div>
            <h3 className="text-base font-semibold">
              {filtrosAtivos ? 'Nenhum mentorado encontrado' : 'Sem mentorados ainda'}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {filtrosAtivos ? 'Ajuste os filtros para ver outros resultados.' : 'Adicione o primeiro mentorado pra começar.'}
            </p>
            {filtrosAtivos ? (
              <Button variant="secondary" className="mt-4" onClick={limparFiltros}>Limpar filtros</Button>
            ) : (
              <Button className="mt-4" onClick={() => setNovoOpen(true)}>
                <Plus className="w-4 h-4" strokeWidth={2.2} />
                Adicionar mentorado
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

      <NovoMentoradoModal open={novoOpen} onOpenChange={setNovoOpen} />
    </div>
  );
}

function MentoradoCard({ m }: { m: Mentorado }) {
  const incompleto = m.status === 'incompleto';
  const localizacao = [m.cidade, m.estado].filter(Boolean).join(' · ');

  return (
    <Link href={`/v2/mentorados/${m.id}`} className="block group">
      <Card
        className={cn(
          'h-full overflow-hidden transition-colors group-hover:border-[var(--accent)]',
          incompleto && 'border-dashed'
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Avatar nome={m.nome} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-[var(--text-primary)] truncate">{m.nome}</h3>
                  {m.email && (
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5 truncate">
                      <Mail className="w-3 h-3 shrink-0" strokeWidth={2} />
                      <span className="truncate">{m.email}</span>
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); }}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Mais ações"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2">
                <Badge variant={STATUS_VARIANT[m.status]} size="sm">
                  {STATUS_LABEL[m.status]}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--border-soft)] space-y-2.5 text-xs">
            {m.empresaNome ? (
              <div className="flex items-start gap-2">
                <Building2 className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0 mt-0.5" strokeWidth={2} />
                <div className="min-w-0">
                  <p className="text-[var(--text-primary)] font-medium truncate">{m.empresaNome}</p>
                  {m.produtoServico && (
                    <p className="text-[var(--text-muted)] truncate">{m.produtoServico}</p>
                  )}
                </div>
              </div>
            ) : incompleto ? (
              <p className="text-[var(--text-muted)] italic">Aplicação não preenchida</p>
            ) : null}

            {localizacao && (
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" strokeWidth={2} />
                <span className="truncate">{localizacao}</span>
              </div>
            )}

            {(m.faturamentoMensal || m.faturamentoIdeal) && (
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <TrendingUp className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" strokeWidth={2} />
                <span className="truncate">
                  {m.faturamentoMensal && <>R$ <span className="text-[var(--text-primary)] font-medium">{m.faturamentoMensal}</span></>}
                  {m.faturamentoMensal && m.faturamentoIdeal && <span className="text-[var(--text-muted)]"> → </span>}
                  {m.faturamentoIdeal && <span className="text-[var(--success)] font-medium">R$ {m.faturamentoIdeal}</span>}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
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
              <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider">Empresa</th>
              <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider">Localização</th>
              <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider">Faturamento</th>
              <th className="px-5 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {mentorados.map((m, i) => {
              const localizacao = [m.cidade, m.estado].filter(Boolean).join('/');
              return (
                <tr
                  key={m.id}
                  className={cn(
                    'border-t border-[var(--border-soft)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer',
                    i === 0 && 'border-t-0'
                  )}
                  onClick={() => { window.location.href = `/v2/mentorados/${m.id}`; }}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar nome={m.nome} size="sm" />
                      <div className="min-w-0">
                        <p className="font-medium text-[var(--text-primary)] truncate">{m.nome}</p>
                        {m.email && <p className="text-xs text-[var(--text-muted)] truncate">{m.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={STATUS_VARIANT[m.status]} size="sm">
                      {STATUS_LABEL[m.status]}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-[var(--text-secondary)]">
                    {m.empresaNome || <span className="text-[var(--text-muted)]">—</span>}
                  </td>
                  <td className="px-5 py-3 text-[var(--text-secondary)]">
                    {localizacao || <span className="text-[var(--text-muted)]">—</span>}
                  </td>
                  <td className="px-5 py-3 text-[var(--text-secondary)]">
                    {m.faturamentoMensal ? `R$ ${m.faturamentoMensal}` : <span className="text-[var(--text-muted)]">—</span>}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/v2/mentorados/${m.id}`}
                      onClick={e => e.stopPropagation()}
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      aria-label="Ver ficha"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function NovoMentoradoModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<StatusMentoria>('ativo');
  const [erro, setErro] = React.useState<string | null>(null);

  const reset = () => { setNome(''); setEmail(''); setStatus('ativo'); setErro(null); };

  const mutation = useMutation({
    mutationFn: createMentorado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorados'] });
      reset();
      onOpenChange(false);
    },
    onError: (e: Error) => setErro(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    if (!nome.trim()) { setErro('Nome é obrigatório'); return; }
    mutation.mutate({
      nome: nome.trim(),
      email: email.trim() || undefined,
      status,
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}
      title="Novo mentorado"
      description="Adicione um mentorado rapidamente. Detalhes podem ser preenchidos depois."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome completo"
          placeholder="Ex: Maria Silva"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
          autoFocus
        />
        <Input
          label="E-mail (opcional)"
          icon={Mail}
          type="email"
          placeholder="maria@empresa.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Select
          label="Status inicial"
          value={status}
          onChange={e => setStatus(e.target.value as StatusMentoria)}
          options={[
            { value: 'aplicacao', label: 'Aplicação (recém-aplicou)' },
            { value: 'ativo', label: 'Ativo (já mentorando)' },
            { value: 'pausa', label: 'Em pausa' },
          ]}
        />
        {erro && <p className="text-xs text-[var(--danger)]">{erro}</p>}
        <ModalFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
