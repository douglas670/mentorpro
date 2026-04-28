import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, CheckCircle2, Mail, Clock } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function ConvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const mentorado = await prisma.mentorado.findUnique({
    where: { inviteToken: token },
    include: { mentor: true },
  });

  if (!mentorado) notFound();

  const primeiroNome = mentorado.nome.split(' ')[0];
  const mentorNome = mentorado.mentor.nome ?? 'seu mentor';

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] shadow-lg mb-5">
            <Sparkles className="w-7 h-7 text-white" strokeWidth={2.2} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Olá, {primeiroNome}!
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
            Você foi convidado por <strong className="text-[var(--text-primary)]">{mentorNome}</strong> para o
            <span className="font-semibold text-[var(--accent)]"> Mentor Pro</span>
            <br />— sua nova plataforma de mentoria.
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border-app)] rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold mb-4">Em breve você vai poder:</p>
          <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
            <Item icon={CheckCircle2}>Acompanhar suas metas e progresso</Item>
            <Item icon={Mail}>Trocar mensagens diretas com seu mentor</Item>
            <Item icon={Clock}>Ver suas próximas reuniões e o histórico</Item>
          </ul>

          <div className="mt-6 pt-5 border-t border-[var(--border-soft)]">
            <p className="text-xs text-[var(--text-muted)] text-center leading-relaxed">
              A criação de conta para mentorados será liberada em breve.
              <br />
              {mentorNome.split(' ')[0]} vai te avisar assim que estiver pronta.
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-xs text-[var(--text-muted)]">
          Não é {primeiroNome}?{' '}
          <Link href="/" className="text-[var(--accent)] hover:underline">
            Voltar
          </Link>
        </p>
      </div>
    </main>
  );
}

function Item({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" strokeWidth={2} />
      <span>{children}</span>
    </li>
  );
}
