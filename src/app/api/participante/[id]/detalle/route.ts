/**
 * GET /api/participante/[id]/detalle
 *
 * Devuelve el detalle completo de un participante:
 * - Información del participante
 * - Todos sus pronósticos con resultado real (si existe) y puntos
 * - Estadísticas acumuladas
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const participanteId = parseInt(id, 10);

    if (isNaN(participanteId)) {
      return NextResponse.json(
        { error: 'ID de participante inválido' },
        { status: 400 }
      );
    }

    // Obtener participante con pronósticos y puntajes
    const participante = await prisma.participante.findUnique({
      where: { id: participanteId },
      include: {
        pronosticos: {
          include: {
            partido: true,
          },
          orderBy: {
            partido: {
              fecha: 'asc',
            },
          },
        },
        puntajePartidos: true,
      },
    });

    if (!participante) {
      return NextResponse.json(
        { error: 'Participante no encontrado' },
        { status: 404 }
      );
    }

    // Construir detalle por partido
    const detalle = participante.pronosticos.map((pronostico) => {
      const puntaje = participante.puntajePartidos.find(
        (pp) => pp.partido_id === pronostico.partido_id
      );

      return {
        partido_id: pronostico.partido.id,
        fecha: pronostico.partido.fecha,
        equipo_local: pronostico.partido.equipo_local,
        equipo_visitante: pronostico.partido.equipo_visitante,
        estado: pronostico.partido.estado,
        // Pronóstico
        pronostico_local: pronostico.goles_local_pronostico,
        pronostico_visitante: pronostico.goles_visitante_pronostico,
        // Resultado real (null si pendiente)
        resultado_local: pronostico.partido.goles_local_real,
        resultado_visitante: pronostico.partido.goles_visitante_real,
        // Puntos (null si pendiente)
        puntos: puntaje?.puntos ?? null,
        acierto_resultado: puntaje?.acierto_resultado ?? null,
        acierto_local: puntaje?.acierto_local ?? null,
        acierto_visitante: puntaje?.acierto_visitante ?? null,
      };
    });

    // Estadísticas
    const puntajesTotales = participante.puntajePartidos;
    const stats = {
      puntos_totales: puntajesTotales.reduce((sum, pp) => sum + pp.puntos, 0),
      partidos_jugados: puntajesTotales.length,
      partidos_perfectos: puntajesTotales.filter((pp) => pp.puntos === 5).length,
      aciertos_resultado: puntajesTotales.filter((pp) => pp.acierto_resultado).length,
      aciertos_local: puntajesTotales.filter((pp) => pp.acierto_local).length,
      aciertos_visitante: puntajesTotales.filter((pp) => pp.acierto_visitante).length,
      promedio_puntos: puntajesTotales.length > 0
        ? Math.round((puntajesTotales.reduce((sum, pp) => sum + pp.puntos, 0) / puntajesTotales.length) * 100) / 100
        : 0,
    };

    return NextResponse.json({
      participante: {
        id: participante.id,
        nombre: participante.nombre,
        email: participante.email,
      },
      stats,
      detalle,
    });
  } catch (error) {
    console.error('Error al obtener detalle de participante:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
