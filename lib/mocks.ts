// Mock data + localStorage helpers (temporário até DB real)

export type StatusMentoria = 'ativo' | 'pausa' | 'concluido';
export type StatusReuniao = 'agendada' | 'concluida' | 'cancelada';
export type TipoReuniao = 'one-on-one' | 'grupo' | 'workshop';
export type StatusMeta = 'nao-iniciada' | 'em-progresso' | 'concluida' | 'atrasada';
export type CategoriaMeta = 'profissional' | 'pessoal' | 'desenvolvimento';
export type PrioridadeMeta = 'alta' | 'media' | 'baixa';
export type TipoRecurso = 'artigo' | 'video' | 'livro' | 'template' | 'curso';

export type Mentorado = {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
  especialidade: string;
  statusMentoria: StatusMentoria;
  progresso: number;
  dataInicio: string;
  dataProximaReuniao?: string;
};

export type Reuniao = {
  id: string;
  mentoradoId: string;
  titulo: string;
  dataHora: string;
  duracao: number;
  tipo: TipoReuniao;
  status: StatusReuniao;
  linkVideo?: string;
  notas?: string;
  rating?: number;
};

export type Meta = {
  id: string;
  mentoradoId: string;
  titulo: string;
  descricao: string;
  categoria: CategoriaMeta;
  dataInicio: string;
  dataFim: string;
  prioridade: PrioridadeMeta;
  progresso: number;
  status: StatusMeta;
};

export type Recurso = {
  id: string;
  titulo: string;
  descricao: string;
  tipo: TipoRecurso;
  categoria: string;
  tags: string[];
  url: string;
  favorito: boolean;
};

export type Atividade = {
  id: string;
  tipo: 'reuniao' | 'meta_concluida' | 'feedback' | 'mensagem';
  mentoradoId: string;
  descricao: string;
  data: string;
};

const STORAGE_KEYS = {
  mentorados: 'mp_mentorados_v1',
  reunioes: 'mp_reunioes_v1',
  metas: 'mp_metas_v1',
  recursos: 'mp_recursos_v1',
  seeded: 'mp_seeded_v1',
};

function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function load<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, items: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {}
}

const SEED_MENTORADOS: Mentorado[] = [
  {
    id: 'm1',
    nome: 'Ana Carolina Souza',
    email: 'ana.souza@empresa.com.br',
    especialidade: 'E-commerce e Marketing Digital',
    statusMentoria: 'ativo',
    progresso: 78,
    dataInicio: '2026-01-15',
    dataProximaReuniao: '2026-04-30T14:00:00',
  },
  {
    id: 'm2',
    nome: 'Roberto Mendes',
    email: 'roberto@startup.io',
    especialidade: 'SaaS B2B',
    statusMentoria: 'ativo',
    progresso: 45,
    dataInicio: '2026-02-08',
    dataProximaReuniao: '2026-05-02T10:30:00',
  },
  {
    id: 'm3',
    nome: 'Juliana Pacheco',
    email: 'juliana@consultoria.co',
    especialidade: 'Consultoria estratégica',
    statusMentoria: 'ativo',
    progresso: 92,
    dataInicio: '2025-11-20',
    dataProximaReuniao: '2026-04-29T09:00:00',
  },
  {
    id: 'm4',
    nome: 'Felipe Andrade',
    email: 'felipe.a@gmail.com',
    especialidade: 'Gestão de pessoas',
    statusMentoria: 'pausa',
    progresso: 33,
    dataInicio: '2026-03-01',
  },
  {
    id: 'm5',
    nome: 'Mariana Lima',
    email: 'mari.lima@tech.com',
    especialidade: 'Produto digital',
    statusMentoria: 'ativo',
    progresso: 60,
    dataInicio: '2026-02-22',
    dataProximaReuniao: '2026-05-05T16:00:00',
  },
];

const SEED_REUNIOES: Reuniao[] = [
  { id: 'r1', mentoradoId: 'm1', titulo: 'Mentoria 1:1 — Roadmap Q2', dataHora: '2026-04-30T14:00:00', duracao: 60, tipo: 'one-on-one', status: 'agendada', linkVideo: 'https://meet.google.com/abc-defg-hij' },
  { id: 'r2', mentoradoId: 'm2', titulo: 'Análise de pricing', dataHora: '2026-05-02T10:30:00', duracao: 45, tipo: 'one-on-one', status: 'agendada' },
  { id: 'r3', mentoradoId: 'm3', titulo: 'Follow-up trimestral', dataHora: '2026-04-29T09:00:00', duracao: 90, tipo: 'one-on-one', status: 'agendada' },
  { id: 'r4', mentoradoId: 'm5', titulo: 'Workshop: OKRs', dataHora: '2026-05-05T16:00:00', duracao: 120, tipo: 'workshop', status: 'agendada' },
  { id: 'r5', mentoradoId: 'm1', titulo: 'Mentoria 1:1', dataHora: '2026-04-22T14:00:00', duracao: 60, tipo: 'one-on-one', status: 'concluida', rating: 5, notas: 'Discutimos estratégia de aquisição de clientes via Instagram. Próximos passos definidos.' },
];

