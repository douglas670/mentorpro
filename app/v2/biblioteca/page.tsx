'use client';

import * as React from 'react';
import {
  Plus,
  Search,
  Star,
  ExternalLink,
  FileText,
  Video,
  BookOpen,
  ClipboardList,
  GraduationCap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { RECURSOS, type Recurso, type TipoRecurso } from '@/lib/mocks-v2';

const TIPO_ICON: Record<TipoRecurso, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  artigo: FileText,
  video: Video,
  livro: BookOpen,
  template: ClipboardList,
  curso: GraduationCap,
};

const TIPO_LABEL: Record<TipoRecurso, string> = {
  artigo: 'Artigo',
  video: 'Vídeo',
  livro: 'Livro',
  template: 'Template',
  curso: 'Curso',
};

const TIPO_COLOR: Record<TipoRecurso, string> = {
  artigo: 'bg-[var(--accent-soft)] text-[var(--accent)]',
  video: 'bg-[var(--danger-soft)] text-[var(--danger)]',
  livro: 'bg-[var(--success-soft)] text-[var(--success)]',
  template: 'bg-[var(--warning-soft)] text-[var(--warning)]',
  curso: 'bg-[var(--accent-soft)] text-[var(--accent)]',
};

export default function BibliotecaPage() {
  const [busca, setBusca] = React.useState('');
  const [tipo, setTipo] = React.useState<TipoRecurso | 'todos'>('todos');
  const [soFavoritos, setSoFavoritos] = React.useState(false);

  const filtrados = React.useMemo(() => {
    const q = busca.trim().toLowerCase();
    return RECURSOS.filter(r => {
      if (q && !r.titulo.toLowerCase().includes(q) && !r.descricao.toLowerCase().includes(q) && !r.tags.some(t => t.toLowerCase().includes(q))) return false;
      if (tipo !== 'todos' && r.tipo !== tipo) return false;
      if (soFavoritos && !r.favorito) return false;
      return true;
    });
  }, [busca, tipo, soFavoritos]);

  const tiposComContagem = React.useMemo(() => {
    const counts = new Map<TipoRecurso, number>();
    RECURSOS.forEach(r => counts.set(r.tipo, (counts.get(r.tipo) ?? 0) + 1));
    return counts;
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Recursos compartilhados com seus mentorados
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" strokeWidth={2.2} />
          <span className="hidden sm:inline">Novo recurso</span>
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Buscar título, descrição ou tag..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <Button
          variant={soFavoritos ? 'default' : 'secondary'}
          onClick={() => setSoFavoritos(!soFavoritos)}
        >
          <Star className={cn('w-4 h-4', soFavoritos && 'fill-current')} strokeWidth={2} />
          Favoritos
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-6">
        <button
          onClick={() => setTipo('todos')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium border transition-colors',
            tipo === 'todos'
              ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]'
              : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-app)] hover:bg-[var(--surface-hover)]'
          )}
        >
          Todos ({RECURSOS.length})
        </button>
        {(['artigo', 'video', 'livro', 'template', 'curso'] as TipoRecurso[]).map(t => {
          const ativo = tipo === t;
          const Icon = TIPO_ICON[t];
          return (
            <button
              key={t}
              onClick={() => setTipo(t)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium border transition-colors',
                ativo
                  ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]'
                  : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-app)] hover:bg-[var(--surface-hover)]'
              )}
            >
              <Icon className="w-3 h-3" strokeWidth={2} />
              {TIPO_LABEL[t]} ({tiposComContagem.get(t) ?? 0})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtrados.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[var(--surface-hover)] flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-[var(--text-muted)]" strokeWidth={2} />
            </div>
            <h3 className="text-base font-semibold">Nenhum recurso encontrado</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Tente ajustar a busca ou os filtros.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map(r => (
            <RecursoCard key={r.id} r={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function RecursoCard({ r }: { r: Recurso }) {
  const Icon = TIPO_ICON[r.tipo];
  return (
    <Card className="overflow-hidden hover:border-[var(--accent)] transition-colors group flex flex-col">
      <CardContent className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', TIPO_COLOR[r.tipo])}>
            <Icon className="w-5 h-5" strokeWidth={2} />
          </div>
          <button
            className={cn(
              'inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors',
              r.favorito
                ? 'text-[var(--warning)]'
                : 'text-[var(--text-muted)] opacity-0 group-hover:opacity-100 hover:text-[var(--warning)]'
            )}
            aria-label={r.favorito ? 'Remover dos favoritos' : 'Favoritar'}
          >
            <Star className={cn('w-4 h-4', r.favorito && 'fill-current')} strokeWidth={2} />
          </button>
        </div>

        <h3 className="font-semibold text-[var(--text-primary)] leading-snug mb-1">{r.titulo}</h3>
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">{r.descricao}</p>

        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          <Badge variant="outline" size="sm">{r.categoria}</Badge>
          {r.tags.slice(0, 2).map(t => (
            <Badge key={t} variant="default" size="sm">#{t}</Badge>
          ))}
        </div>

        <div className="mt-auto pt-3 border-t border-[var(--border-soft)] flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">{TIPO_LABEL[r.tipo]}</span>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline"
          >
            Abrir
            <ExternalLink className="w-3 h-3" strokeWidth={2} />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
