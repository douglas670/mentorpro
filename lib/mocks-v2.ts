export type StatusMentoria = 'ativo' | 'pausa' | 'concluido';
export type StatusReuniao = 'agendada' | 'concluida' | 'cancelada';
export type TipoReuniao = 'one-on-one' | 'grupo' | 'workshop';
export type StatusMeta = 'nao-iniciada' | 'em-progresso' | 'concluida' | 'atrasada';
export type CategoriaMeta = 'profissional' | 'pessoal' | 'desenvolvimento';
export type PrioridadeMeta = 'alta' | 'media' | 'baixa';
export type TipoRecurso = 'artigo' | 'video' | 'livro' | 'template' | 'curso';
export type TipoAtividade = 'reuniao' | 'meta_concluida' | 'feedback' | 'mensagem' | 'mentorado_novo';

export type Mentorado = {
  id: string;
  nome: string;
  email: string;
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
  tipo: TipoAtividade;
  mentoradoId: string;
  descricao: string;
  data: string;
};

export const MENTORADOS: Mentorado[] = [
  { id: 'm1', nome: 'Ana Carolina Souza', email: 'ana.souza@empresa.com.br', especialidade: 'E-commerce e Marketing Digital', statusMentoria: 'ativo', progresso: 78, dataInicio: '2026-01-15', dataProximaReuniao: '2026-04-30T14:00:00' },
  { id: 'm2', nome: 'Roberto Mendes', email: 'roberto@startup.io', especialidade: 'SaaS B2B', statusMentoria: 'ativo', progresso: 45, dataInicio: '2026-02-08', dataProximaReuniao: '2026-05-02T10:30:00' },
  { id: 'm3', nome: 'Juliana Pacheco', email: 'juliana@consultoria.co', especialidade: 'Consultoria estratégica', statusMentoria: 'ativo', progresso: 92, dataInicio: '2025-11-20', dataProximaReuniao: '2026-04-29T09:00:00' },
  { id: 'm4', nome: 'Felipe Andrade', email: 'felipe.a@gmail.com', especialidade: 'Gestão de pessoas', statusMentoria: 'pausa', progresso: 33, dataInicio: '2026-03-01' },
  { id: 'm5', nome: 'Mariana Lima', email: 'mari.lima@tech.com', especialidade: 'Produto digital', statusMentoria: 'ativo', progresso: 60, dataInicio: '2026-02-22', dataProximaReuniao: '2026-05-05T16:00:00' },
  { id: 'm6', nome: 'Carlos Eduardo Vieira', email: 'carlos.v@negocio.com', especialidade: 'E-commerce e Marketing Digital', statusMentoria: 'concluido', progresso: 100, dataInicio: '2025-08-10' },
  { id: 'm7', nome: 'Beatriz Almeida', email: 'bia@designstudio.co', especialidade: 'Produto digital', statusMentoria: 'ativo', progresso: 22, dataInicio: '2026-04-05', dataProximaReuniao: '2026-05-08T11:00:00' },
];

export const REUNIOES: Reuniao[] = [
  { id: 'r1', mentoradoId: 'm1', titulo: 'Mentoria 1:1 — Roadmap Q2', dataHora: '2026-04-30T14:00:00', duracao: 60, tipo: 'one-on-one', status: 'agendada', linkVideo: 'https://meet.google.com/abc-defg-hij' },
  { id: 'r2', mentoradoId: 'm2', titulo: 'Análise de pricing', dataHora: '2026-05-02T10:30:00', duracao: 45, tipo: 'one-on-one', status: 'agendada' },
  { id: 'r3', mentoradoId: 'm3', titulo: 'Follow-up trimestral', dataHora: '2026-04-29T09:00:00', duracao: 90, tipo: 'one-on-one', status: 'agendada' },
  { id: 'r4', mentoradoId: 'm5', titulo: 'Workshop: OKRs', dataHora: '2026-05-05T16:00:00', duracao: 120, tipo: 'workshop', status: 'agendada' },
  { id: 'r5', mentoradoId: 'm7', titulo: 'Onboarding inicial', dataHora: '2026-05-08T11:00:00', duracao: 60, tipo: 'one-on-one', status: 'agendada' },
  { id: 'r6', mentoradoId: 'm1', titulo: 'Mentoria 1:1', dataHora: '2026-04-22T14:00:00', duracao: 60, tipo: 'one-on-one', status: 'concluida', rating: 5, notas: 'Discutimos estratégia de aquisição via Instagram. Próximos passos definidos.' },
  { id: 'r7', mentoradoId: 'm3', titulo: 'Revisão de OKRs', dataHora: '2026-04-15T10:00:00', duracao: 60, tipo: 'one-on-one', status: 'concluida', rating: 4 },
  { id: 'r8', mentoradoId: 'm2', titulo: 'Sessão estratégica', dataHora: '2026-04-18T15:00:00', duracao: 75, tipo: 'one-on-one', status: 'concluida', rating: 5 },
];

