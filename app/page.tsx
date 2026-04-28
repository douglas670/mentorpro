'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard,
  Users as UsersIcon,
  Calendar,
  MessageSquare,
  Target,
  BookOpen,
  BarChart3,
  Settings,
  User as UserIcon,
  LogOut,
  Menu as MenuIcon,
  X,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Mail,
  Phone,
  Save,
  FileText,
  Plus,
  Search,
  Trash2,
  Pencil,
  Filter,
  Star,
  CheckCircle2,
  Clock,
  Video,
  ChevronRight,
} from 'lucide-react';
import type { InstagramProfile, AccountInsights, TopPost } from '@/lib/instagram';
import type { SessionUser } from '@/lib/auth';
import {
  ensureSeeded,
  MentoradosStore,
  ReunioesStore,
  MetasStore,
  RecursosStore,
  formatDate,
  formatDateTime,
  relativeDate,
  getInitials,
  type Mentorado,
  type Reuniao,
  type Meta,
  type Recurso,
  type StatusMentoria,
  type StatusMeta,
  type CategoriaMeta,
  type PrioridadeMeta,
  type TipoReuniao,
  type TipoRecurso,
} from '@/lib/mocks';

function InstagramGlyph({ size = 18, color = 'currentColor', strokeWidth = 1.8, style }: { size?: number; color?: string; strokeWidth?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

type ViewId =
  | 'dashboard'
  | 'mentorados'
  | 'calendario'
  | 'mensagens'
  | 'metas'
  | 'biblioteca'
  | 'relatorios'
  | 'configuracoes'
  | 'profile'
  | 'instagram';

type IgData = {
  connected: true;
  profile: InstagramProfile;
  insights: AccountInsights;
  engagementRate: number;
  topPosts: TopPost[];
};

type ProfileExtras = {
  phone: string;
};

const PROFILE_STORAGE_KEY = 'mp_profile_extras';

const QUOTES = [
  '"Disciplina é a ponte entre metas e conquistas." — Jim Rohn',
  '"Comece onde você está. Use o que você tem. Faça o que você pode." — Arthur Ashe',
  '"Sua marca é o que dizem sobre você quando você não está na sala." — Jeff Bezos',
  '"O sucesso é a soma de pequenos esforços repetidos dia após dia." — Robert Collier',
  '"A jornada de mil milhas começa com um único passo." — Lao Tzu',
];

function quoteOfTheDay(): string {
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return QUOTES[dayIndex % QUOTES.length];
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'k';
  return String(n);
}

const COLORS = {
  bg: '#09090b',
  surface: '#18181b',
  surfaceHover: '#27272a',
  border: '#27272a',
  borderSoft: '#1f1f23',
  textPrimary: '#fafafa',
  textSecondary: '#a1a1aa',
  textMuted: '#71717a',
  accent: '#6366f1',
  accentDark: '#4f46e5',
  accentSoft: 'rgba(99, 102, 241, 0.12)',
  success: '#10b981',
  successSoft: 'rgba(16, 185, 129, 0.12)',
  warning: '#f59e0b',
  warningSoft: 'rgba(245, 158, 11, 0.12)',
  danger: '#ef4444',
  dangerSoft: 'rgba(239, 68, 68, 0.12)',
};

function LoginScreen({ authError }: { authError: string | null }) {
  return (
    <div style={{ background: COLORS.bg, color: COLORS.textPrimary, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ width: '64px', height: '64px', margin: '0 auto 24px', borderRadius: '16px', background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={32} color="#fff" strokeWidth={2} />
        </div>
        <h2 style={{ fontSize: '32px', margin: '0 0 8px 0', fontWeight: 700, letterSpacing: '-0.02em' }}>Mentor Pro</h2>
        <p style={{ fontSize: '14px', color: COLORS.textSecondary, marginBottom: '40px' }}>Mentoria estratégica para empresários</p>
        {authError && (
          <div style={{ background: COLORS.dangerSoft, border: `1px solid ${COLORS.danger}`, borderRadius: '12px', padding: '12px', marginBottom: '20px' }}>
            <p style={{ color: '#fca5a5', fontSize: '13px', fontWeight: 500, margin: 0 }}>{authError}</p>
          </div>
        )}
        <a href="/api/auth/google" style={{ textDecoration: 'none', display: 'block' }}>
          <button style={{ width: '100%', padding: '14px', background: '#fff', color: '#000', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/></svg>
            Entrar com Google
          </button>
        </a>
      </div>
    </div>
  );
}

type IconCmp = React.ComponentType<{ size?: number; strokeWidth?: number; color?: string; style?: React.CSSProperties }>;

function Modal({ open, title, onClose, children, size = 'md' }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  if (!open) return null;
  const maxWidth = size === 'sm' ? '380px' : size === 'lg' ? '720px' : '520px';
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '14px', width: '100%', maxWidth, maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 600, margin: 0, color: COLORS.textPrimary }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: COLORS.textSecondary, cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '20px 24px' }}>{children}</div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: COLORS.bg,
  border: `1px solid ${COLORS.border}`,
  color: COLORS.textPrimary,
  padding: '10px 12px',
  borderRadius: '8px',
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
  marginTop: '6px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  color: COLORS.textSecondary,
  fontWeight: 500,
  display: 'block',
  marginBottom: '4px',
};

const fieldGroup: React.CSSProperties = { marginBottom: '14px' };

function Btn({ children, onClick, variant = 'primary', icon: Icon, type = 'button' }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; icon?: IconCmp; type?: 'button' | 'submit' }) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: COLORS.accent, color: '#fff', border: 'none' },
    secondary: { background: 'transparent', color: COLORS.textPrimary, border: `1px solid ${COLORS.border}` },
    danger: { background: 'transparent', color: COLORS.danger, border: `1px solid ${COLORS.danger}` },
    ghost: { background: 'transparent', color: COLORS.textSecondary, border: 'none' },
  };
  return (
    <button type={type} onClick={onClick} style={{ ...styles[variant], padding: '9px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
      {Icon && <Icon size={14} strokeWidth={2} />}
      {children}
    </button>
  );
}

function Badge({ children, color = COLORS.textSecondary, bg }: { children: React.ReactNode; color?: string; bg?: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 9px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color, background: bg || 'transparent', border: bg ? 'none' : `1px solid ${color}` }}>
      {children}
    </span>
  );
}

function StatusMentoradoBadge({ status }: { status: StatusMentoria }) {
  const map = {
    ativo: { label: 'Ativo', color: COLORS.success, bg: COLORS.successSoft },
    pausa: { label: 'Em pausa', color: COLORS.warning, bg: COLORS.warningSoft },
    concluido: { label: 'Concluído', color: COLORS.textSecondary, bg: COLORS.surfaceHover },
  };
  const s = map[status];
  return <Badge color={s.color} bg={s.bg}>{s.label}</Badge>;
}

