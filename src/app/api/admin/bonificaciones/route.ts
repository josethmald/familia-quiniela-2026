import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateAdminToken } from '@/lib/auth';

export async function GET() {
  try {
    const [reales, predicciones] = await Promise.all([
      prisma.configuracionBonus.findMany(),
      prisma.prediccionBonus.findMany({
        include: { participante: true },
        orderBy: { participante: { nombre: 'asc' } },
      }),
    ]);

    const realMap: Record<string, string> = {};
    for (const r of reales) realMap[r.tipo] = r.valor;

    const prediccionesPorParticipante: Record<string, { campeon: string; subcampeon: string; goleador: string }> = {};
    for (const p of predicciones) {
      if (!prediccionesPorParticipante[p.participante.nombre]) {
        prediccionesPorParticipante[p.participante.nombre] = { campeon: '', subcampeon: '', goleador: '' };
      }
      if (p.tipo === 'CAMPEON') prediccionesPorParticipante[p.participante.nombre].campeon = p.valor;
      else if (p.tipo === 'SUB_CAMPEON') prediccionesPorParticipante[p.participante.nombre].subcampeon = p.valor;
      else if (p.tipo === 'GOLEADOR') prediccionesPorParticipante[p.participante.nombre].goleador = p.valor;
    }

    return NextResponse.json({ reales: realMap, predicciones: prediccionesPorParticipante });
  } catch (error) {
    console.error('Error al obtener bonificaciones:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!validateAdminToken(request)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { campeon, sub_campeon, goleador } = body;

    const upserts = [
      { tipo: 'CAMPEON', valor: campeon },
      { tipo: 'SUB_CAMPEON', valor: sub_campeon },
      { tipo: 'GOLEADOR', valor: goleador },
    ];

    for (const item of upserts) {
      if (item.valor && typeof item.valor === 'string' && item.valor.trim()) {
        await prisma.configuracionBonus.upsert({
          where: { tipo: item.tipo },
          update: { valor: item.valor.trim() },
          create: { tipo: item.tipo, valor: item.valor.trim() },
        });
      }
    }

    const [reales, predicciones] = await Promise.all([
      prisma.configuracionBonus.findMany(),
      prisma.prediccionBonus.findMany({
        include: { participante: true },
      }),
    ]);

    const realMap: Record<string, string> = {};
    for (const r of reales) realMap[r.tipo] = r.valor;

    const PUNTOS = { CAMPEON: 4, SUB_CAMPEON: 3, GOLEADOR: 2 };
    const resultadosBonus: Record<string, { puntos: number; detalle: Record<string, { predijo: string; acerto: boolean; puntos: number }> }> = {};

    for (const p of predicciones) {
      if (!resultadosBonus[p.participante.nombre]) {
        resultadosBonus[p.participante.nombre] = { puntos: 0, detalle: {} };
      }
      const real = realMap[p.tipo];
      const pts = real && p.valor.toLowerCase() === real.toLowerCase() ? PUNTOS[p.tipo as keyof typeof PUNTOS] : 0;
      resultadosBonus[p.participante.nombre].puntos += pts;
      resultadosBonus[p.participante.nombre].detalle[p.tipo] = {
        predijo: p.valor,
        acerto: pts > 0,
        puntos: pts,
      };
    }

    return NextResponse.json({ reales: realMap, resultados: resultadosBonus });
  } catch (error) {
    console.error('Error al guardar bonificaciones:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