export const METAS: Meta[] = [
  { id: 'g1', mentoradoId: 'm1', titulo: 'Atingir 10k seguidores no Instagram', descricao: 'Crescimento orgânico via conteúdo de valor', categoria: 'profissional', dataInicio: '2026-01-15', dataFim: '2026-06-30', prioridade: 'alta', progresso: 65, status: 'em-progresso' },
  { id: 'g2', mentoradoId: 'm1', titulo: 'Lançar funil de vendas estruturado', descricao: 'Captura → nutrição → conversão', categoria: 'profissional', dataInicio: '2026-02-01', dataFim: '2026-04-30', prioridade: 'alta', progresso: 90, status: 'em-progresso' },
  { id: 'g3', mentoradoId: 'm2', titulo: 'Faturar R$ 50k/mês recorrente', descricao: 'MRR estável com churn abaixo de 5%', categoria: 'profissional', dataInicio: '2026-02-01', dataFim: '2026-08-31', prioridade: 'alta', progresso: 30, status: 'em-progresso' },
  { id: 'g4', mentoradoId: 'm3', titulo: 'Contratar gerente comercial', descricao: 'Liberar fundadora pra estratégia', categoria: 'profissional', dataInicio: '2026-03-01', dataFim: '2026-04-15', prioridade: 'media', progresso: 100, status: 'concluida' },
  { id: 'g5', mentoradoId: 'm5', titulo: 'Implementar OKRs trimestrais', descricao: 'Estrutura de gestão por objetivos', categoria: 'desenvolvimento', dataInicio: '2026-03-15', dataFim: '2026-06-15', prioridade: 'media', progresso: 45, status: 'em-progresso' },
  { id: 'g6', mentoradoId: 'm5', titulo: 'Ler "Measure What Matters"', descricao: 'Livro fundamental sobre OKRs', categoria: 'desenvolvimento', dataInicio: '2026-04-01', dataFim: '2026-04-15', prioridade: 'baixa', progresso: 20, status: 'atrasada' },
  { id: 'g7', mentoradoId: 'm7', titulo: 'Definir posicionamento de marca', descricao: 'Workshop de branding com a equipe', categoria: 'profissional', dataInicio: '2026-04-10', dataFim: '2026-05-30', prioridade: 'alta', progresso: 0, status: 'nao-iniciada' },
  { id: 'g8', mentoradoId: 'm2', titulo: 'Validar 5 hipóteses de feature', descricao: 'Entrevistas com clientes', categoria: 'profissional', dataInicio: '2026-04-20', dataFim: '2026-05-20', prioridade: 'media', progresso: 0, status: 'nao-iniciada' },
  { id: 'g9', mentoradoId: 'm3', titulo: 'Aprender SQL avançado', descricao: 'Curso online de 3 módulos', categoria: 'desenvolvimento', dataInicio: '2026-02-01', dataFim: '2026-04-01', prioridade: 'baixa', progresso: 70, status: 'atrasada' },
];

