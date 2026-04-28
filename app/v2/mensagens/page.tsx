'use client';

import * as React from 'react';
import { Search, Send, Phone, Video, MoreVertical, Smile, Paperclip } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { cn, formatTime, relativeDate } from '@/lib/utils';
import { MENTORADOS, type Mentorado } from '@/lib/mocks-v2';

type Mensagem = {
  id: string;
  de: 'mentor' | 'mentorado';
  texto: string;
  hora: string;
};

type Conversa = {
  mentoradoId: string;
  ultimaMensagem: string;
  ultimaHora: string;
  naoLidas: number;
  mensagens: Mensagem[];
};

const CONVERSAS: Conversa[] = [
  {
    mentoradoId: 'm1',
    ultimaMensagem: 'Perfeito! Vou aplicar essas estratégias e te conto na próxima.',
    ultimaHora: '2026-04-28T11:30:00',
    naoLidas: 2,
    mensagens: [
      { id: '1', de: 'mentor', texto: 'Oi Ana! Como foi o lançamento da campanha?', hora: '2026-04-28T10:15:00' },
      { id: '2', de: 'mentorado', texto: 'Foi muito bem! Tivemos 12% de conversão na primeira semana 🎉', hora: '2026-04-28T10:32:00' },
      { id: '3', de: 'mentor', texto: 'Excelente número! Vamos focar agora em escalar isso. Tenho 3 ideias pra você testar.', hora: '2026-04-28T11:20:00' },
      { id: '4', de: 'mentorado', texto: 'Perfeito! Vou aplicar essas estratégias e te conto na próxima.', hora: '2026-04-28T11:30:00' },
    ],
  },
  {
    mentoradoId: 'm2',
    ultimaMensagem: 'Posso te mandar a planilha de pricing pra você dar uma olhada?',
    ultimaHora: '2026-04-27T18:45:00',
    naoLidas: 1,
    mensagens: [
      { id: '1', de: 'mentorado', texto: 'Oi! Estou revisando o pricing do produto.', hora: '2026-04-27T18:40:00' },
      { id: '2', de: 'mentorado', texto: 'Posso te mandar a planilha de pricing pra você dar uma olhada?', hora: '2026-04-27T18:45:00' },
    ],
  },
  {
    mentoradoId: 'm3',
    ultimaMensagem: 'Obrigada pela mentoria de hoje! Ficou muito claro o roadmap.',
    ultimaHora: '2026-04-26T16:00:00',
    naoLidas: 0,
    mensagens: [
      { id: '1', de: 'mentor', texto: 'Ótima sessão hoje, Juliana!', hora: '2026-04-26T15:55:00' },
      { id: '2', de: 'mentorado', texto: 'Obrigada pela mentoria de hoje! Ficou muito claro o roadmap.', hora: '2026-04-26T16:00:00' },
    ],
  },
  {
    mentoradoId: 'm5',
    ultimaMensagem: 'Confirma a reunião de quinta-feira?',
    ultimaHora: '2026-04-25T09:30:00',
    naoLidas: 0,
    mensagens: [
      { id: '1', de: 'mentorado', texto: 'Confirma a reunião de quinta-feira?', hora: '2026-04-25T09:30:00' },
    ],
  },
];

