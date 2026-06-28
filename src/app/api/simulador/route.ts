import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculatePoints } from '@/lib/scoring';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const partidoIdStr = request.nextUrl.searchParams.get('partidoId');
    const golesLocalStr = request.nextUrl.searchParams.get('goles_local');
    const golesVisitanteStr = request.nextUrl.searchParams.get('goles_visitante');

    if (!partidoIdStr || golesLocalStr === null || golesVisitanteStr === null) {
      return NextResponse.json(
        { error: 'Parámetros requeridos: partidoId, goles_local, goles_visitante' },
        { status: 400 }
      );
    }

    const partidoId = parseInt(partidoIdStr, 10);
    const golesLocal = parseInt(golesLocalStr, 10);
    const golesVisitante = parseInt(golesVisitanteStr, 10);

    if (isNaN(partidoId) || isNaN(golesLocal) || isNaN(golesVisitante)) {
      return NextResponse.json(
        { error: 'Los parámetros deben ser números enteros' },
        { status: 400 }
      );
    }

    const partido = await prisma.partido.findUnique({
      where: { id: partidoId },
      include: {
        pronosticos: {
          include: {
            participante: {
              select: { id: true, nombre: true },
            },
          },
          orderBy: {
            participante: { nombre: 'asc' },
          },
        },
      },
    });

    if (!partido) {
      return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 });
    }

    // Obtener puntos actuales acumulados de todos los participantes
    const puntosActuales = await prisma.puntajePartido.groupBy({
      by: ['participante_id'],
      _sum: { puntos: true },
    });
    const puntosMap = new Map<number, number>();
    for (const p of puntosActuales) {
      puntosMap.set(p.participante_id, p._sum.puntos ?? 0);
    }

    const resultados = partido.pronosticos.map((p) => {
      const score = calculatePoints(
        p.goles_local_pronostico,
        p.goles_visitante_pronostico,
        golesLocal,
        golesVisitante
      );

      const puntos_actuales = puntosMap.get(p.participante_id) ?? 0;

      return {
        participante_id: p.participante_id,
        nombre: p.participante.nombre,
        pronostico_local: p.goles_local_pronostico,
        pronostico_visitante: p.goles_visitante_pronostico,
        puntos: score.puntos,
        puntos_actuales,
        puntos_proyectados: puntos_actuales + score.puntos,
        acierto_resultado: score.aciertoResultado,
        acierto_local: score.aciertoLocal,
        acierto_visitante: score.aciertoVisitante,
      };
    });

    const stats = {
      total_participantes: resultados.length,
      puntaje_promedio: resultados.length > 0
        ? (resultados.reduce((s, r) => s + r.puntos, 0) / resultados.length).toFixed(2)
        : '0',
      perfectos: resultados.filter((r) => r.puntos === 5).length,
      cero_puntos: resultados.filter((r) => r.puntos === 0).length,
    };

    return NextResponse.json({
      partido: {
        id: partido.id,
        equipo_local: partido.equipo_local,
        equipo_visitante: partido.equipo_visitante,
        fecha: partido.fecha,
      },
      simulacion: {
        goles_local: golesLocal,
        goles_visitante: golesVisitante,
      },
      stats,
      resultados,
    });
  } catch (error) {
    console.error('Error en simulador:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
