import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const mentorados = await prisma.mentorado.findMany({
    where: { mentorId: user.id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(mentorados);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || typeof body.nome !== 'string' || !body.nome.trim()) {
    return NextResponse.json({ error: 'nome é obrigatório' }, { status: 400 });
  }

  const data: Record<string, unknown> = { mentorId: user.id, nome: body.nome.trim() };
  const optionalStrings = [
    'email', 'telefone', 'aniversario',
    'endereco', 'numero', 'complemento', 'cidade', 'bairro', 'cep', 'estado', 'pais',
    'empresaNome', 'empresaTempo', 'faturamentoMensal', 'funcionarios', 'produtoServico',
    'temProdutoDigital', 'comoGeraClientes', 'instagram', 'youtube', 'site', 'usaIA',
    'dificuldadeNegocio', 'dificuldadeLeads', 'maiorProblema', 'impedeEscalar',
    'ondeQuerChegar', 'expectativaMDX', 'faturamentoIdeal', 'diferencial', 'valorInegociavel',
    'especialidade', 'notas', 'status',
  ];
  for (const key of optionalStrings) {
    if (typeof body[key] === 'string' && (body[key] as string).length > 0) {
      data[key] = body[key];
    }
  }
  if (typeof body.progresso === 'number') data.progresso = body.progresso;

  const mentorado = await prisma.mentorado.create({ data: data as Parameters<typeof prisma.mentorado.create>[0]['data'] });
  return NextResponse.json(mentorado, { status: 201 });
}
