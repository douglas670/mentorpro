'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Cake,
  Briefcase,
  Users as UsersIcon,
  Globe,
  Sparkles,
  TrendingUp,
  Lightbulb,
  Target,
  Heart,
  Award,
  AlertCircle,
  HelpCircle,
  Star,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Save,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { cn, formatDate } from '@/lib/utils';

const InstagramGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
  </svg>
);

type StatusMentoria = 'aplicacao' | 'ativo' | 'pausa' | 'concluido' | 'incompleto';

type Mentorado = {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  aniversario: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  pais: string | null;
  empresaNome: string | null;
  empresaTempo: string | null;
  faturamentoMensal: string | null;
  funcionarios: string | null;
  produtoServico: string | null;
  temProdutoDigital: string | null;
  comoGeraClientes: string | null;
  instagram: string | null;
  youtube: string | null;
  site: string | null;
  usaIA: string | null;
  dificuldadeNegocio: string | null;
  dificuldadeLeads: string | null;
  maiorProblema: string | null;
  impedeEscalar: string | null;
  ondeQuerChegar: string | null;
  expectativaMDX: string | null;
  faturamentoIdeal: string | null;
  diferencial: string | null;
  valorInegociavel: string | null;
  pontuacao: number;
  dataAplicacao: string | null;
  status: StatusMentoria;
  notas: string | null;
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

async function fetchMentorado(id: string): Promise<Mentorado> {
  const res = await fetch(`/api/mentorados/${id}`);
  if (!res.ok) throw new Error(res.status === 404 ? 'not_found' : 'falha');
  return res.json();
}

async function updateMentorado(id: string, data: Partial<Mentorado>): Promise<Mentorado> {
  const res = await fetch(`/api/mentorados/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('falha');
  return res.json();
}

async function deleteMentorado(id: string): Promise<void> {
  const res = await fetch(`/api/mentorados/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('falha');
}

export default function MentoradoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: m, isLoading, error } = useQuery({
    queryKey: ['mentorado', id],
    queryFn: () => fetchMentorado(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-5xl mx-auto">
        <p className="text-sm text-[var(--text-muted)]">Carregando...</p>
      </div>
    );
  }

  if (error || !m) {
    return (
      <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-5xl mx-auto">
        <Card>
          <CardContent className="py-16 text-center">
            <h3 className="text-base font-semibold">Mentorado não encontrado</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Pode ter sido removido ou você não tem acesso.
            </p>
            <Link href="/v2/mentorados" className="inline-block mt-4">
              <Button variant="secondary">Voltar para a lista</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DetalheView
      mentorado={m}
      onUpdated={() => queryClient.invalidateQueries({ queryKey: ['mentorado', id] })}
      onDeleted={() => {
        queryClient.invalidateQueries({ queryKey: ['mentorados'] });
        router.push('/v2/mentorados');
      }}
    />
  );
}

function DetalheView({
  mentorado: m,
  onUpdated,
  onDeleted,
}: {
  mentorado: Mentorado;
  onUpdated: () => void;
  onDeleted: () => void;
}) {
  const [status, setStatus] = React.useState<StatusMentoria>(m.status);
  const [notas, setNotas] = React.useState(m.notas ?? '');
  const dirty = status !== m.status || notas !== (m.notas ?? '');

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Mentorado>) => updateMentorado(m.id, data),
    onSuccess: () => onUpdated(),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteMentorado(m.id),
    onSuccess: () => onDeleted(),
  });

  const localizacao = [m.cidade, m.estado].filter(Boolean).join(' / ');
  const enderecoCompleto = [
    [m.endereco, m.numero].filter(Boolean).join(', '),
    m.complemento,
    m.bairro,
    [m.cidade, m.estado].filter(Boolean).join(' - '),
    m.cep,
  ].filter(Boolean).join(' · ');

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-6xl mx-auto">
      {/* Voltar */}
      <Link
        href="/v2/mentorados"
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
        Voltar para lista
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start gap-5 mb-8">
        <Avatar nome={m.nome} size="xl" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{m.nome}</h1>
            <Badge variant={STATUS_VARIANT[m.status]} size="md">{STATUS_LABEL[m.status]}</Badge>
          </div>
          {m.empresaNome && (
            <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={2} />
              {m.empresaNome}
              {m.empresaTempo && <span className="text-[var(--text-muted)]"> · {m.empresaTempo}</span>}
            </p>
          )}
          {localizacao && (
            <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
              {localizacao}
            </p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Coluna principal */}
        <div className="space-y-6 min-w-0">
          {/* Identificação */}
          <Section title="Identificação">
            <Grid>
              <Field icon={Mail} label="E-mail" value={m.email} link={m.email ? `mailto:${m.email}` : undefined} />
              <Field icon={Phone} label="Telefone" value={m.telefone} />
              <Field icon={Cake} label="Aniversário" value={m.aniversario} />
              {enderecoCompleto && (
                <Field icon={MapPin} label="Endereço" value={enderecoCompleto} colSpan={2} />
              )}
            </Grid>
          </Section>

          {/* Empresa */}
          {(m.empresaNome || m.produtoServico || m.faturamentoMensal) && (
            <Section title="Empresa">
              <Grid>
                <Field icon={Building2} label="Nome" value={m.empresaNome} />
                <Field icon={Calendar} label="Tempo de existência" value={m.empresaTempo} />
                <Field icon={TrendingUp} label="Faturamento mensal" value={m.faturamentoMensal ? `R$ ${m.faturamentoMensal}` : null} />
                <Field icon={UsersIcon} label="Funcionários" value={m.funcionarios} />
                <Field icon={Briefcase} label="Produto / Serviço" value={m.produtoServico} colSpan={2} />
                <Field icon={Sparkles} label="Tem produto digital" value={m.temProdutoDigital} />
                <Field icon={UsersIcon} label="Como gera clientes" value={m.comoGeraClientes} />
                <Field
                  icon={InstagramGlyph}
                  label="Instagram"
                  value={m.instagram}
                  link={m.instagram ? `https://instagram.com/${m.instagram.replace('@', '')}` : undefined}
                />
                <Field
                  icon={Globe}
                  label="Site"
                  value={m.site}
                  link={m.site ? (m.site.startsWith('http') ? m.site : `https://${m.site}`) : undefined}
                />
                <Field
                  icon={Globe}
                  label="YouTube"
                  value={m.youtube}
                  link={m.youtube ? (m.youtube.startsWith('http') ? m.youtube : `https://youtube.com/${m.youtube}`) : undefined}
                />
                {m.usaIA && (
                  <Field icon={Sparkles} label="Uso de IA" value={m.usaIA} colSpan={2} />
                )}
              </Grid>
            </Section>
          )}

          {/* Diagnóstico */}
          {(m.dificuldadeNegocio || m.dificuldadeLeads || m.maiorProblema || m.impedeEscalar) && (
            <Section title="Diagnóstico">
              <div className="space-y-4">
                <LongField icon={AlertCircle} label="Principal dificuldade do negócio" value={m.dificuldadeNegocio} />
                <LongField icon={Target} label="Dificuldade em atrair leads" value={m.dificuldadeLeads} />
                <LongField icon={HelpCircle} label="Maior problema do negócio" value={m.maiorProblema} />
                <LongField icon={Lightbulb} label="O que impede de escalar" value={m.impedeEscalar} />
              </div>
            </Section>
          )}

          {/* Objetivos */}
          {(m.ondeQuerChegar || m.expectativaMDX || m.faturamentoIdeal) && (
            <Section title="Objetivos">
              <div className="space-y-4">
                <LongField icon={Target} label="Onde quer chegar nos próximos 12 meses" value={m.ondeQuerChegar} />
                <LongField icon={Sparkles} label="O que espera da MDX" value={m.expectativaMDX} />
                {m.faturamentoIdeal && (
                  <Field icon={TrendingUp} label="Faturamento ideal em 12 meses" value={`R$ ${m.faturamentoIdeal}`} />
                )}
              </div>
            </Section>
          )}

          {/* Diferencial e valor */}
          {(m.diferencial || m.valorInegociavel) && (
            <Section title="Diferencial e valor">
              <div className="space-y-4">
                <LongField icon={Award} label="O que te diferencia" value={m.diferencial} />
                <LongField icon={Heart} label="Valor inegociável" value={m.valorInegociavel} />
              </div>
            </Section>
          )}

          {/* Notas privadas */}
          <Section title="Notas privadas" description="Anotações suas que só você vê">
            <textarea
              className="w-full rounded-lg border border-[var(--border-app)] bg-[var(--bg)] text-[var(--text-primary)] text-sm px-3 py-2 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
              rows={5}
              placeholder="Ex: revisar metas trimestrais, focar em pricing..."
              value={notas}
              onChange={e => setNotas(e.target.value)}
            />
          </Section>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 min-w-0">
          {/* Aplicação */}
          {m.dataAplicacao && (
            <Card>
              <CardContent>
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">Aplicação MDX</p>
                <p className="text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" strokeWidth={2} />
                  {formatDate(m.dataAplicacao)}
                </p>
                {m.pontuacao > 0 && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-[var(--warning)] fill-current" strokeWidth={2} />
                    <span className="text-sm font-semibold">{m.pontuacao} pontos</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Status quick change */}
          <Card>
            <CardContent>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">Status</p>
              <Select
                value={status}
                onChange={e => setStatus(e.target.value as StatusMentoria)}
                options={[
                  { value: 'aplicacao', label: 'Aplicação' },
                  { value: 'ativo', label: 'Ativo' },
                  { value: 'pausa', label: 'Em pausa' },
                  { value: 'concluido', label: 'Concluído' },
                  { value: 'incompleto', label: 'Incompleto' },
                ]}
              />
            </CardContent>
          </Card>

          {/* Salvar alterações */}
          {dirty && (
            <Button
              className="w-full"
              onClick={() => saveMutation.mutate({ status, notas })}
              disabled={saveMutation.isPending}
            >
              <Save className="w-4 h-4" strokeWidth={2} />
              {saveMutation.isPending ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          )}

          {/* Convite */}
          <ConviteCard mentorado={m} />

          {/* Excluir */}
          <Card className="border-[var(--danger)]/20">
            <CardContent>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">Zona perigosa</p>
              <Button
                variant="danger"
                size="sm"
                className="w-full"
                onClick={() => {
                  if (confirm(`Excluir ${m.nome}? Essa ação não pode ser desfeita.`)) {
                    deleteMutation.mutate();
                  }
                }}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                {deleteMutation.isPending ? 'Excluindo...' : 'Excluir mentorado'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ConviteCard({ mentorado }: { mentorado: Mentorado }) {
  const [copied, setCopied] = React.useState(false);
  const [origin, setOrigin] = React.useState('');

  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const link = `${origin}/convite/${mentorado.inviteToken}`;
  const telefoneNumeros = mentorado.telefone?.replace(/\D/g, '');
  const primeiroNome = mentorado.nome.split(' ')[0];
  const mensagemWhatsApp = `Olá ${primeiroNome}! Te convido para acessar o Mentor Pro, sua plataforma de mentoria. Use este link para entrar: ${link}`;
  const whatsappUrl = telefoneNumeros
    ? `https://wa.me/${telefoneNumeros}?text=${encodeURIComponent(mensagemWhatsApp)}`
    : null;

  const handleCopy = async () => {
    if (!origin) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silencioso
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-[var(--accent)]" strokeWidth={2} />
          <p className="text-sm font-semibold">Convite para a plataforma</p>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mb-3">
          Link único pra {mentorado.nome.split(' ')[0]} criar conta
        </p>

        <div className="rounded-lg border border-[var(--border-app)] bg-[var(--bg)] p-2 mb-3">
          <p className="text-[11px] text-[var(--text-muted)] truncate font-mono">
            {origin ? link : 'carregando...'}
          </p>
        </div>

        <div className="space-y-2">
          <Button variant="secondary" size="sm" className="w-full" onClick={handleCopy} disabled={!origin}>
            {copied ? (
              <><Check className="w-3.5 h-3.5" strokeWidth={2.5} />Copiado!</>
            ) : (
              <><Copy className="w-3.5 h-3.5" strokeWidth={2} />Copiar link</>
            )}
          </Button>

          {whatsappUrl ? (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="success" size="sm" className="w-full">
                <MessageSquare className="w-3.5 h-3.5" strokeWidth={2} />
                Enviar por WhatsApp
                <ExternalLink className="w-3 h-3 opacity-70" strokeWidth={2} />
              </Button>
            </a>
          ) : (
            <p className="text-[11px] text-[var(--text-muted)] text-center italic">
              Adicione um telefone pra enviar via WhatsApp
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5 sm:p-6">
        <div className="mb-4">
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          {description && <p className="text-xs text-[var(--text-secondary)] mt-0.5">{description}</p>}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">{children}</div>;
}

function Field({
  icon: Icon,
  label,
  value,
  link,
  colSpan,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string | null | undefined;
  link?: string;
  colSpan?: number;
}) {
  return (
    <div className={cn(colSpan === 2 && 'sm:col-span-2')}>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">
        <Icon className="w-3 h-3" strokeWidth={2} />
        {label}
      </div>
      {value ? (
        link ? (
          <a
            href={link}
            target={link.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="text-sm text-[var(--text-primary)] hover:text-[var(--accent)] hover:underline break-words inline-flex items-center gap-1"
          >
            {value}
            {link.startsWith('http') && <ExternalLink className="w-3 h-3 opacity-60" strokeWidth={2} />}
          </a>
        ) : (
          <p className="text-sm text-[var(--text-primary)] break-words">{value}</p>
        )
      ) : (
        <p className="text-sm text-[var(--text-muted)] italic">—</p>
      )}
    </div>
  );
}

function LongField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
        <Icon className="w-3 h-3" strokeWidth={2} />
        {label}
      </div>
      <p className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  );
}