export const RECURSOS: Recurso[] = [
  { id: 'res1', titulo: 'Como fazer pesquisa de mercado em 5 passos', descricao: 'Framework prático aplicável imediatamente', tipo: 'artigo', categoria: 'Marketing', tags: ['mercado', 'pesquisa', 'estratégia'], url: 'https://example.com/artigo-1', favorito: true },
  { id: 'res2', titulo: 'Curso: Vendas Consultivas', descricao: 'Técnicas modernas de vendas B2B', tipo: 'curso', categoria: 'Vendas', tags: ['vendas', 'B2B'], url: 'https://example.com/curso', favorito: false },
  { id: 'res3', titulo: 'Template: Plano de Negócios', descricao: 'Modelo pronto editável no Google Docs', tipo: 'template', categoria: 'Estratégia', tags: ['plano', 'negócios'], url: 'https://example.com/template', favorito: true },
  { id: 'res4', titulo: 'Mindset Empreendedor', descricao: 'Livro fundamental para quem está começando', tipo: 'livro', categoria: 'Mindset', tags: ['mindset', 'livro'], url: 'https://example.com/livro', favorito: false },
  { id: 'res5', titulo: 'Vídeo: Como precificar SaaS', descricao: 'Princípios de pricing baseado em valor', tipo: 'video', categoria: 'Pricing', tags: ['saas', 'pricing'], url: 'https://example.com/video', favorito: true },
  { id: 'res6', titulo: 'Template: OKRs trimestrais', descricao: 'Planilha com exemplos prontos', tipo: 'template', categoria: 'Gestão', tags: ['okr', 'gestão'], url: 'https://example.com/okr-template', favorito: false },
  { id: 'res7', titulo: 'The Lean Startup', descricao: 'Eric Ries — leitura obrigatória', tipo: 'livro', categoria: 'Mindset', tags: ['lean', 'startup'], url: 'https://example.com/lean', favorito: true },
  { id: 'res8', titulo: 'Artigo: Customer Development', descricao: 'Steve Blank sobre validação de hipóteses', tipo: 'artigo', categoria: 'Produto', tags: ['validação', 'produto'], url: 'https://example.com/cust-dev', favorito: false },
];

export const ATIVIDADES: Atividade[] = [
  { id: 'a1', tipo: 'reuniao', mentoradoId: 'm1', descricao: 'concluiu a reunião "Mentoria 1:1"', data: '2026-04-22T15:00:00' },
  { id: 'a2', tipo: 'meta_concluida', mentoradoId: 'm3', descricao: 'concluiu a meta "Contratar gerente comercial"', data: '2026-04-20T18:00:00' },
  { id: 'a3', tipo: 'mensagem', mentoradoId: 'm2', descricao: 'enviou uma nova mensagem', data: '2026-04-26T11:30:00' },
  { id: 'a4', tipo: 'feedback', mentoradoId: 'm5', descricao: 'deixou feedback 5 estrelas', data: '2026-04-24T17:00:00' },
  { id: 'a5', tipo: 'mentorado_novo', mentoradoId: 'm7', descricao: 'foi adicionada à mentoria', data: '2026-04-05T10:00:00' },
  { id: 'a6', tipo: 'reuniao', mentoradoId: 'm3', descricao: 'concluiu a reunião "Revisão de OKRs"', data: '2026-04-15T11:00:00' },
];

export const FRASES_MOTIVACIONAIS = [
  '"O melhor momento para plantar uma árvore foi há 20 anos. O segundo melhor momento é agora." — Provérbio chinês',
  '"Não é a espécie mais forte que sobrevive, mas a que melhor se adapta à mudança." — Charles Darwin',
  '"Quem ensina, aprende ao ensinar. Quem aprende, ensina ao aprender." — Paulo Freire',
  '"Disciplina é a ponte entre objetivos e conquistas." — Jim Rohn',
  '"O sucesso é a soma de pequenos esforços repetidos dia após dia." — Robert Collier',
  '"Comece onde você está. Use o que você tem. Faça o que você pode." — Arthur Ashe',
];

export function fraseDoDia(): string {
  const idx = new Date().getDate() % FRASES_MOTIVACIONAIS.length;
  return FRASES_MOTIVACIONAIS[idx];
}
