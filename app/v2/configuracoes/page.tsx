'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import {
  User as UserIcon,
  Palette,
  Bell,
  CreditCard,
  LogOut,
  Sun,
  Moon,
  Sparkles,
  Mail,
  Lock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Gerencie sua conta e preferências
        </p>
      </div>

      <div className="space-y-6">
        {/* Perfil */}
        <Section icon={UserIcon} title="Perfil" description="Como você aparece no Mentor Pro">
          <div className="flex flex-col sm:flex-row items-start gap-5 mb-5">
            <div className="flex flex-col items-center gap-2">
              <Avatar nome="Douglas Moraes" size="xl" />
              <Button variant="ghost" size="sm">Alterar foto</Button>
            </div>
            <div className="flex-1 grid sm:grid-cols-2 gap-3 w-full">
              <Input label="Nome" defaultValue="Douglas Moraes" />
              <Input label="E-mail" icon={Mail} defaultValue="douglas@ldxcapital.com.br" disabled hint="Conectado via Google" />
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Bio
                </label>
                <textarea
                  className="w-full rounded-lg border border-[var(--border-app)] bg-[var(--bg)] text-[var(--text-primary)] text-sm px-3 py-2 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                  rows={3}
                  defaultValue="Mentor de empresários · Estratégia & operações · LDX Capital"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-[var(--border-soft)]">
            <Button>Salvar alterações</Button>
          </div>
        </Section>

        {/* Aparência */}
        <Section icon={Palette} title="Aparência" description="Personalize como o app aparece">
          <p className="text-xs text-[var(--text-muted)] mb-3">Tema</p>
          {mounted && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', label: 'Claro', icon: Sun },
                { id: 'dark', label: 'Escuro', icon: Moon },
                { id: 'system', label: 'Sistema', icon: Sparkles },
              ].map(t => {
                const Icon = t.icon;
                const ativo = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors',
                      ativo
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'border-[var(--border-app)] hover:bg-[var(--surface-hover)]'
                    )}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.8} />
                    <span className="text-sm font-medium">{t.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </Section>

        {/* Notificações */}
        <Section icon={Bell} title="Notificações" description="Decida o que você quer receber">
          <div className="space-y-1">
            <Toggle
              label="E-mail diário com resumo do dia"
              hint="Receba às 8h, segunda a sexta"
              defaultChecked
            />
            <Toggle
              label="Lembrete antes de cada reunião"
              hint="15 minutos antes"
              defaultChecked
            />
            <Toggle
              label="Notificar quando mentorado completar uma meta"
              defaultChecked
            />
            <Toggle
              label="Resumo semanal de engajamento"
              hint="Toda segunda-feira"
            />
            <Toggle
              label="E-mails de marketing e novidades"
            />
          </div>
        </Section>

        {/* Plano / Cobrança */}
        <Section icon={CreditCard} title="Plano e cobrança" description="Sua assinatura atual">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-base font-semibold">Plano Pro</p>
                <Badge variant="success" size="sm">Ativo</Badge>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                R$ 97/mês · próxima cobrança em 15 de Maio
              </p>
            </div>
            <Button variant="secondary" size="sm">Gerenciar</Button>
          </div>
          <div className="grid sm:grid-cols-3 gap-2 pt-4 border-t border-[var(--border-soft)]">
            <PlanFeature label="Mentorados ilimitados" />
            <PlanFeature label="Integração com Instagram" />
            <PlanFeature label="Relatórios avançados" />
          </div>
        </Section>

        {/* Conta */}
        <Section icon={Lock} title="Conta" description="Ações sensíveis da sua conta">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-[var(--border-soft)]">
              <div>
                <p className="text-sm font-medium">Sair de todos os dispositivos</p>
                <p className="text-xs text-[var(--text-muted)]">Encerra todas as sessões ativas</p>
              </div>
              <Button variant="secondary" size="sm">
                <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
                Sair
              </Button>
            </div>
            <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-[var(--danger)]/20 bg-[var(--danger-soft)]/30">
              <div>
                <p className="text-sm font-medium text-[var(--danger)]">Excluir minha conta</p>
                <p className="text-xs text-[var(--text-secondary)]">Essa ação não pode ser desfeita</p>
              </div>
              <Button variant="danger" size="sm">Excluir</Button>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-9 h-9 shrink-0 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
            <Icon className="w-4 h-4" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight">{title}</h2>
            <p className="text-xs text-[var(--text-secondary)]">{description}</p>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function Toggle({
  label,
  hint,
  defaultChecked,
}: {
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  const [on, setOn] = React.useState(!!defaultChecked);
  return (
    <button
      onClick={() => setOn(!on)}
      className="w-full flex items-center justify-between gap-3 py-3 hover:bg-[var(--surface-hover)] -mx-3 px-3 rounded-lg transition-colors text-left"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        {hint && <p className="text-xs text-[var(--text-muted)] mt-0.5">{hint}</p>}
      </div>
      <span
        className={cn(
          'shrink-0 relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
          on ? 'bg-[var(--accent)]' : 'bg-[var(--surface-hover)] border border-[var(--border-app)]'
        )}
      >
        <span
          className={cn(
            'inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform',
            on ? 'translate-x-[18px]' : 'translate-x-1'
          )}
        />
      </span>
    </button>
  );
}

function PlanFeature({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
      <span className="w-4 h-4 rounded-full bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center text-[10px]">
        ✓
      </span>
      {label}
    </div>
  );
}
