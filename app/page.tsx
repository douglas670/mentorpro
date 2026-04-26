'use client';

import React, { useEffect, useState } from 'react';
import type { InstagramProfile, AccountInsights, TopPost } from '@/lib/instagram';

type TabId = 'home' | 'content' | 'instagram' | 'mentorship' | 'profile';

type IgData = {
  connected: true;
  profile: InstagramProfile;
  insights: AccountInsights;
  engagementRate: number;
  topPosts: TopPost[];
};

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'k';
  return String(n);
}

export default function MentorProApp() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [igData, setIgData] = useState<IgData | null>(null);
  const [igLoading, setIgLoading] = useState(true);
  const [igError, setIgError] = useState<string | null>(null);

  const ACCENT = '#3B82F6';
  const ACCENT_DARK = '#1E40AF';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get('ig_error');
    if (err) setIgError(decodeURIComponent(err));
    if (err || params.get('ig_connected')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    fetchIg();
  }, []);

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

  const instagramConnected = !!igData;

  const HomeScreen = () => (
    <div style={{ paddingTop: '20px', paddingBottom: '100px' }}>
      <div style={{ marginBottom: '30px' }}>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Bem-vindo de volta,</p>
        <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '10px 0 0 0' }}>
          {igData?.profile.name || igData?.profile.username || 'Carlos Silva'} 👋
        </h1>
      </div>

      {igError && (
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgb(239, 68, 68)', borderRadius: '12px', padding: '12px', marginBottom: '20px' }}>
          <p style={{ color: '#fca5a5', fontSize: '12px', fontWeight: 'bold' }}>⚠ Erro ao conectar Instagram: {igError}</p>
        </div>
      )}

      {instagramConnected && igData && (
        <div style={{ background: 'rgba(34, 197, 94, 0.2)', border: '1px solid rgb(34, 197, 94)', borderRadius: '12px', padding: '12px', marginBottom: '20px' }}>
          <p style={{ color: '#86efac', fontSize: '12px', fontWeight: 'bold' }}>✓ Instagram conectado: @{igData.profile.username}</p>
        </div>
      )}

      <div style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`, borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: '0 0 10px 0' }}>Mentoria 1:1</h2>
        <p style={{ fontSize: '14px', opacity: 0.9, color: '#fff', margin: '0 0 15px 0' }}>Quinta-feira, 30 de Abril • 14:00</p>
        <button style={{ background: '#fff', color: '#000', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Ver detalhes →</button>
      </div>

      {!instagramConnected ? (
        <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: '#d1d5db', margin: '0 0 10px 0' }}>📸 Instagram desconectado</p>
          <button onClick={() => setActiveTab('instagram')} style={{ color: ACCENT, fontSize: '12px', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}>Conectar agora →</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: '#18181b', borderRadius: '16px', padding: '15px', textAlign: 'center', border: '1px solid #27272a' }}>
            <p style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: '0 0 5px 0' }}>{formatNumber(igData!.profile.followers_count)}</p>
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Seguidores</p>
          </div>
          <div style={{ background: '#18181b', borderRadius: '16px', padding: '15px', textAlign: 'center', border: '1px solid #27272a' }}>
            <p style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: '0 0 5px 0' }}>{igData!.engagementRate}%</p>
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Engajamento</p>
          </div>
          <div style={{ background: '#18181b', borderRadius: '16px', padding: '15px', textAlign: 'center', border: '1px solid #27272a' }}>
            <p style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: '0 0 5px 0' }}>{formatNumber(igData!.insights.reach)}</p>
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Alcance</p>
          </div>
        </div>
      )}

      <div style={{ background: '#18181b', borderRadius: '16px', padding: '20px', border: '1px solid #27272a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Progresso</p>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: 0 }}>62%</h3>
          </div>
        </div>
        <div style={{ width: '100%', background: '#27272a', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
          <div style={{ height: '8px', borderRadius: '9999px', width: '62%', backgroundColor: ACCENT }}></div>
        </div>
        <p style={{ fontSize: '12px', color: '#9ca3af', margin: '10px 0 0 0' }}>8 de 13 módulos concluídos</p>
      </div>
    </div>
  );

  const InstagramScreen = () => {
    if (igLoading) {
      return (
        <div style={{ paddingTop: '40px', paddingBottom: '100px', textAlign: 'center', color: '#9ca3af' }}>
          ⏳ Carregando...
        </div>
      );
    }

    if (!instagramConnected || !igData) {
      return (
        <div style={{ paddingTop: '40px', paddingBottom: '100px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '30px' }}>Conectar Instagram</h1>
          <div style={{ fontSize: '64px', marginBottom: '30px' }}>📸</div>
          <div style={{ background: 'linear-gradient(to right, #18181b, #27272a)', borderRadius: '16px', padding: '24px', border: '1px solid #27272a', marginBottom: '30px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', marginBottom: '10px' }}>Sincronize seu Instagram</h2>
            <p style={{ fontSize: '14px', color: '#d1d5db', margin: 0 }}>Conecte sua conta para visualizar métricas em tempo real.</p>
          </div>
          <button onClick={handleConnectInstagram} style={{ width: '100%', padding: '15px', background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
            📸 Conectar com Instagram
          </button>
        </div>
      );
    }

    const { profile, insights, engagementRate, topPosts } = igData;

    return (
      <div style={{ paddingTop: '20px', paddingBottom: '100px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>Instagram Insights</h1>

        <div style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`, borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <p style={{ fontSize: '36px', fontWeight: 900, color: '#fff', margin: '0 0 10px 0' }}>{formatNumber(profile.followers_count)}</p>
          <p style={{ fontSize: '14px', opacity: 0.9, color: '#fff', margin: 0 }}>Seguidores totais • @{profile.username}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: '#18181b', borderRadius: '16px', padding: '15px', border: '1px solid #27272a' }}>
            <p style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: '0 0 5px 0' }}>{engagementRate}%</p>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Engajamento</p>
          </div>
          <div style={{ background: '#18181b', borderRadius: '16px', padding: '15px', border: '1px solid #27272a' }}>
            <p style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: '0 0 5px 0' }}>{formatNumber(insights.reach)}</p>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Alcance (28d)</p>
          </div>
          <div style={{ background: '#18181b', borderRadius: '16px', padding: '15px', border: '1px solid #27272a' }}>
            <p style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: '0 0 5px 0' }}>{formatNumber(profile.media_count)}</p>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Publicações</p>
          </div>
          <div style={{ background: '#18181b', borderRadius: '16px', padding: '15px', border: '1px solid #27272a' }}>
            <p style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: '0 0 5px 0' }}>{formatNumber(insights.impressions)}</p>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Impressões (28d)</p>
          </div>
        </div>

        {topPosts.length > 0 && (
          <div style={{ background: '#18181b', borderRadius: '16px', padding: '20px', border: '1px solid #27272a', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#fff', marginBottom: '15px' }}>Top posts da semana</h3>
            {topPosts.map((post, i) => (
              <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div style={{ background: '#27272a', borderRadius: '12px', padding: '12px', marginBottom: i < topPosts.length - 1 ? '10px' : 0, display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {post.thumbnail_url || post.media_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.thumbnail_url || post.media_url} alt="" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ fontSize: '24px' }}>📷</div>
                  )}
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '12px' }}>
                    <div><p style={{ color: '#9ca3af', fontSize: '10px', margin: 0, fontWeight: 'bold' }}>Likes</p><p style={{ color: '#fff', fontWeight: 'bold', margin: 0 }}>{formatNumber(post.like_count)}</p></div>
                    <div><p style={{ color: '#9ca3af', fontSize: '10px', margin: 0, fontWeight: 'bold' }}>Coment.</p><p style={{ color: '#fff', fontWeight: 'bold', margin: 0 }}>{formatNumber(post.comments_count)}</p></div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        <button onClick={handleDisconnectInstagram} style={{ width: '100%', padding: '12px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgb(153, 27, 27)', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>Desconectar Instagram</button>
      </div>
    );
  };

  const ContentScreen = () => (
    <div style={{ paddingTop: '20px', paddingBottom: '100px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>Conteúdos</h1>
      {[
        { emoji: '📈', title: 'Como triplicar seu faturamento em 90 dias', cat: 'Vendas', time: '24 min' },
        { emoji: '🎯', title: 'A arte de delegar: liberte seu tempo', cat: 'Gestão', time: '18 min' },
        { emoji: '🚀', title: 'Funil de Marketing que converte', cat: 'Marketing', time: '32 min' },
        { emoji: '🧠', title: 'Mindset de empresário milionário', cat: 'Mindset', time: '15 min' },
        { emoji: '💰', title: 'Precificação estratégica', cat: 'Vendas', time: '21 min' },
      ].map((content, i) => (
        <div key={i} style={{ background: '#18181b', borderRadius: '16px', padding: '16px', marginBottom: '12px', border: '1px solid #27272a', display: 'flex', gap: '12px' }}>
          <div style={{ fontSize: '32px' }}>{content.emoji}</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '10px', fontWeight: 'bold', color: ACCENT, textTransform: 'uppercase', margin: '0 0 5px 0' }}>{content.cat}</p>
            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', margin: '0 0 5px 0' }}>{content.title}</p>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>⏱️ {content.time}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const MentorshipScreen = () => (
    <div style={{ paddingTop: '20px', paddingBottom: '100px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>Mentoria</h1>

      <div style={{ background: '#18181b', borderRadius: '16px', padding: '16px', marginBottom: '20px', border: '1px solid #27272a' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#fff', marginBottom: '15px' }}>Próximas sessões</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`, borderRadius: '8px', padding: '12px', textAlign: 'center', minWidth: '60px', fontWeight: 'bold', color: '#fff' }}>30</div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', margin: '0 0 5px 0' }}>Mentoria 1:1</p>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Quinta • 14:00 - 15:00</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#18181b', borderRadius: '16px', padding: '16px', border: '1px solid #27272a' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#fff', marginBottom: '15px' }}>Metas do trimestre</h3>
        {[
          { label: 'Faturamento R$ 100k/mês', percent: 78 },
          { label: 'Time de 5 pessoas', percent: 60 },
          { label: '15k seguidores Instagram', percent: 83 },
        ].map((meta, i) => (
          <div key={i} style={{ marginBottom: i < 2 ? '15px' : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <p style={{ fontSize: '14px', color: '#fff', fontWeight: 'bold', margin: 0 }}>{meta.label}</p>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: ACCENT, margin: 0 }}>{meta.percent}%</p>
            </div>
            <div style={{ width: '100%', background: '#27272a', borderRadius: '9999px', height: '6px', overflow: 'hidden' }}>
              <div style={{ height: '6px', width: `${meta.percent}%`, backgroundColor: ACCENT }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ProfileScreen = () => {
    const initials = igData?.profile.name
      ? igData.profile.name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()
      : 'CS';
    return (
      <div style={{ paddingTop: '20px', paddingBottom: '100px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '20px', textAlign: 'center' }}>Perfil</h1>

        <div style={{ background: '#18181b', borderRadius: '16px', padding: '20px', border: '1px solid #27272a', textAlign: 'center', marginBottom: '20px' }}>
          {igData?.profile.profile_picture_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={igData.profile.profile_picture_url} alt="" style={{ width: '80px', height: '80px', margin: '0 auto 15px', borderRadius: '9999px', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '80px', height: '80px', margin: '0 auto 15px', borderRadius: '9999px', background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>{initials}</div>
          )}
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: '0 0 5px 0' }}>{igData?.profile.name || 'Carlos Silva'}</h2>
          <p style={{ color: '#9ca3af', margin: '0 0 15px 0' }}>{igData ? `@${igData.profile.username}` : 'CEO • Empresa Tech'}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#000', border: '1px solid #27272a', borderRadius: '9999px' }}>
            <span style={{ fontSize: '12px' }}>⭐</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>Plano Premium</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: '#18181b', borderRadius: '16px', padding: '15px', textAlign: 'center', border: '1px solid #27272a' }}>
            <p style={{ fontSize: '22px', fontWeight: 900, color: ACCENT, margin: '0 0 5px 0' }}>62%</p>
            <p style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>Jornada</p>
          </div>
          <div style={{ background: '#18181b', borderRadius: '16px', padding: '15px', textAlign: 'center', border: '1px solid #27272a' }}>
            <p style={{ fontSize: '22px', fontWeight: 900, color: ACCENT, margin: '0 0 5px 0' }}>24</p>
            <p style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>Sessões</p>
          </div>
          <div style={{ background: '#18181b', borderRadius: '16px', padding: '15px', textAlign: 'center', border: '1px solid #27272a' }}>
            <p style={{ fontSize: '22px', fontWeight: 900, color: ACCENT, margin: '0 0 5px 0' }}>{igData ? formatNumber(igData.profile.media_count) : '47'}</p>
            <p style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>{igData ? 'Posts IG' : 'Conteúdos'}</p>
          </div>
        </div>
      </div>
    );
  };

  const screens: Record<TabId, React.ReactNode> = {
    home: <HomeScreen />,
    content: <ContentScreen />,
    instagram: <InstagramScreen />,
    mentorship: <MentorshipScreen />,
    profile: <ProfileScreen />,
  };

  const tabs: { id: TabId; icon: string; label: string }[] = [
    { id: 'home', icon: '🏠', label: 'Início' },
    { id: 'content', icon: '📚', label: 'Conteúdos' },
    { id: 'instagram', icon: '📸', label: 'Insights' },
    { id: 'mentorship', icon: '📅', label: 'Mentoria' },
    { id: 'profile', icon: '👤', label: 'Perfil' },
  ];

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', paddingLeft: '20px', paddingRight: '20px' }}>
      {screens[activeTab]}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#18181b', borderTop: '1px solid #27272a', paddingBottom: '20px', paddingTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '100%' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <span style={{ fontSize: '24px' }}>{tab.icon}</span>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: activeTab === tab.id ? ACCENT : '#71717a' }}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
