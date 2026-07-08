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
  partidos_perfectos: number;
  aciertos_resultado: number;
  partidos_jugados: number;
}

export async function GET() {
  try {
    // Obtener todos los participantes con sus puntajes
    const participantes = await prisma.participante.findMany({
      include: {
        puntajePartidos: {
          include: {
            partido: true,
          },
        },
      },
    });

    // Calcular ranking
    const ranking: Omit<RankingEntry, 'posicion'>[] = participantes.map((p) => {
      const puntosTotales = p.puntajePartidos.reduce((sum, pp) => sum + pp.puntos, 0);
      const puntosOctavos = p.puntajePartidos
        .filter((pp) => pp.partido.ronda === 'OCTAVOS')
        .reduce((sum, pp) => sum + pp.puntos, 0);
      const puntosCuartos = p.puntajePartidos
        .filter((pp) => pp.partido.ronda === 'CUARTOS')
        .reduce((sum, pp) => sum + pp.puntos, 0);
      const partidosPerfectos = p.puntajePartidos.filter((pp) => pp.puntos === 5).length;
      const aciertosResultado = p.puntajePartidos.filter((pp) => pp.acierto_resultado).length;

      return {
        participante_id: p.id,
        nombre: p.nombre,
        puntos_totales: puntosTotales,
        puntos_octavos: puntosOctavos,
        puntos_cuartos: puntosCuartos,
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