const SEED_METAS: Meta[] = [
  { id: 'g1', mentoradoId: 'm1', titulo: 'Atingir 10k seguidores no Instagram', descricao: 'Meta de crescimento orgânico via conteúdo de valor', categoria: 'profissional', dataInicio: '2026-01-15', dataFim: '2026-06-30', prioridade: 'alta', progresso: 65, status: 'em-progresso' },
  { id: 'g2', mentoradoId: 'm1', titulo: 'Lançar funil de vendas estruturado', descricao: 'Captura → nutrição → conversão automatizada', categoria: 'profissional', dataInicio: '2026-02-01', dataFim: '2026-04-30', prioridade: 'alta', progresso: 90, status: 'em-progresso' },
  { id: 'g3', mentoradoId: 'm2', titulo: 'Faturar R$ 50k/mês recorrente', descricao: 'MRR estável com churn abaixo de 5%', categoria: 'profissional', dataInicio: '2026-02-01', dataFim: '2026-08-31', prioridade: 'alta', progresso: 30, status: 'em-progresso' },
  { id: 'g4', mentoradoId: 'm3', titulo: 'Contratar gerente comercial', descricao: 'Liberar fundadora pra estratégia', categoria: 'profissional', dataInicio: '2026-03-01', dataFim: '2026-04-15', prioridade: 'media', progresso: 100, status: 'concluida' },
  { id: 'g5', mentoradoId: 'm5', titulo: 'Implementar OKRs trimestrais', descricao: 'Estrutura de gestão por objetivos', categoria: 'desenvolvimento', dataInicio: '2026-03-15', dataFim: '2026-06-15', prioridade: 'media', progresso: 45, status: 'em-progresso' },
  { id: 'g6', mentoradoId: 'm5', titulo: 'Ler "Measure What Matters"', descricao: 'Livro fundamental sobre OKRs', categoria: 'desenvolvimento', dataInicio: '2026-04-01', dataFim: '2026-04-15', prioridade: 'baixa', progresso: 20, status: 'atrasada' },
];

const SEED_RECURSOS: Recurso[] = [
  { id: 'res1', titulo: 'Como fazer pesquisa de mercado em 5 passos', descricao: 'Framework prático aplicável imediatamente', tipo: 'artigo', categoria: 'Marketing', tags: ['mercado', 'pesquisa', 'estratégia'], url: 'https://example.com/artigo-1', favorito: true },
  { id: 'res2', titulo: 'Curso: Vendas Consultivas', descricao: 'Técnicas modernas de vendas B2B', tipo: 'curso', categoria: 'Vendas', tags: ['vendas', 'B2B'], url: 'https://example.com/curso', favorito: false },
  { id: 'res3', titulo: 'Template: Plano de Negócios', descricao: 'Modelo pronto editável no Google Docs', tipo: 'template', categoria: 'Estratégia', tags: ['plano', 'negócios', 'template'], url: 'https://example.com/template', favorito: true },
  { id: 'res4', titulo: 'Mindset Empreendedor', descricao: 'Livro fundamental para quem está começando', tipo: 'livro', categoria: 'Mindset', tags: ['mindset', 'livro'], url: 'https://example.com/livro', favorito: false },
];

export function ensureSeeded(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(STORAGE_KEYS.seeded)) return;

  if (load<Mentorado>(STORAGE_KEYS.mentorados).length === 0) save(STORAGE_KEYS.mentorados, SEED_MENTORADOS);
  if (load<Reuniao>(STORAGE_KEYS.reunioes).length === 0) save(STORAGE_KEYS.reunioes, SEED_REUNIOES);
  if (load<Meta>(STORAGE_KEYS.metas).length === 0) save(STORAGE_KEYS.metas, SEED_METAS);
  if (load<Recurso>(STORAGE_KEYS.recursos).length === 0) save(STORAGE_KEYS.recursos, SEED_RECURSOS);

  localStorage.setItem(STORAGE_KEYS.seeded, '1');
}

