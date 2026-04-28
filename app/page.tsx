'use client';

import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  User as UserIcon,
  CalendarCheck,
  LogOut,
  Menu as MenuIcon,
  X,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Mail,
  Phone,
  Save,
  FileText,
} from 'lucide-react';

function Instagram({ size = 18, color = 'currentColor', strokeWidth = 1.8, style }: { size?: number; color?: string; strokeWidth?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
import type { InstagramProfile, AccountInsights, TopPost } from '@/lib/instagram';
import type { SessionUser } from '@/lib/auth';

type ViewId = 'dashboard' | 'profile' | 'instagram' | 'meetings';

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

  function handleConnectInstagram() {
    window.location.href = '/api/instagram/login';
  }

  async function handleDisconnectInstagram() {
    await fetch('/api/instagram/logout', { method: 'POST' });
    setIgData(null);
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setIgData(null);
  }

  function saveProfileExtras(next: ProfileExtras) {
    setProfileExtras(next);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  if (authLoading) {
    return (
      <div style={{ background: COLORS.bg, color: COLORS.textSecondary, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
        Carregando…
      </div>
    );
  }

  if (!user) {
    return <LoginScreen authError={authError} />;
  }

  const displayName = user.name || user.email;
  const displayPicture = igData?.profile.profile_picture_url || user.picture;
  const initials = (user.name || user.email).split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();

  const navItems: { id: ViewId; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string; style?: React.CSSProperties }> }[] = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'profile', label: 'Perfil', icon: UserIcon },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'meetings', label: 'Reuniões', icon: CalendarCheck },
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
      <div style={{ padding: '24px 20px', borderBottom: `1px solid ${COLORS.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} color="#fff" strokeWidth={2.2} />
          </div>
          <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.01em' }}>Mentor Pro</span>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: COLORS.textSecondary, cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        )}
      </div>

      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: `1px solid ${COLORS.borderSoft}` }}>
        {displayPicture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayPicture} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600, color: '#fff' }}>{initials}</div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
          <div style={{ fontSize: '12px', color: COLORS.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setSidebarOpen(false); }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                marginBottom: '4px',
                background: active ? COLORS.accentSoft : 'transparent',
                color: active ? COLORS.accent : COLORS.textSecondary,
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: active ? 600 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = COLORS.surfaceHover; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '12px', borderTop: `1px solid ${COLORS.borderSoft}` }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            background: 'transparent',
            color: COLORS.textSecondary,
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = COLORS.surfaceHover}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={18} strokeWidth={1.8} />
          Sair
        </button>
      </div>
    </aside>
  );

  const PageHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div style={{ marginBottom: '32px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: COLORS.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: '14px', color: COLORS.textSecondary, margin: '6px 0 0 0' }}>{subtitle}</p>}
    </div>
  );

  const Card = ({ children, padding = '24px' }: { children: React.ReactNode; padding?: string }) => (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding }}>
      {children}
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, hint }: { icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string; style?: React.CSSProperties }>; label: string; value: string; hint?: string }) => (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.textMuted, marginBottom: '12px' }}>
        <Icon size={16} strokeWidth={1.8} />
        <span style={{ fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ fontSize: '28px', fontWeight: 700, color: COLORS.textPrimary, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      {hint && <div style={{ fontSize: '12px', color: COLORS.textMuted, marginTop: '6px' }}>{hint}</div>}
    </div>
  );

  const DashboardView = () => (
    <div>
      <PageHeader title={`Olá, ${user.name?.split(' ')[0] || 'mentor'} 👋`} subtitle="Aqui está o resumo do seu dia" />

      {igError && (
        <div style={{ background: COLORS.dangerSoft, border: `1px solid ${COLORS.danger}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#fca5a5', fontSize: '13px' }}>Erro ao conectar Instagram: {igError}</span>
        </div>
      )}

      <div style={{ background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentDark} 100%)`, borderRadius: '14px', padding: '28px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.2 }}>
          <Sparkles size={64} color="#fff" strokeWidth={1.5} />
        </div>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, margin: '0 0 12px 0' }}>Reflexão do dia</p>
        <p style={{ fontSize: '18px', color: '#fff', margin: 0, fontWeight: 500, lineHeight: 1.5, maxWidth: '600px' }}>{quoteOfTheDay()}</p>
      </div>

      {!igData ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <Instagram size={32} color={COLORS.textMuted} strokeWidth={1.5} style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '15px', color: COLORS.textPrimary, margin: '0 0 6px 0', fontWeight: 500 }}>Instagram não conectado</p>
            <p style={{ fontSize: '13px', color: COLORS.textSecondary, margin: '0 0 16px 0' }}>Conecte sua conta para ver métricas em tempo real.</p>
            <button onClick={() => setView('instagram')} style={{ background: COLORS.accent, color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Conectar agora</button>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <StatCard icon={Users} label="Seguidores" value={formatNumber(igData.profile.followers_count)} />
          <StatCard icon={TrendingUp} label="Engajamento" value={`${igData.engagementRate}%`} />
          <StatCard icon={Eye} label="Alcance (28d)" value={formatNumber(igData.insights.reach)} />
          <StatCard icon={FileText} label="Publicações" value={formatNumber(igData.profile.media_count)} />
        </div>
      )}

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Próxima sessão</p>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: COLORS.textPrimary, margin: 0 }}>Mentoria 1:1</h3>
          </div>
          <CalendarCheck size={24} color={COLORS.textMuted} strokeWidth={1.8} />
        </div>
        <p style={{ fontSize: '14px', color: COLORS.textSecondary, margin: 0 }}>Quinta-feira, 30 de Abril • 14:00 — 15:00</p>
      </Card>
    </div>
  );

  const ProfileView = () => {
    const [phoneInput, setPhoneInput] = useState(profileExtras.phone);
    const [savedFlash, setSavedFlash] = useState(false);

    function handleSave() {
      saveProfileExtras({ phone: phoneInput });
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    }

    const InfoRow = ({ icon: Icon, label, value, editable, children }: { icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string; style?: React.CSSProperties }>; label: string; value?: string; editable?: boolean; children?: React.ReactNode }) => (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 0', borderBottom: `1px solid ${COLORS.borderSoft}` }}>
        <Icon size={18} color={COLORS.textMuted} strokeWidth={1.8} style={{ marginTop: '2px' }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{label}</p>
          {editable ? children : <p style={{ fontSize: '14px', color: COLORS.textPrimary, margin: 0 }}>{value || '—'}</p>}
        </div>
      </div>
    );

    return (
      <div>
        <PageHeader title="Perfil" subtitle="Suas informações pessoais e de contato" />
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '12px' }}>
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

          <InfoRow icon={UserIcon} label="Nome" value={user.name} />
          <InfoRow icon={Mail} label="Email" value={user.email} />
          <InfoRow icon={Phone} label="Telefone" editable>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="(11) 99999-9999"
                style={{ flex: 1, background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary, padding: '8px 12px', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
              />
              <button
                onClick={handleSave}
                style={{ background: savedFlash ? COLORS.success : COLORS.accent, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
              >
                <Save size={14} />
                {savedFlash ? 'Salvo' : 'Salvar'}
              </button>
            </div>
          </InfoRow>

          <p style={{ fontSize: '12px', color: COLORS.textMuted, margin: '16px 0 0 0', fontStyle: 'italic' }}>
            * Telefone fica salvo apenas neste navegador por enquanto. Persistência em banco vem em breve.
          </p>
        </Card>
      </div>
    );
  };

  const InstagramView = () => {
    if (igLoading) {
      return (
        <div>
          <PageHeader title="Instagram" />
          <p style={{ color: COLORS.textSecondary, fontSize: '14px' }}>Carregando…</p>
        </div>
      );
    }

    if (!igData) {
      return (
        <div>
          <PageHeader title="Instagram" subtitle="Conecte sua conta para visualizar métricas" />
          <Card>
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <Instagram size={48} color={COLORS.textMuted} strokeWidth={1.4} style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 8px 0' }}>Sincronize seu Instagram</h3>
              <p style={{ fontSize: '14px', color: COLORS.textSecondary, margin: '0 auto 24px', maxWidth: '380px' }}>Conecte sua conta Business ou Creator para acompanhar seguidores, engajamento e top posts em tempo real.</p>
              <button onClick={handleConnectInstagram} style={{ background: COLORS.accent, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                <Instagram size={18} />
                Conectar Instagram
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

        <div style={{ background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentDark} 100%)`, borderRadius: '14px', padding: '28px', marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, margin: '0 0 8px 0' }}>Seguidores totais</p>
          <p style={{ fontSize: '40px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>{formatNumber(profile.followers_count)}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <StatCard icon={TrendingUp} label="Engajamento" value={`${engagementRate}%`} />
          <StatCard icon={Eye} label="Alcance (28d)" value={formatNumber(insights.reach)} />
          <StatCard icon={FileText} label="Publicações" value={formatNumber(profile.media_count)} />
          <StatCard icon={Eye} label="Impressões (28d)" value={formatNumber(insights.impressions)} />
        </div>

        {topPosts.length > 0 && (
          <Card>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 18px 0' }}>Top posts da semana</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topPosts.map(post => (
                <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{ background: COLORS.bg, border: `1px solid ${COLORS.borderSoft}`, borderRadius: '10px', padding: '12px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                    {post.thumbnail_url || post.media_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.thumbnail_url || post.media_url} alt="" style={{ width: '52px', height: '52px', borderRadius: '8px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '52px', height: '52px', borderRadius: '8px', background: COLORS.surfaceHover, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Instagram size={20} color={COLORS.textMuted} />
                      </div>
                    )}
                    <div style={{ flex: 1, display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Heart size={14} color={COLORS.textMuted} strokeWidth={1.8} />
                        <span style={{ fontSize: '13px', color: COLORS.textPrimary, fontWeight: 600 }}>{formatNumber(post.like_count)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MessageCircle size={14} color={COLORS.textMuted} strokeWidth={1.8} />
                        <span style={{ fontSize: '13px', color: COLORS.textPrimary, fontWeight: 600 }}>{formatNumber(post.comments_count)}</span>
                      </div>
                    </div>
                    <ExternalLink size={14} color={COLORS.textMuted} strokeWidth={1.8} />
                  </div>
                </a>
              ))}
            </div>
          </Card>
        )}

        <button onClick={handleDisconnectInstagram} style={{ marginTop: '20px', background: 'transparent', color: COLORS.textMuted, border: `1px solid ${COLORS.border}`, padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
          Desconectar Instagram
        </button>
      </div>
    );
  };

  const MeetingsView = () => (
    <div>
      <PageHeader title="Reuniões" subtitle="Histórico das suas sessões e resumos" />
      <Card>
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <CalendarCheck size={40} color={COLORS.textMuted} strokeWidth={1.4} style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 6px 0' }}>Em breve</h3>
          <p style={{ fontSize: '13px', color: COLORS.textSecondary, margin: '0 auto', maxWidth: '380px' }}>
            Aqui vão aparecer os resumos das suas mentorias com PDFs, anotações e próximos passos.
          </p>
        </div>
      </Card>
    </div>
  );

  const views: Record<ViewId, React.ReactNode> = {
    dashboard: <DashboardView />,
    profile: <ProfileView />,
    instagram: <InstagramView />,
    meetings: <MeetingsView />,
  };

  return (
    <div style={{ background: COLORS.bg, color: COLORS.textPrimary, minHeight: '100vh', display: 'flex', fontFamily: 'inherit' }}>
      <div style={{ display: 'block' }} className="mp-desktop-sidebar">
        <Sidebar />
      </div>

      <div className="mp-mobile-sidebar">
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
        )}
        <Sidebar mobile />
      </div>

      <main style={{ flex: 1, minWidth: 0 }}>
        <header className="mp-mobile-header" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${COLORS.border}`, background: COLORS.surface, position: 'sticky', top: 0, zIndex: 30 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: COLORS.textPrimary, cursor: 'pointer', padding: '4px' }}>
            <MenuIcon size={22} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={14} color="#fff" strokeWidth={2.2} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700 }}>Mentor Pro</span>
          </div>
          <div style={{ width: '30px' }} />
        </header>

        <div style={{ padding: '40px 32px', maxWidth: '1100px' }}>
          {views[view]}
        </div>
      </main>

    </div>
  );
}