function StatusMetaBadge({ status }: { status: StatusMeta }) {
  const map = {
    'nao-iniciada': { label: 'Não iniciada', color: COLORS.textSecondary, bg: COLORS.surfaceHover },
    'em-progresso': { label: 'Em progresso', color: COLORS.accent, bg: COLORS.accentSoft },
    'concluida': { label: 'Concluída', color: COLORS.success, bg: COLORS.successSoft },
    'atrasada': { label: 'Atrasada', color: COLORS.danger, bg: COLORS.dangerSoft },
  };
  const s = map[status];
  return <Badge color={s.color} bg={s.bg}>{s.label}</Badge>;
}

function ProgressBar({ value, color = COLORS.accent, height = 6 }: { value: number; color?: string; height?: number }) {
  return (
    <div style={{ width: '100%', background: COLORS.surfaceHover, borderRadius: '999px', height, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${Math.min(Math.max(value, 0), 100)}%`, background: color, borderRadius: '999px', transition: 'width 200ms ease' }} />
    </div>
  );
}

function Avatar({ nome, src, size = 36 }: { nome: string; src?: string; size?: number }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={nome} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />;
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.36, fontWeight: 600, color: '#fff', flexShrink: 0 }}>
      {getInitials(nome)}
    </div>
  );
}

export default function MentorProApp() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [view, setView] = useState<ViewId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [igData, setIgData] = useState<IgData | null>(null);
  const [igLoading, setIgLoading] = useState(true);
  const [igError, setIgError] = useState<string | null>(null);

  const [profileExtras, setProfileExtras] = useState<ProfileExtras>({ phone: '' });

  const [mentorados, setMentorados] = useState<Mentorado[]>([]);
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]);

  function refreshAll() {
    setMentorados(MentoradosStore.list());
    setReunioes(ReunioesStore.list());
    setMetas(MetasStore.list());
    setRecursos(RecursosStore.list());
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const igErr = params.get('ig_error');
    if (igErr) setIgError(decodeURIComponent(igErr));
    const authErr = params.get('auth_error');
    if (authErr) setAuthError(decodeURIComponent(authErr));
    if (igErr || authErr || params.get('ig_connected') || params.get('logged_in')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    fetchAuth();
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) setProfileExtras(JSON.parse(stored));
    } catch {}
    ensureSeeded();
    refreshAll();
  }, []);

  async function fetchAuth() {
    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = (await res.json()) as { user: SessionUser };
        setUser(data.user);
        fetchIg();
      } else {
        setUser(null);
      }
    } finally {
      setAuthLoading(false);
    }
  }

  async function fetchIg() {
    setIgLoading(true);
    try {
      const res = await fetch('/api/instagram/me');
      if (res.ok) {
        const data = (await res.json()) as IgData;
        setIgData(data);
      } else {
        setIgData(null);
      }
    } finally {
      setIgLoading(false);
    }
  }

  function handleConnectInstagram() { window.location.href = '/api/instagram/login'; }
  async function handleDisconnectInstagram() { await fetch('/api/instagram/logout', { method: 'POST' }); setIgData(null); }
  async function handleLogout() { await fetch('/api/auth/logout', { method: 'POST' }); setUser(null); setIgData(null); }
  function saveProfileExtras(next: ProfileExtras) {
    setProfileExtras(next);
    try { localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next)); } catch {}
  }

  if (authLoading) {
    return <div style={{ background: COLORS.bg, color: COLORS.textSecondary, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>Carregando…</div>;
  }
  if (!user) return <LoginScreen authError={authError} />;

  const displayPicture = igData?.profile.profile_picture_url || user.picture;
  const initials = getInitials(user.name || user.email);

  const navItems: { id: ViewId; label: string; icon: IconCmp }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'mentorados', label: 'Mentorados', icon: UsersIcon },
    { id: 'calendario', label: 'Calendário', icon: Calendar },
    { id: 'mensagens', label: 'Mensagens', icon: MessageSquare },
    { id: 'metas', label: 'Metas', icon: Target },
    { id: 'biblioteca', label: 'Biblioteca', icon: BookOpen },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'instagram', label: 'Instagram', icon: InstagramGlyph },
  ];

  const secondaryNav: { id: ViewId; label: string; icon: IconCmp }[] = [
    { id: 'profile', label: 'Perfil', icon: UserIcon },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      style={{
        width: mobile ? '280px' : '260px',
        background: COLORS.surface,
        borderRight: `1px solid ${COLORS.border}`,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: mobile ? 'fixed' : 'sticky',
        top: 0,
        left: 0,
        zIndex: 50,
        transform: mobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
        transition: 'transform 250ms ease',
      }}
    >
      <div style={{ padding: '20px', borderBottom: `1px solid ${COLORS.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} color="#fff" strokeWidth={2.2} />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em' }}>Mentor Pro</span>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: COLORS.textSecondary, cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        )}
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: `1px solid ${COLORS.borderSoft}` }}>
        {displayPicture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayPicture} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: '#fff' }}>{initials}</div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name || user.email}</div>
          <div style={{ fontSize: '11px', color: COLORS.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
        <p style={{ fontSize: '10px', color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 12px', margin: '8px 0 8px' }}>Principal</p>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button key={item.id} onClick={() => { setView(item.id); setSidebarOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 12px', marginBottom: '2px', background: active ? COLORS.accentSoft : 'transparent', color: active ? COLORS.accent : COLORS.textSecondary, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: active ? 600 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 150ms ease' }}>
              <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
              {item.label}
            </button>
          );
        })}

        <p style={{ fontSize: '10px', color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 12px', margin: '20px 0 8px' }}>Conta</p>
        {secondaryNav.map(item => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button key={item.id} onClick={() => { setView(item.id); setSidebarOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 12px', marginBottom: '2px', background: active ? COLORS.accentSoft : 'transparent', color: active ? COLORS.accent : COLORS.textSecondary, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: active ? 600 : 500, cursor: 'pointer', textAlign: 'left' }}>
              <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '12px', borderTop: `1px solid ${COLORS.borderSoft}` }}>
        <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 12px', background: 'transparent', color: COLORS.textSecondary, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}>
          <LogOut size={17} strokeWidth={1.8} />
          Sair
        </button>
      </div>
    </aside>
  );

  const PageHeader = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) => (
    <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
      <div>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: COLORS.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '13px', color: COLORS.textSecondary, margin: '6px 0 0 0' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );

  const Card = ({ children, padding = '20px', style }: { children: React.ReactNode; padding?: string; style?: React.CSSProperties }) => (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '12px', padding, ...style }}>
      {children}
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, hint, color }: { icon: IconCmp; label: string; value: string; hint?: string; color?: string }) => (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: color || COLORS.textMuted, marginBottom: '10px' }}>
        <Icon size={15} strokeWidth={1.8} />
        <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ fontSize: '26px', fontWeight: 700, color: COLORS.textPrimary, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      {hint && <div style={{ fontSize: '12px', color: COLORS.textMuted, marginTop: '6px' }}>{hint}</div>}
    </Card>
  );

  // ====================== DASHBOARD ======================
  const DashboardView = () => {
    const ativos = mentorados.filter(m => m.statusMentoria === 'ativo').length;
    const reunioesAgendadas = reunioes.filter(r => r.status === 'agendada').length;
    const metasEmProgresso = metas.filter(m => m.status === 'em-progresso').length;
    const metasConcluidas = metas.filter(m => m.status === 'concluida').length;
    const metasTotal = metas.length;
    const taxaConclusao = metasTotal > 0 ? Math.round((metasConcluidas / metasTotal) * 100) : 0;

    const proximasReunioes = [...reunioes]
      .filter(r => r.status === 'agendada' && new Date(r.dataHora).getTime() > Date.now() - 1000 * 60 * 60)
      .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
      .slice(0, 3);

    return (
      <div>
        <PageHeader title={`Olá, ${user.name?.split(' ')[0] || 'mentor'}`} subtitle={new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} />

        {igError && (
          <div style={{ background: COLORS.dangerSoft, border: `1px solid ${COLORS.danger}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '20px' }}>
            <span style={{ color: '#fca5a5', fontSize: '13px' }}>Erro ao conectar Instagram: {igError}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <StatCard icon={UsersIcon} label="Mentorados ativos" value={String(ativos)} hint={`${mentorados.length} no total`} color={COLORS.accent} />
          <StatCard icon={Calendar} label="Reuniões agendadas" value={String(reunioesAgendadas)} hint="próximos dias" />
          <StatCard icon={Target} label="Metas em progresso" value={String(metasEmProgresso)} hint={`${taxaConclusao}% concluídas`} color={COLORS.success} />
          <StatCard icon={CheckCircle2} label="Metas concluídas" value={String(metasConcluidas)} hint={`de ${metasTotal}`} color={COLORS.warning} />
        </div>

        <div style={{ background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentDark} 100%)`, borderRadius: '14px', padding: '24px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.2 }}>
            <Sparkles size={64} color="#fff" strokeWidth={1.5} />
          </div>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, margin: '0 0 10px 0' }}>Reflexão do dia</p>
          <p style={{ fontSize: '17px', color: '#fff', margin: 0, fontWeight: 500, lineHeight: 1.5, maxWidth: '600px' }}>{quoteOfTheDay()}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, margin: 0 }}>Próximas reuniões</h3>
              <button onClick={() => setView('calendario')} style={{ background: 'none', border: 'none', color: COLORS.accent, fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Ver todas <ChevronRight size={12} />
              </button>
            </div>
            {proximasReunioes.length === 0 ? (
              <p style={{ fontSize: '13px', color: COLORS.textMuted, margin: 0 }}>Nenhuma reunião agendada.</p>
            ) : (
              proximasReunioes.map(r => {
                const m = mentorados.find(x => x.id === r.mentoradoId);
                return (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: `1px solid ${COLORS.borderSoft}` }}>
                    <Avatar nome={m?.nome || '?'} src={m?.avatar} size={36} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 500, color: COLORS.textPrimary, margin: 0 }}>{r.titulo}</p>
                      <p style={{ fontSize: '12px', color: COLORS.textMuted, margin: '2px 0 0 0' }}>{m?.nome} • {formatDateTime(r.dataHora)}</p>
                    </div>
                    {r.linkVideo && (
                      <a href={r.linkVideo} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.accent, display: 'inline-flex' }}>
                        <Video size={16} />
                      </a>
                    )}
                  </div>
                );
              })
            )}
          </Card>

          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 14px 0' }}>Atividade recente</h3>
            {[...reunioes].filter(r => r.status === 'concluida').slice(0, 4).map(r => {
              const m = mentorados.find(x => x.id === r.mentoradoId);
              return (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: `1px solid ${COLORS.borderSoft}` }}>
                  <Avatar nome={m?.nome || '?'} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', color: COLORS.textPrimary, margin: 0 }}>Reunião com <strong>{m?.nome}</strong></p>
                    <p style={{ fontSize: '11px', color: COLORS.textMuted, margin: '2px 0 0 0' }}>{relativeDate(r.dataHora)}</p>
                  </div>
                  {r.rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Star size={12} color={COLORS.warning} fill={COLORS.warning} />
                      <span style={{ fontSize: '12px', color: COLORS.textSecondary, fontWeight: 600 }}>{r.rating}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    );
  };

  // ====================== MENTORADOS ======================
  const MentoradosView = () => {
    const [busca, setBusca] = useState('');
    const [filtroStatus, setFiltroStatus] = useState<StatusMentoria | 'todos'>('todos');
    const [editing, setEditing] = useState<Mentorado | null>(null);
    const [creating, setCreating] = useState(false);

    const filtrados = useMemo(() => {
      return mentorados
        .filter(m => filtroStatus === 'todos' || m.statusMentoria === filtroStatus)
        .filter(m => !busca || m.nome.toLowerCase().includes(busca.toLowerCase()) || m.email.toLowerCase().includes(busca.toLowerCase()));
    }, [busca, filtroStatus]);

    function MentoradoForm({ initial, onClose }: { initial?: Mentorado; onClose: () => void }) {
      const [form, setForm] = useState<Omit<Mentorado, 'id'>>(
        initial || { nome: '', email: '', especialidade: '', statusMentoria: 'ativo', progresso: 0, dataInicio: new Date().toISOString().slice(0, 10) }
      );
      function handleSubmit() {
        if (!form.nome || !form.email) return;
        if (initial) MentoradosStore.update(initial.id, form);
        else MentoradosStore.create(form);
        refreshAll();
        onClose();
      }
      return (
        <div>
          <div style={fieldGroup}><label style={labelStyle}>Nome</label><input style={inputStyle} value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} /></div>
          <div style={fieldGroup}><label style={labelStyle}>Email</label><input style={inputStyle} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div style={fieldGroup}><label style={labelStyle}>Especialidade</label><input style={inputStyle} value={form.especialidade} onChange={e => setForm({ ...form, especialidade: e.target.value })} /></div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} value={form.statusMentoria} onChange={e => setForm({ ...form, statusMentoria: e.target.value as StatusMentoria })}>
              <option value="ativo">Ativo</option><option value="pausa">Em pausa</option><option value="concluido">Concluído</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={fieldGroup}><label style={labelStyle}>Progresso (%)</label><input style={inputStyle} type="number" min={0} max={100} value={form.progresso} onChange={e => setForm({ ...form, progresso: Number(e.target.value) })} /></div>
            <div style={fieldGroup}><label style={labelStyle}>Início</label><input style={inputStyle} type="date" value={form.dataInicio} onChange={e => setForm({ ...form, dataInicio: e.target.value })} /></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
            <Btn onClick={handleSubmit} icon={Save}>Salvar</Btn>
          </div>
        </div>
      );
    }

    return (
      <div>
        <PageHeader
          title="Mentorados"
          subtitle={`${mentorados.length} cadastrados • ${filtrados.length} filtrados`}
          action={<Btn icon={Plus} onClick={() => setCreating(true)}>Novo mentorado</Btn>}
        />

        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={15} color={COLORS.textMuted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input style={{ ...inputStyle, marginTop: 0, paddingLeft: '36px' }} placeholder="Buscar por nome ou email..." value={busca} onChange={e => setBusca(e.target.value)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} color={COLORS.textMuted} />
              <select style={{ ...inputStyle, marginTop: 0, width: 'auto' }} value={filtroStatus} onChange={e => setFiltroStatus(e.target.value as StatusMentoria | 'todos')}>
                <option value="todos">Todos</option><option value="ativo">Ativos</option><option value="pausa">Em pausa</option><option value="concluido">Concluídos</option>
              </select>
            </div>
          </div>
        </Card>

        {filtrados.length === 0 ? (
          <Card>
            <div style={{ textAlign: 'center', padding: '40px 0', color: COLORS.textMuted }}>Nenhum mentorado encontrado</div>
          </Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
            {filtrados.map(m => (
              <Card key={m.id} padding="18px">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <Avatar nome={m.nome} src={m.avatar} size={48} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, margin: 0 }}>{m.nome}</p>
                    <p style={{ fontSize: '12px', color: COLORS.textMuted, margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.email}</p>
                  </div>
                  <StatusMentoradoBadge status={m.statusMentoria} />
                </div>
                <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '0 0 12px 0' }}>{m.especialidade}</p>
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: COLORS.textMuted, fontWeight: 500 }}>Progresso</span>
                    <span style={{ fontSize: '11px', color: COLORS.textPrimary, fontWeight: 600 }}>{m.progresso}%</span>
                  </div>
                  <ProgressBar value={m.progresso} />
                </div>
                {m.dataProximaReuniao && (
                  <p style={{ fontSize: '11px', color: COLORS.textMuted, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={11} /> Próxima: {formatDateTime(m.dataProximaReuniao)}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <Btn variant="secondary" icon={Pencil} onClick={() => setEditing(m)}>Editar</Btn>
                  <Btn variant="ghost" icon={Trash2} onClick={() => { if (confirm(`Remover ${m.nome}?`)) { MentoradosStore.remove(m.id); refreshAll(); } }}>Remover</Btn>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Modal open={creating} title="Novo mentorado" onClose={() => setCreating(false)}>
          <MentoradoForm onClose={() => setCreating(false)} />
        </Modal>
        <Modal open={!!editing} title="Editar mentorado" onClose={() => setEditing(null)}>
          {editing && <MentoradoForm initial={editing} onClose={() => setEditing(null)} />}
        </Modal>
      </div>
    );
  };

  // ====================== CALENDÁRIO ======================
  const CalendarioView = () => {
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState<Reuniao | null>(null);

    const ordenadas = [...reunioes].sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
    const futuras = ordenadas.filter(r => new Date(r.dataHora).getTime() >= Date.now() - 1000 * 60 * 60);
    const passadas = ordenadas.filter(r => new Date(r.dataHora).getTime() < Date.now() - 1000 * 60 * 60).reverse();

    function ReuniaoForm({ initial, onClose }: { initial?: Reuniao; onClose: () => void }) {
      const [form, setForm] = useState<Omit<Reuniao, 'id'>>(
        initial || { mentoradoId: mentorados[0]?.id || '', titulo: '', dataHora: new Date().toISOString().slice(0, 16), duracao: 60, tipo: 'one-on-one', status: 'agendada' }
      );
      function handleSubmit() {
        if (!form.mentoradoId || !form.titulo) return;
        if (initial) ReunioesStore.update(initial.id, form);
        else ReunioesStore.create(form);
        refreshAll();
        onClose();
      }
      return (
        <div>
          <div style={fieldGroup}><label style={labelStyle}>Título</label><input style={inputStyle} value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} /></div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Mentorado</label>
            <select style={inputStyle} value={form.mentoradoId} onChange={e => setForm({ ...form, mentoradoId: e.target.value })}>
              {mentorados.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div style={fieldGroup}><label style={labelStyle}>Data e hora</label><input style={inputStyle} type="datetime-local" value={form.dataHora.slice(0, 16)} onChange={e => setForm({ ...form, dataHora: e.target.value })} /></div>
            <div style={fieldGroup}><label style={labelStyle}>Duração (min)</label><input style={inputStyle} type="number" value={form.duracao} onChange={e => setForm({ ...form, duracao: Number(e.target.value) })} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={fieldGroup}>
              <label style={labelStyle}>Tipo</label>
              <select style={inputStyle} value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value as TipoReuniao })}>
                <option value="one-on-one">1:1</option><option value="grupo">Grupo</option><option value="workshop">Workshop</option>
              </select>
            </div>
            <div style={fieldGroup}>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Reuniao['status'] })}>
                <option value="agendada">Agendada</option><option value="concluida">Concluída</option><option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>
          <div style={fieldGroup}><label style={labelStyle}>Link videoconferência</label><input style={inputStyle} value={form.linkVideo || ''} onChange={e => setForm({ ...form, linkVideo: e.target.value })} placeholder="https://meet.google.com/..." /></div>
          <div style={fieldGroup}><label style={labelStyle}>Notas</label><textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.notas || ''} onChange={e => setForm({ ...form, notas: e.target.value })} placeholder="Pontos discutidos, ações acordadas, próximos passos..." /></div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
            <Btn onClick={handleSubmit} icon={Save}>Salvar</Btn>
          </div>
        </div>
      );
    }

    function ReuniaoRow({ r }: { r: Reuniao }) {
      const m = mentorados.find(x => x.id === r.mentoradoId);
      const tipoCor = r.tipo === 'workshop' ? COLORS.warning : r.tipo === 'grupo' ? COLORS.success : COLORS.accent;
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: `1px solid ${COLORS.borderSoft}` }}>
          <div style={{ minWidth: '80px', textAlign: 'center', padding: '8px', background: COLORS.bg, borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontSize: '11px', color: COLORS.textMuted, margin: 0, textTransform: 'uppercase', fontWeight: 600 }}>{new Date(r.dataHora).toLocaleDateString('pt-BR', { month: 'short' })}</p>
            <p style={{ fontSize: '20px', fontWeight: 700, color: COLORS.textPrimary, margin: '2px 0 0 0' }}>{new Date(r.dataHora).getDate()}</p>
            <p style={{ fontSize: '11px', color: COLORS.textMuted, margin: '2px 0 0 0' }}>{new Date(r.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, margin: 0 }}>{r.titulo}</p>
              <Badge color={tipoCor}>{r.tipo}</Badge>
            </div>
            <p style={{ fontSize: '12px', color: COLORS.textMuted, margin: 0 }}>{m?.nome} • {r.duracao}min</p>
            {r.notas && <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '6px 0 0 0', fontStyle: 'italic' }}>"{r.notas.slice(0, 100)}{r.notas.length > 100 ? '...' : ''}"</p>}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {r.linkVideo && <a href={r.linkVideo} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.accent }}><Video size={16} /></a>}
            <button onClick={() => setEditing(r)} style={{ background: 'none', border: 'none', color: COLORS.textMuted, cursor: 'pointer' }}><Pencil size={14} /></button>
            <button onClick={() => { if (confirm('Remover reunião?')) { ReunioesStore.remove(r.id); refreshAll(); } }} style={{ background: 'none', border: 'none', color: COLORS.textMuted, cursor: 'pointer' }}><Trash2 size={14} /></button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <PageHeader title="Calendário" subtitle={`${futuras.length} próximas • ${passadas.length} no histórico`} action={<Btn icon={Plus} onClick={() => setCreating(true)}>Nova reunião</Btn>} />

        {futuras.length > 0 && (
          <Card style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Próximas</h3>
            {futuras.map(r => <ReuniaoRow key={r.id} r={r} />)}
          </Card>
        )}

        {passadas.length > 0 && (
          <Card>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Histórico</h3>
            {passadas.slice(0, 10).map(r => <ReuniaoRow key={r.id} r={r} />)}
          </Card>
        )}

        {reunioes.length === 0 && (
          <Card>
            <div style={{ textAlign: 'center', padding: '32px 0', color: COLORS.textMuted }}>
              <Calendar size={32} strokeWidth={1.4} style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: '14px', margin: 0 }}>Nenhuma reunião ainda. Crie a primeira!</p>
            </div>
          </Card>
        )}

        <Modal open={creating} title="Nova reunião" onClose={() => setCreating(false)} size="lg">
          <ReuniaoForm onClose={() => setCreating(false)} />
        </Modal>
        <Modal open={!!editing} title="Editar reunião" onClose={() => setEditing(null)} size="lg">
          {editing && <ReuniaoForm initial={editing} onClose={() => setEditing(null)} />}
        </Modal>
      </div>
    );
  };

  // ====================== METAS ======================
  const MetasView = () => {
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState<Meta | null>(null);
    const [filtroStatus, setFiltroStatus] = useState<StatusMeta | 'todos'>('todos');

    const filtradas = metas.filter(m => filtroStatus === 'todos' || m.status === filtroStatus);
    const counts = {
      total: metas.length,
      naoIniciada: metas.filter(m => m.status === 'nao-iniciada').length,
      emProgresso: metas.filter(m => m.status === 'em-progresso').length,
      concluida: metas.filter(m => m.status === 'concluida').length,
      atrasada: metas.filter(m => m.status === 'atrasada').length,
    };

    function MetaForm({ initial, onClose }: { initial?: Meta; onClose: () => void }) {
      const [form, setForm] = useState<Omit<Meta, 'id'>>(
        initial || { mentoradoId: mentorados[0]?.id || '', titulo: '', descricao: '', categoria: 'profissional', dataInicio: new Date().toISOString().slice(0, 10), dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), prioridade: 'media', progresso: 0, status: 'nao-iniciada' }
      );
      function handleSubmit() {
        if (!form.titulo || !form.mentoradoId) return;
        if (initial) MetasStore.update(initial.id, form);
        else MetasStore.create(form);
        refreshAll();
        onClose();
      }
      return (
        <div>
          <div style={fieldGroup}><label style={labelStyle}>Título</label><input style={inputStyle} value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} /></div>
          <div style={fieldGroup}><label style={labelStyle}>Descrição</label><textarea style={{ ...inputStyle, minHeight: '60px' }} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} /></div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Mentorado</label>
            <select style={inputStyle} value={form.mentoradoId} onChange={e => setForm({ ...form, mentoradoId: e.target.value })}>
              {mentorados.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={fieldGroup}>
              <label style={labelStyle}>Categoria</label>
              <select style={inputStyle} value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value as CategoriaMeta })}>
                <option value="profissional">Profissional</option><option value="pessoal">Pessoal</option><option value="desenvolvimento">Desenvolvimento</option>
              </select>
            </div>
            <div style={fieldGroup}>
              <label style={labelStyle}>Prioridade</label>
              <select style={inputStyle} value={form.prioridade} onChange={e => setForm({ ...form, prioridade: e.target.value as PrioridadeMeta })}>
                <option value="alta">Alta</option><option value="media">Média</option><option value="baixa">Baixa</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={fieldGroup}><label style={labelStyle}>Início</label><input style={inputStyle} type="date" value={form.dataInicio} onChange={e => setForm({ ...form, dataInicio: e.target.value })} /></div>
            <div style={fieldGroup}><label style={labelStyle}>Prazo</label><input style={inputStyle} type="date" value={form.dataFim} onChange={e => setForm({ ...form, dataFim: e.target.value })} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={fieldGroup}><label style={labelStyle}>Progresso (%)</label><input style={inputStyle} type="number" min={0} max={100} value={form.progresso} onChange={e => setForm({ ...form, progresso: Number(e.target.value) })} /></div>
            <div style={fieldGroup}>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as StatusMeta })}>
                <option value="nao-iniciada">Não iniciada</option><option value="em-progresso">Em progresso</option><option value="concluida">Concluída</option><option value="atrasada">Atrasada</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
            <Btn onClick={handleSubmit} icon={Save}>Salvar</Btn>
          </div>
        </div>
      );
    }

    return (
      <div>
        <PageHeader title="Metas" subtitle={`${counts.total} totais • ${counts.concluida} concluídas`} action={<Btn icon={Plus} onClick={() => setCreating(true)}>Nova meta</Btn>} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <button onClick={() => setFiltroStatus('todos')} style={{ background: filtroStatus === 'todos' ? COLORS.accentSoft : COLORS.surface, border: `1px solid ${filtroStatus === 'todos' ? COLORS.accent : COLORS.border}`, padding: '14px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left' }}>
            <p style={{ fontSize: '11px', color: COLORS.textMuted, margin: 0, fontWeight: 600 }}>TODAS</p>
            <p style={{ fontSize: '22px', color: COLORS.textPrimary, margin: '4px 0 0 0', fontWeight: 700 }}>{counts.total}</p>
          </button>
          <button onClick={() => setFiltroStatus('em-progresso')} style={{ background: filtroStatus === 'em-progresso' ? COLORS.accentSoft : COLORS.surface, border: `1px solid ${filtroStatus === 'em-progresso' ? COLORS.accent : COLORS.border}`, padding: '14px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left' }}>
            <p style={{ fontSize: '11px', color: COLORS.accent, margin: 0, fontWeight: 600 }}>EM PROGRESSO</p>
            <p style={{ fontSize: '22px', color: COLORS.textPrimary, margin: '4px 0 0 0', fontWeight: 700 }}>{counts.emProgresso}</p>
          </button>
          <button onClick={() => setFiltroStatus('concluida')} style={{ background: filtroStatus === 'concluida' ? COLORS.successSoft : COLORS.surface, border: `1px solid ${filtroStatus === 'concluida' ? COLORS.success : COLORS.border}`, padding: '14px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left' }}>
            <p style={{ fontSize: '11px', color: COLORS.success, margin: 0, fontWeight: 600 }}>CONCLUÍDAS</p>
            <p style={{ fontSize: '22px', color: COLORS.textPrimary, margin: '4px 0 0 0', fontWeight: 700 }}>{counts.concluida}</p>
          </button>
          <button onClick={() => setFiltroStatus('atrasada')} style={{ background: filtroStatus === 'atrasada' ? COLORS.dangerSoft : COLORS.surface, border: `1px solid ${filtroStatus === 'atrasada' ? COLORS.danger : COLORS.border}`, padding: '14px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left' }}>
            <p style={{ fontSize: '11px', color: COLORS.danger, margin: 0, fontWeight: 600 }}>ATRASADAS</p>
            <p style={{ fontSize: '22px', color: COLORS.textPrimary, margin: '4px 0 0 0', fontWeight: 700 }}>{counts.atrasada}</p>
          </button>
        </div>

        {filtradas.length === 0 ? (
          <Card><div style={{ textAlign: 'center', padding: '32px 0', color: COLORS.textMuted }}>Nenhuma meta encontrada</div></Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
            {filtradas.map(meta => {
              const m = mentorados.find(x => x.id === meta.mentoradoId);
              const prioCor = meta.prioridade === 'alta' ? COLORS.danger : meta.prioridade === 'media' ? COLORS.warning : COLORS.textSecondary;
              return (
                <Card key={meta.id}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, margin: 0, flex: 1 }}>{meta.titulo}</h4>
                    <StatusMetaBadge status={meta.status} />
                  </div>
                  <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '0 0 12px 0', lineHeight: 1.5 }}>{meta.descricao}</p>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <Badge color={prioCor}>{meta.prioridade}</Badge>
                    <Badge color={COLORS.textMuted}>{meta.categoria}</Badge>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', color: COLORS.textMuted }}>Progresso</span>
                      <span style={{ fontSize: '11px', color: COLORS.textPrimary, fontWeight: 600 }}>{meta.progresso}%</span>
                    </div>
                    <ProgressBar value={meta.progresso} color={meta.status === 'concluida' ? COLORS.success : meta.status === 'atrasada' ? COLORS.danger : COLORS.accent} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: COLORS.textMuted, paddingTop: '10px', borderTop: `1px solid ${COLORS.borderSoft}` }}>
                    <span>{m?.nome}</span>
                    <span>Prazo: {formatDate(meta.dataFim)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                    <Btn variant="secondary" icon={Pencil} onClick={() => setEditing(meta)}>Editar</Btn>
                    <Btn variant="ghost" icon={Trash2} onClick={() => { if (confirm('Remover meta?')) { MetasStore.remove(meta.id); refreshAll(); } }}>Remover</Btn>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <Modal open={creating} title="Nova meta" onClose={() => setCreating(false)} size="lg"><MetaForm onClose={() => setCreating(false)} /></Modal>
        <Modal open={!!editing} title="Editar meta" onClose={() => setEditing(null)} size="lg">{editing && <MetaForm initial={editing} onClose={() => setEditing(null)} />}</Modal>
      </div>
    );
  };

  // ====================== BIBLIOTECA ======================
  const BibliotecaView = () => {
    const [creating, setCreating] = useState(false);
    const [busca, setBusca] = useState('');
    const filtrados = recursos.filter(r => !busca || r.titulo.toLowerCase().includes(busca.toLowerCase()) || r.descricao.toLowerCase().includes(busca.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(busca.toLowerCase())));

    function RecursoForm({ onClose }: { onClose: () => void }) {
      const [form, setForm] = useState<Omit<Recurso, 'id'>>({ titulo: '', descricao: '', tipo: 'artigo', categoria: '', tags: [], url: '', favorito: false });
      const [tagsInput, setTagsInput] = useState('');
      function handleSubmit() {
        if (!form.titulo) return;
        RecursosStore.create({ ...form, tags: tagsInput.split(',').map(s => s.trim()).filter(Boolean) });
        refreshAll();
        onClose();
      }
      return (
        <div>
          <div style={fieldGroup}><label style={labelStyle}>Título</label><input style={inputStyle} value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} /></div>
          <div style={fieldGroup}><label style={labelStyle}>Descrição</label><textarea style={{ ...inputStyle, minHeight: '60px' }} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={fieldGroup}>
              <label style={labelStyle}>Tipo</label>
              <select style={inputStyle} value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value as TipoRecurso })}>
                <option value="artigo">Artigo</option><option value="video">Vídeo</option><option value="livro">Livro</option><option value="template">Template</option><option value="curso">Curso</option>
              </select>
            </div>
            <div style={fieldGroup}><label style={labelStyle}>Categoria</label><input style={inputStyle} value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} placeholder="Marketing, Vendas, Mindset..." /></div>
          </div>
          <div style={fieldGroup}><label style={labelStyle}>URL</label><input style={inputStyle} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></div>
          <div style={fieldGroup}><label style={labelStyle}>Tags (separadas por vírgula)</label><input style={inputStyle} value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="vendas, b2b, estratégia" /></div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
            <Btn onClick={handleSubmit} icon={Save}>Salvar</Btn>
          </div>
        </div>
      );
    }

    const tipoIcons: Record<TipoRecurso, string> = { artigo: '📄', video: '🎬', livro: '📚', template: '📋', curso: '🎓' };

    return (
      <div>
        <PageHeader title="Biblioteca" subtitle={`${recursos.length} recursos`} action={<Btn icon={Plus} onClick={() => setCreating(true)}>Adicionar recurso</Btn>} />

        <Card style={{ marginBottom: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} color={COLORS.textMuted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input style={{ ...inputStyle, marginTop: 0, paddingLeft: '36px' }} placeholder="Buscar por título, descrição ou tag..." value={busca} onChange={e => setBusca(e.target.value)} />
          </div>
        </Card>

        {filtrados.length === 0 ? (
          <Card><div style={{ textAlign: 'center', padding: '32px 0', color: COLORS.textMuted }}>Nenhum recurso encontrado</div></Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {filtrados.map(r => (
              <Card key={r.id}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ fontSize: '24px' }}>{tipoIcons[r.tipo]}</div>
                  <button onClick={() => { RecursosStore.update(r.id, { favorito: !r.favorito }); refreshAll(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: r.favorito ? COLORS.warning : COLORS.textMuted }}>
                    <Star size={16} fill={r.favorito ? COLORS.warning : 'none'} />
                  </button>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 6px 0' }}>{r.titulo}</h4>
                <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '0 0 12px 0', lineHeight: 1.5 }}>{r.descricao}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                  <Badge color={COLORS.textMuted}>{r.categoria}</Badge>
                  {r.tags.slice(0, 3).map(t => <Badge key={t} color={COLORS.textMuted}>#{t}</Badge>)}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1 }}>
                    <Btn variant="secondary" icon={ExternalLink}>Abrir</Btn>
                  </a>
                  <Btn variant="ghost" icon={Trash2} onClick={() => { if (confirm('Remover recurso?')) { RecursosStore.remove(r.id); refreshAll(); } }}>Remover</Btn>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Modal open={creating} title="Adicionar recurso" onClose={() => setCreating(false)}><RecursoForm onClose={() => setCreating(false)} /></Modal>
      </div>
    );
  };

  // ====================== MENSAGENS ======================
  const MensagensView = () => (
    <div>
      <PageHeader title="Mensagens" subtitle="Chat com seus mentorados" />
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <MessageSquare size={40} color={COLORS.textMuted} strokeWidth={1.4} style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 6px 0' }}>Em breve</h3>
          <p style={{ fontSize: '13px', color: COLORS.textSecondary, margin: '0 auto', maxWidth: '380px' }}>
            Chat real-time com seus mentorados. Será adicionado quando o banco de dados estiver no ar.
          </p>
        </div>
      </Card>
    </div>
  );

  // ====================== RELATÓRIOS ======================
  const RelatoriosView = () => {
    const ativos = mentorados.filter(m => m.statusMentoria === 'ativo').length;
    const reunioesConcluidas = reunioes.filter(r => r.status === 'concluida').length;
    const totalMin = reunioes.filter(r => r.status === 'concluida').reduce((sum, r) => sum + r.duracao, 0);
    const ratings = reunioes.filter(r => r.rating).map(r => r.rating!);
    const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '—';
    const taxaMetas = metas.length > 0 ? Math.round((metas.filter(m => m.status === 'concluida').length / metas.length) * 100) : 0;

    const porMentorado = mentorados.map(m => ({
      m,
      reunioes: reunioes.filter(r => r.mentoradoId === m.id).length,
      metas: metas.filter(g => g.mentoradoId === m.id).length,
      metasConcluidas: metas.filter(g => g.mentoradoId === m.id && g.status === 'concluida').length,
    })).sort((a, b) => b.metasConcluidas - a.metasConcluidas);

    return (
      <div>
        <PageHeader title="Relatórios" subtitle="Visão geral de desempenho da sua mentoria" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <StatCard icon={UsersIcon} label="Mentorados ativos" value={String(ativos)} />
          <StatCard icon={CheckCircle2} label="Reuniões realizadas" value={String(reunioesConcluidas)} />
          <StatCard icon={Clock} label="Horas em mentoria" value={`${(totalMin / 60).toFixed(1)}h`} />
          <StatCard icon={Star} label="Avaliação média" value={String(avgRating)} hint={ratings.length > 0 ? `${ratings.length} avaliações` : undefined} />
          <StatCard icon={Target} label="Taxa conclusão metas" value={`${taxaMetas}%`} color={COLORS.success} />
        </div>

        <Card>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 14px 0' }}>Ranking por mentorado</h3>
          {porMentorado.map((p, i) => (
            <div key={p.m.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < porMentorado.length - 1 ? `1px solid ${COLORS.borderSoft}` : 'none' }}>
              <div style={{ width: '28px', textAlign: 'center', fontSize: '13px', fontWeight: 700, color: i < 3 ? COLORS.warning : COLORS.textMuted }}>{i + 1}º</div>
              <Avatar nome={p.m.nome} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 500, color: COLORS.textPrimary, margin: 0 }}>{p.m.nome}</p>
                <p style={{ fontSize: '11px', color: COLORS.textMuted, margin: '2px 0 0 0' }}>{p.reunioes} reuniões • {p.metas} metas</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: COLORS.success, fontWeight: 600 }}>{p.metasConcluidas} concluídas</span>
                <ProgressBar value={p.m.progresso} height={4} />
                <span style={{ fontSize: '11px', color: COLORS.textSecondary, fontWeight: 600, minWidth: '32px', textAlign: 'right' }}>{p.m.progresso}%</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    );
  };

  // ====================== INSTAGRAM ======================
  const InstagramView = () => {
    if (igLoading) return <div><PageHeader title="Instagram" /><p style={{ color: COLORS.textSecondary, fontSize: '14px' }}>Carregando…</p></div>;
    if (!igData) {
      return (
        <div>
          <PageHeader title="Instagram" subtitle="Conecte sua conta para visualizar métricas" />
          <Card>
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <InstagramGlyph size={48} color={COLORS.textMuted} strokeWidth={1.4} style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 8px 0' }}>Sincronize seu Instagram</h3>
              <p style={{ fontSize: '14px', color: COLORS.textSecondary, margin: '0 auto 24px', maxWidth: '380px' }}>Conecte sua conta Business ou Creator para acompanhar métricas em tempo real.</p>
              <button onClick={handleConnectInstagram} style={{ background: COLORS.accent, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                <InstagramGlyph size={18} color="#fff" /> Conectar Instagram
              </button>
            </div>
          </Card>
        </div>
      );
    }
    const { profile, insights, engagementRate, topPosts } = igData;
    return (
      <div>
        <PageHeader title="Instagram" subtitle={`Insights de @${profile.username}`} />
        <div style={{ background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentDark} 100%)`, borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, margin: '0 0 8px 0' }}>Seguidores totais</p>
          <p style={{ fontSize: '36px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>{formatNumber(profile.followers_count)}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <StatCard icon={TrendingUp} label="Engajamento" value={`${engagementRate}%`} />
          <StatCard icon={Eye} label="Alcance (28d)" value={formatNumber(insights.reach)} />
          <StatCard icon={FileText} label="Publicações" value={formatNumber(profile.media_count)} />
          <StatCard icon={Eye} label="Impressões (28d)" value={formatNumber(insights.impressions)} />
        </div>
        {topPosts.length > 0 && (
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 14px 0' }}>Top posts da semana</h3>
            {topPosts.map(post => (
              <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div style={{ background: COLORS.bg, border: `1px solid ${COLORS.borderSoft}`, borderRadius: '10px', padding: '12px', display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '8px' }}>
                  {post.thumbnail_url || post.media_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.thumbnail_url || post.media_url} alt="" style={{ width: '52px', height: '52px', borderRadius: '8px', objectFit: 'cover' }} />
                  ) : (<div style={{ width: '52px', height: '52px', borderRadius: '8px', background: COLORS.surfaceHover }} />)}
                  <div style={{ flex: 1, display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Heart size={14} color={COLORS.textMuted} /><span style={{ fontSize: '13px', color: COLORS.textPrimary, fontWeight: 600 }}>{formatNumber(post.like_count)}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MessageCircle size={14} color={COLORS.textMuted} /><span style={{ fontSize: '13px', color: COLORS.textPrimary, fontWeight: 600 }}>{formatNumber(post.comments_count)}</span></div>
                  </div>
                  <ExternalLink size={14} color={COLORS.textMuted} />
                </div>
              </a>
            ))}
          </Card>
        )}
        <button onClick={handleDisconnectInstagram} style={{ marginTop: '16px', background: 'transparent', color: COLORS.textMuted, border: `1px solid ${COLORS.border}`, padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Desconectar Instagram</button>
      </div>
    );
  };

  // ====================== PROFILE ======================
  const ProfileView = () => {
    const [phoneInput, setPhoneInput] = useState(profileExtras.phone);
    const [savedFlash, setSavedFlash] = useState(false);
    function handleSave() {
      saveProfileExtras({ phone: phoneInput });
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    }
    return (
      <div>
        <PageHeader title="Perfil" subtitle="Suas informações pessoais e de contato" />
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
            {displayPicture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={displayPicture} alt="" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 600, color: '#fff' }}>{initials}</div>
            )}
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 4px 0' }}>{user.name || user.email}</h2>
              {igData && <p style={{ fontSize: '13px', color: COLORS.textMuted, margin: 0 }}>@{igData.profile.username}</p>}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 0', borderBottom: `1px solid ${COLORS.borderSoft}` }}>
            <UserIcon size={18} color={COLORS.textMuted} strokeWidth={1.8} style={{ marginTop: '2px' }} />
            <div style={{ flex: 1 }}><p style={labelStyle}>Nome</p><p style={{ fontSize: '14px', color: COLORS.textPrimary, margin: 0 }}>{user.name || '—'}</p></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 0', borderBottom: `1px solid ${COLORS.borderSoft}` }}>
            <Mail size={18} color={COLORS.textMuted} strokeWidth={1.8} style={{ marginTop: '2px' }} />
            <div style={{ flex: 1 }}><p style={labelStyle}>Email</p><p style={{ fontSize: '14px', color: COLORS.textPrimary, margin: 0 }}>{user.email}</p></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 0' }}>
            <Phone size={18} color={COLORS.textMuted} strokeWidth={1.8} style={{ marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <p style={labelStyle}>Telefone</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <input type="tel" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} placeholder="(11) 99999-9999" style={{ ...inputStyle, marginTop: 0, flex: 1 }} />
                <Btn onClick={handleSave} icon={Save} variant={savedFlash ? 'primary' : 'primary'}>{savedFlash ? 'Salvo' : 'Salvar'}</Btn>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '11px', color: COLORS.textMuted, margin: '12px 0 0 0', fontStyle: 'italic' }}>* Telefone fica salvo apenas neste navegador. Persistência em banco vem em breve.</p>
        </Card>
      </div>
    );
  };

  // ====================== CONFIGURAÇÕES ======================
  const ConfiguracoesView = () => (
    <div>
      <PageHeader title="Configurações" subtitle="Personalize sua experiência" />
      <Card style={{ marginBottom: '14px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 14px 0' }}>Integrações</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${COLORS.borderSoft}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <InstagramGlyph size={18} color={COLORS.textPrimary} />
            <div>
              <p style={{ fontSize: '13px', fontWeight: 500, color: COLORS.textPrimary, margin: 0 }}>Instagram</p>
              <p style={{ fontSize: '11px', color: COLORS.textMuted, margin: '2px 0 0 0' }}>{igData ? `Conectado como @${igData.profile.username}` : 'Não conectado'}</p>
            </div>
          </div>
          {igData ? (
            <Btn variant="secondary" onClick={handleDisconnectInstagram}>Desconectar</Btn>
          ) : (
            <Btn onClick={handleConnectInstagram}>Conectar</Btn>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calendar size={18} color={COLORS.textPrimary} />
            <div>
              <p style={{ fontSize: '13px', fontWeight: 500, color: COLORS.textPrimary, margin: 0 }}>Google Calendar</p>
              <p style={{ fontSize: '11px', color: COLORS.textMuted, margin: '2px 0 0 0' }}>Sincronizar reuniões automaticamente</p>
            </div>
          </div>
          <Btn variant="secondary">Em breve</Btn>
        </div>
      </Card>
      <Card>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 14px 0' }}>Conta</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 500, color: COLORS.textPrimary, margin: 0 }}>Sair da conta</p>
            <p style={{ fontSize: '11px', color: COLORS.textMuted, margin: '2px 0 0 0' }}>Desconecta da sua sessão Google</p>
          </div>
          <Btn variant="danger" icon={LogOut} onClick={handleLogout}>Sair</Btn>
        </div>
      </Card>
    </div>
  );

  const views: Record<ViewId, React.ReactNode> = {
    dashboard: <DashboardView />,
    mentorados: <MentoradosView />,
    calendario: <CalendarioView />,
    mensagens: <MensagensView />,
    metas: <MetasView />,
    biblioteca: <BibliotecaView />,
    relatorios: <RelatoriosView />,
    instagram: <InstagramView />,
    profile: <ProfileView />,
    configuracoes: <ConfiguracoesView />,
  };

  return (
    <div style={{ background: COLORS.bg, color: COLORS.textPrimary, minHeight: '100vh', display: 'flex', fontFamily: 'inherit' }}>
      <div className="mp-desktop-sidebar"><Sidebar /></div>

      <div className="mp-mobile-sidebar">
        {sidebarOpen && (<div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />)}
        <Sidebar mobile />
      </div>

      <main style={{ flex: 1, minWidth: 0 }}>
        <header className="mp-mobile-header" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${COLORS.border}`, background: COLORS.surface, position: 'sticky', top: 0, zIndex: 30 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: COLORS.textPrimary, cursor: 'pointer', padding: '4px' }}><MenuIcon size={22} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles size={14} color="#fff" strokeWidth={2.2} /></div>
            <span style={{ fontSize: '14px', fontWeight: 700 }}>Mentor Pro</span>
          </div>
          <div style={{ width: '30px' }} />
        </header>

        <div style={{ padding: '32px 28px', maxWidth: '1200px' }}>
          {views[view]}
        </div>
      </main>
    </div>
  );
}