// Mentorados CRUD
export const MentoradosStore = {
  list: () => load<Mentorado>(STORAGE_KEYS.mentorados),
  get: (id: string) => load<Mentorado>(STORAGE_KEYS.mentorados).find(m => m.id === id),
  create: (data: Omit<Mentorado, 'id'>) => {
    const items = load<Mentorado>(STORAGE_KEYS.mentorados);
    const novo: Mentorado = { ...data, id: genId() };
    save(STORAGE_KEYS.mentorados, [...items, novo]);
    return novo;
  },
  update: (id: string, data: Partial<Mentorado>) => {
    const items = load<Mentorado>(STORAGE_KEYS.mentorados);
    const next = items.map(m => (m.id === id ? { ...m, ...data } : m));
    save(STORAGE_KEYS.mentorados, next);
    return next.find(m => m.id === id);
  },
  remove: (id: string) => {
    const items = load<Mentorado>(STORAGE_KEYS.mentorados);
    save(STORAGE_KEYS.mentorados, items.filter(m => m.id !== id));
  },
};

export const ReunioesStore = {
  list: () => load<Reuniao>(STORAGE_KEYS.reunioes),
  byMentorado: (mid: string) => load<Reuniao>(STORAGE_KEYS.reunioes).filter(r => r.mentoradoId === mid),
  create: (data: Omit<Reuniao, 'id'>) => {
    const items = load<Reuniao>(STORAGE_KEYS.reunioes);
    const novo: Reuniao = { ...data, id: genId() };
    save(STORAGE_KEYS.reunioes, [...items, novo]);
    return novo;
  },
  update: (id: string, data: Partial<Reuniao>) => {
    const items = load<Reuniao>(STORAGE_KEYS.reunioes);
    const next = items.map(r => (r.id === id ? { ...r, ...data } : r));
    save(STORAGE_KEYS.reunioes, next);
    return next.find(r => r.id === id);
  },
  remove: (id: string) => {
    const items = load<Reuniao>(STORAGE_KEYS.reunioes);
    save(STORAGE_KEYS.reunioes, items.filter(r => r.id !== id));
  },
};

export const MetasStore = {
  list: () => load<Meta>(STORAGE_KEYS.metas),
  byMentorado: (mid: string) => load<Meta>(STORAGE_KEYS.metas).filter(m => m.mentoradoId === mid),
  create: (data: Omit<Meta, 'id'>) => {
    const items = load<Meta>(STORAGE_KEYS.metas);
    const novo: Meta = { ...data, id: genId() };
    save(STORAGE_KEYS.metas, [...items, novo]);
    return novo;
  },
  update: (id: string, data: Partial<Meta>) => {
    const items = load<Meta>(STORAGE_KEYS.metas);
    const next = items.map(m => (m.id === id ? { ...m, ...data } : m));
    save(STORAGE_KEYS.metas, next);
    return next.find(m => m.id === id);
  },
  remove: (id: string) => {
    const items = load<Meta>(STORAGE_KEYS.metas);
    save(STORAGE_KEYS.metas, items.filter(m => m.id !== id));
  },
};

export const RecursosStore = {
  list: () => load<Recurso>(STORAGE_KEYS.recursos),
  create: (data: Omit<Recurso, 'id'>) => {
    const items = load<Recurso>(STORAGE_KEYS.recursos);
    const novo: Recurso = { ...data, id: genId() };
    save(STORAGE_KEYS.recursos, [...items, novo]);
    return novo;
  },
  update: (id: string, data: Partial<Recurso>) => {
    const items = load<Recurso>(STORAGE_KEYS.recursos);
    const next = items.map(r => (r.id === id ? { ...r, ...data } : r));
    save(STORAGE_KEYS.recursos, next);
    return next.find(r => r.id === id);
  },
  remove: (id: string) => {
    const items = load<Recurso>(STORAGE_KEYS.recursos);
    save(STORAGE_KEYS.recursos, items.filter(r => r.id !== id));
  },
};

export function getInitials(nome: string): string {
  return nome.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
}

export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export function relativeDate(iso: string): string {
  try {
    const d = new Date(iso);
    const diffMs = d.getTime() - Date.now();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays === -1) return 'Ontem';
    if (diffDays > 0 && diffDays < 7) return `Em ${diffDays} dias`;
    if (diffDays < 0 && diffDays > -7) return `${Math.abs(diffDays)} dias atrás`;
    return formatDate(iso);
  } catch {
    return iso;
  }
}
