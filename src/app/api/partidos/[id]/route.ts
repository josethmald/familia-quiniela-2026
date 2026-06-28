import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const partidoId = parseInt(id, 10);
    if (isNaN(partidoId)) {
      return NextResponse.json({ error: 'ID de partido inválido' }, { status: 400 });
    }

    const partido = await prisma.partido.findUnique({
      where: { id: partidoId },
      include: {
        pronosticos: {
          include: {
            participante: {
              select: { nombre: true, id: true }
            }
          }
        },
        puntajePartidos: true
      }
    });

    if (!partido) {
      return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 });
    }

    // Map predictions with points (if any)
    const predictionsWithPoints = partido.pronosticos.map(pronostico => {
      const puntaje = partido.puntajePartidos.find(p => p.participante_id === pronostico.participante_id);
      return {
        participante_id: pronostico.participante_id,
        nombre: pronostico.participante.nombre,
        goles_local_pronostico: pronostico.goles_local_pronostico,
        goles_visitante_pronostico: pronostico.goles_visitante_pronostico,
        puntos: puntaje ? puntaje.puntos : 0,
        acierto_resultado: puntaje ? puntaje.acierto_resultado : false,
        acierto_local: puntaje ? puntaje.acierto_local : false,
        acierto_visitante: puntaje ? puntaje.acierto_visitante : false,
      };
    });

    // Ordenar por nombre alfabéticamente
    predictionsWithPoints.sort((a, b) => a.nombre.localeCompare(b.nombre));

    return NextResponse.json({
      partido: {
        id: partido.id,
        equipo_local: partido.equipo_local,
        equipo_visitante: partido.equipo_visitante,
        fecha: partido.fecha,
        estado: partido.estado,
        goles_local_real: partido.goles_local_real,
        goles_visitante_real: partido.goles_visitante_real,
      },
      pronosticos: predictionsWithPoints
    });

  } catch (error) {
    console.error('Error fetching partido details:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
