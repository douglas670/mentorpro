import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

const UPDATABLE_STRINGS = [
  'nome', 'email', 'telefone', 'aniversario',
  'endereco', 'numero', 'complemento', 'cidade', 'bairro', 'cep', 'estado', 'pais',
  'empresaNome', 'empresaTempo', 'faturamentoMensal', 'funcionarios', 'produtoServico',
  'temProdutoDigital', 'comoGeraClientes', 'instagram', 'youtube', 'site', 'usaIA',
  'dificuldadeNegocio', 'dificuldadeLeads', 'maiorProblema', 'impedeEscalar',
  'ondeQuerChegar', 'expectativaMDX', 'faturamentoIdeal', 'diferencial', 'valorInegociavel',
  'especialidade', 'notas', 'status',
];

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await ctx.params;

  const mentorado = await prisma.mentorado.findFirst({ where: { id, mentorId: user.id } });
  if (!mentorado) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json(mentorado);
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await ctx.params;

  const existing = await prisma.mentorado.findFirst({ where: { id, mentorId: user.id } });
  if (!existing) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: 'invalid_body' }, { status: 400 });

  const data: Record<string, unknown> = {};
  for (const key of UPDATABLE_STRINGS) {
    if (key in body) {
      const value = body[key];
      if (value === null) data[key] = null;
      else if (typeof value === 'string') data[key] = value;
    }
  }
  if ('progresso' in body) {
    data.progresso = typeof body.progresso === 'number' ? body.progresso : null;
  }
  if ('dataInicio' in body) {
    data.dataInicio = body.dataInicio ? new Date(body.dataInicio as string) : null;
  }
  if ('dataProximaReuniao' in body) {
    data.dataProximaReuniao = body.dataProximaReuniao ? new Date(body.dataProximaReuniao as string) : null;
  }

  const updated = await prisma.mentorado.update({
    where: { id },
    data: data as Parameters<typeof prisma.mentorado.update>[0]['data'],
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await ctx.params;

  const existing = await prisma.mentorado.findFirst({ where: { id, mentorId: user.id } });
  if (!existing) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  await prisma.mentorado.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
