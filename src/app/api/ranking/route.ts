/**
 * GET /api/ranking
 *
 * Devuelve el ranking general de participantes ordenado por:
 * 1. Puntos totales (descendente)
 * 2. Mayor cantidad de partidos con 5 puntos (desempate)
 * 3. Mayor cantidad de partidos con acierto de resultado (desempate)
 * 4. Orden alfabético por nombre
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface RankingEntry {
  posicion: number;
  participante_id: number;
  nombre: string;
  puntos_totales: number;
  puntos_octavos: number;
  puntos_cuartos: number;
  puntos_bonus: number;
  partidos_perfectos: number;
  aciertos_resultado: number;
  partidos_jugados: number;
}

export async function GET() {
  try {
    // 1. Obtener bonus config y predicciones
    const [configBonus, prediccionesBonus] = await Promise.all([
      prisma.configuracionBonus.findMany(),
      prisma.prediccionBonus.findMany(),
    ]);

    const realMap: Record<string, string> = {};
    for (const c of configBonus) realMap[c.tipo] = c.valor.toLowerCase();

    const PUNTOS_BONUS: Record<string, number> = { CAMPEON: 4, SUB_CAMPEON: 3, GOLEADOR: 2 };

    // Map participante_id → puntos bonus
    const bonusPorParticipante: Record<number, number> = {};
    for (const pb of prediccionesBonus) {
      const real = realMap[pb.tipo];
      if (real && pb.valor.toLowerCase() === real) {
        bonusPorParticipante[pb.participante_id] = (bonusPorParticipante[pb.participante_id] || 0) + (PUNTOS_BONUS[pb.tipo] || 0);
      }
    }

    // 2. Obtener todos los participantes con sus puntajes
    const participantes = await prisma.participante.findMany({
      include: {
        puntajePartidos: {
          include: {
            partido: true,
          },
        },
      },
    });

    // 3. Calcular ranking
    const ranking: Omit<RankingEntry, 'posicion'>[] = participantes.map((p) => {
      const puntosTotales = p.puntajePartidos.reduce((sum, pp) => sum + pp.puntos, 0);
      const puntosOctavos = p.puntajePartidos
        .filter((pp) => pp.partido.ronda === 'OCTAVOS')
        .reduce((sum, pp) => sum + pp.puntos, 0);
      const puntosCuartos = p.puntajePartidos
        .filter((pp) => pp.partido.ronda === 'CUARTOS')
        .reduce((sum, pp) => sum + pp.puntos, 0);
      const puntosBonus = bonusPorParticipante[p.id] || 0;
      const partidosPerfectos = p.puntajePartidos.filter((pp) => pp.puntos === 5).length;
      const aciertosResultado = p.puntajePartidos.filter((pp) => pp.acierto_resultado).length;

      return {
        participante_id: p.id,
        nombre: p.nombre,
        puntos_totales: puntosTotales + puntosBonus,
        puntos_octavos: puntosOctavos,
        puntos_cuartos: puntosCuartos,
        puntos_bonus: puntosBonus,
        partidos_perfectos: partidosPerfectos,
        aciertos_resultado: aciertosResultado,
        partidos_jugados: p.puntajePartidos.length,
      };
    });

    // Ordenar: primero por puntaje, luego alfabéticamente
    ranking.sort((a, b) => {
      if (b.puntos_totales !== a.puntos_totales) {
        return b.puntos_totales - a.puntos_totales;
      }
      return a.nombre.localeCompare(b.nombre, 'es');
    });

    // Agregar posición
    const rankingConPosicion: RankingEntry[] = ranking.map((entry, index) => ({
      posicion: index + 1,
      ...entry,
    }));

    return NextResponse.json(rankingConPosicion);
  } catch (error) {
    console.error('Error al obtener ranking:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