export default function MensagensPage() {
  const [busca, setBusca] = React.useState('');
  const [ativaId, setAtivaId] = React.useState<string>(CONVERSAS[0].mentoradoId);

  const conversaAtiva = CONVERSAS.find(c => c.mentoradoId === ativaId);
  const mentoradoAtivo = MENTORADOS.find(m => m.id === ativaId);

  const conversasFiltradas = busca
    ? CONVERSAS.filter(c => {
        const m = MENTORADOS.find(x => x.id === c.mentoradoId);
        return m?.nome.toLowerCase().includes(busca.toLowerCase());
      })
    : CONVERSAS;

  return (
    <div className="h-[calc(100vh-3.5rem)] md:h-screen flex flex-col">
      <div className="px-4 sm:px-6 lg:px-10 pt-8 pb-4 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold tracking-tight">Mensagens</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Conversas com seus mentorados
        </p>
      </div>

      <div className="flex-1 px-4 sm:px-6 lg:px-10 pb-6 max-w-7xl mx-auto w-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-0 h-full bg-[var(--surface)] border border-[var(--border-app)] rounded-xl overflow-hidden">
          {/* Lista de conversas */}
          <aside className={cn(
            'border-r border-[var(--border-app)] flex flex-col',
            ativaId && 'hidden md:flex'
          )}>
            <div className="p-3 border-b border-[var(--border-soft)]">
              <Input
                icon={Search}
                placeholder="Buscar conversa..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
            </div>
            <ul className="flex-1 overflow-y-auto">
              {conversasFiltradas.map(c => {
                const m = MENTORADOS.find(x => x.id === c.mentoradoId);
                if (!m) return null;
                const ativo = c.mentoradoId === ativaId;
                return (
                  <li key={c.mentoradoId}>
                    <button
                      onClick={() => setAtivaId(c.mentoradoId)}
                      className={cn(
                        'w-full text-left flex items-start gap-3 p-3 transition-colors border-b border-[var(--border-soft)]',
                        ativo ? 'bg-[var(--accent-soft)]' : 'hover:bg-[var(--surface-hover)]'
                      )}
                    >
                      <Avatar nome={m.nome} size="md" showStatus status={c.naoLidas > 0 ? 'online' : 'offline'} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className={cn('text-sm font-semibold truncate', ativo && 'text-[var(--accent)]')}>{m.nome}</p>
                          <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                            {relativeDate(c.ultimaHora)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-[var(--text-secondary)] truncate">{c.ultimaMensagem}</p>
                          {c.naoLidas > 0 && (
                            <span className="shrink-0 inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full bg-[var(--accent)] text-white text-[10px] font-semibold">
                              {c.naoLidas}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Thread */}
          {conversaAtiva && mentoradoAtivo ? (
            <ThreadView mentorado={mentoradoAtivo} mensagens={conversaAtiva.mensagens} />
          ) : (
            <div className="flex items-center justify-center text-sm text-[var(--text-muted)]">
              Selecione uma conversa
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ThreadView({ mentorado, mensagens }: { mentorado: Mentorado; mensagens: Mensagem[] }) {
  const [draft, setDraft] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [mensagens.length]);

  return (
    <div className="flex flex-col bg-[var(--bg)]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[var(--border-soft)]">
        <Avatar nome={mentorado.nome} size="md" showStatus status="online" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{mentorado.nome}</p>
          <p className="text-xs text-[var(--text-muted)] truncate">{mentorado.especialidade}</p>
        </div>
        <div className="flex items-center gap-1">
          {[Phone, Video, MoreVertical].map((Icon, i) => (
            <button
              key={i}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              aria-label={['Ligar', 'Vídeo', 'Mais'][i]}
            >
              <Icon className="w-4 h-4" strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>

      {/* Mensagens */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {mensagens.map(m => (
          <div
            key={m.id}
            className={cn(
              'flex',
              m.de === 'mentor' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[75%] rounded-2xl px-3.5 py-2',
                m.de === 'mentor'
                  ? 'bg-[var(--accent)] text-white rounded-br-md'
                  : 'bg-[var(--surface)] border border-[var(--border-soft)] text-[var(--text-primary)] rounded-bl-md'
              )}
            >
              <p className="text-sm leading-snug whitespace-pre-wrap">{m.texto}</p>
              <p className={cn(
                'text-[10px] mt-1',
                m.de === 'mentor' ? 'text-white/70' : 'text-[var(--text-muted)]'
              )}>
                {formatTime(m.hora)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[var(--border-soft)] bg-[var(--surface)]">
        <form
          onSubmit={(e) => { e.preventDefault(); setDraft(''); }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
            aria-label="Anexar"
          >
            <Paperclip className="w-4 h-4" strokeWidth={2} />
          </button>
          <input
            type="text"
            placeholder="Digite uma mensagem..."
            value={draft}
            onChange={e => setDraft(e.target.value)}
            className="flex-1 rounded-lg border border-[var(--border-app)] bg-[var(--bg)] text-[var(--text-primary)] text-sm px-3 py-2 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          />
          <button
            type="button"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
            aria-label="Emoji"
          >
            <Smile className="w-4 h-4" strokeWidth={2} />
          </button>
          <button
            type="submit"
            disabled={!draft.trim()}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] disabled:opacity-50 disabled:pointer-events-none"
            aria-label="Enviar"
          >
            <Send className="w-4 h-4" strokeWidth={2} />
          </button>
        </form>
      </div>
    </div>
  );
}
