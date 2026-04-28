'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon, Clock, Video, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn, formatTime } from '@/lib/utils';
import { MENTORADOS, REUNIOES, type Reuniao, type StatusReuniao } from '@/lib/mocks-v2';

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const STATUS_VARIANT: Record<StatusReuniao, 'success' | 'accent' | 'danger'> = {
  agendada: 'accent',
  concluida: 'success',
  cancelada: 'danger',
};

const STATUS_LABEL: Record<StatusReuniao, string> = {
  agendada: 'Agendada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function CalendarioPage() {
  const today = React.useMemo(() => new Date(), []);
  const [cursor, setCursor] = React.useState(() => ({ year: today.getFullYear(), month: today.getMonth() }));
  const [selected, setSelected] = React.useState<Date>(today);

  const { year, month } = cursor;
  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<{ date: Date | null }> = [];
  for (let i = 0; i < startDayOfWeek; i++) cells.push({ date: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(year, month, d) });
  while (cells.length % 7 !== 0) cells.push({ date: null });

  const reunioesByDate = React.useMemo(() => {
    const map = new Map<string, Reuniao[]>();
    REUNIOES.forEach(r => {
      const d = new Date(r.dataHora);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    });
    return map;
  }, []);

  const reunioesNoDia = (date: Date) => {
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return (reunioesByDate.get(key) ?? []).sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
  };

  const reunioesSelecionadas = reunioesNoDia(selected);

  const goPrev = () => setCursor(c => {
    const m = c.month - 1;
    return m < 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: m };
  });
  const goNext = () => setCursor(c => {
    const m = c.month + 1;
    return m > 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: m };
  });
  const goToday = () => {
    setCursor({ year: today.getFullYear(), month: today.getMonth() });
    setSelected(today);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendário</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Reuniões agendadas, concluídas e canceladas
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" strokeWidth={2.2} />
          <span className="hidden sm:inline">Nova reunião</span>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold tracking-tight">
                {MESES[month]} <span className="text-[var(--text-muted)] font-normal">{year}</span>
              </h2>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={goToday}>
                  Hoje
                </Button>
                <button
                  onClick={goPrev}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                  aria-label="Mês anterior"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                </button>
                <button
                  onClick={goNext}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                  aria-label="Próximo mês"
                >
                  <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Dias da semana */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DIAS_SEMANA.map((d, i) => (
                <div key={i} className="text-center text-[10px] uppercase tracking-wider text-[var(--text-muted)] py-1.5">
                  {d}
                </div>
              ))}
            </div>

            {/* Grid de dias */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((c, i) => {
                if (!c.date) return <div key={i} className="aspect-square" />;
                const reunioesDia = reunioesNoDia(c.date);
                const isToday = sameDay(c.date, today);
                const isSelected = sameDay(c.date, selected);

                return (
                  <button
                    key={i}
                    onClick={() => setSelected(c.date!)}
                    className={cn(
                      'aspect-square rounded-lg p-1.5 flex flex-col items-start justify-start text-left transition-colors relative',
                      'hover:bg-[var(--surface-hover)]',
                      isSelected && 'bg-[var(--accent-soft)] ring-1 ring-[var(--accent)]',
                      !isSelected && isToday && 'bg-[var(--surface-hover)]'
                    )}
                  >
                    <span
                      className={cn(
                        'text-xs font-medium',
                        isSelected ? 'text-[var(--accent)]' : isToday ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                      )}
                    >
                      {c.date.getDate()}
                    </span>
                    {reunioesDia.length > 0 && (
                      <div className="mt-auto flex flex-wrap gap-0.5">
                        {reunioesDia.slice(0, 3).map(r => (
                          <span
                            key={r.id}
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              r.status === 'agendada' && 'bg-[var(--accent)]',
                              r.status === 'concluida' && 'bg-[var(--success)]',
                              r.status === 'cancelada' && 'bg-[var(--danger)]'
                            )}
                          />
                        ))}
                        {reunioesDia.length > 3 && (
                          <span className="text-[8px] text-[var(--text-muted)] leading-none">+{reunioesDia.length - 3}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legenda */}
            <div className="flex items-center gap-4 mt-5 pt-4 border-t border-[var(--border-soft)] text-xs text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /> Agendada
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" /> Concluída
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--danger)]" /> Cancelada
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Painel lateral */}
        <div>
          <h3 className="text-base font-semibold tracking-tight mb-3">
            {selected.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
          </h3>
          {reunioesSelecionadas.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-[var(--surface-hover)] flex items-center justify-center mb-3">
                  <CalIcon className="w-5 h-5 text-[var(--text-muted)]" strokeWidth={2} />
                </div>
                <p className="text-sm text-[var(--text-secondary)]">Sem reuniões neste dia</p>
                <Button variant="secondary" size="sm" className="mt-4">
                  <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                  Agendar
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {reunioesSelecionadas.map(r => {
                const m = MENTORADOS.find(x => x.id === r.mentoradoId);
                return (
                  <Card key={r.id} className="hover:border-[var(--accent)] transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug">{r.titulo}</p>
                        <Badge variant={STATUS_VARIANT[r.status]} size="sm">
                          {STATUS_LABEL[r.status]}
                        </Badge>
                      </div>
                      {m && (
                        <div className="flex items-center gap-2 mb-3">
                          <Avatar nome={m.nome} size="xs" />
                          <span className="text-xs text-[var(--text-secondary)] truncate">{m.nome}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" strokeWidth={2} />
                          {formatTime(r.dataHora)} · {r.duracao}min
                        </span>
                        {r.linkVideo && (
                          <a
                            href={r.linkVideo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline ml-auto"
                          >
                            <Video className="w-3 h-3" strokeWidth={2} />
                            Entrar
                            <ExternalLink className="w-3 h-3" strokeWidth={2} />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
