/**
 * POST /api/resultados
 *
 * Carga el resultado real de un partido (solo administrador).
 * Al guardar:
 * 1. Valida autenticación del admin
 * 2. Valida que el partido exista y esté PENDIENTE
 * 3. Valida que los goles sean enteros >= 0 y <= 15
 * 4. Actualiza el partido con resultado y estado FINALIZADO
 * 5. Calcula puntos para todos los participantes con pronóstico
 * 6. Almacena los puntos en PuntajePartido
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateAdminToken } from '@/lib/auth';
import { calculatePoints } from '@/lib/scoring';

export async function POST(request: NextRequest) {
  try {
    // 1. Validar autenticación del administrador
    if (!validateAdminToken(request)) {
      return NextResponse.json(
        { error: 'No autorizado. Proporcione un token de administrador válido.' },
        { status: 401 }
      );
    }

    // 2. Parsear body
    const body = await request.json();
    const { partidoId, goles_local, goles_visitante } = body;

    // 3. Validaciones de campos
    if (partidoId === undefined || goles_local === undefined || goles_visitante === undefined) {
      return NextResponse.json(
        { error: 'Campos requeridos: partidoId, goles_local, goles_visitante' },
        { status: 400 }
      );
    }

    // Validar que los goles sean enteros >= 0 y <= 15
    if (
      !Number.isInteger(goles_local) ||
      !Number.isInteger(goles_visitante) ||
      goles_local < 0 ||
      goles_visitante < 0 ||
      goles_local > 15 ||
      goles_visitante > 15
    ) {
      return NextResponse.json(
        { error: 'Los goles deben ser enteros entre 0 y 15' },
        { status: 400 }
      );
    }

    // 4. Verificar que el partido existe
    const partido = await prisma.partido.findUnique({
      where: { id: partidoId },
    });

    if (!partido) {
      return NextResponse.json(
        { error: 'Partido no encontrado' },
        { status: 404 }
      );
    }

    // 5. Verificar que el partido esté PENDIENTE
    if (partido.estado === 'FINALIZADO') {
      return NextResponse.json(
        { error: 'Este partido ya ha sido finalizado. No se puede modificar el resultado.' },
        { status: 400 }
      );
    }

    // 6. Actualizar partido con resultado real y cambiar estado
    await prisma.partido.update({
      where: { id: partidoId },
      data: {
        goles_local_real: goles_local,
        goles_visitante_real: goles_visitante,
        estado: 'FINALIZADO',
      },
    });

    // 7. Obtener todos los pronósticos para este partido
    const pronosticos = await prisma.pronostico.findMany({
      where: { partido_id: partidoId },
      include: {
        participante: true,
      },
    });

    // 8. Calcular y almacenar puntos para cada participante
    const puntajesCreados = [];
    for (const pronostico of pronosticos) {
      const score = calculatePoints(
        pronostico.goles_local_pronostico,
        pronostico.goles_visitante_pronostico,
        goles_local,
        goles_visitante
      );

      const puntaje = await prisma.puntajePartido.create({
        data: {
          participante_id: pronostico.participante_id,
          partido_id: partidoId,
          puntos: score.puntos,
          acierto_resultado: score.aciertoResultado,
          acierto_local: score.aciertoLocal,
          acierto_visitante: score.aciertoVisitante,
        },
      });

      puntajesCreados.push({
        participante: pronostico.participante.nombre,
        puntos: score.puntos,
        acierto_resultado: score.aciertoResultado,
        acierto_local: score.aciertoLocal,
        acierto_visitante: score.aciertoVisitante,
      });
    }

    return NextResponse.json({
      message: 'Resultado cargado y puntos calculados',
      partidoId,
      resultado: `${partido.equipo_local} ${goles_local} - ${goles_visitante} ${partido.equipo_visitante}`,
      participantes_calculados: puntajesCreados.length,
      detalle: puntajesCreados,
    });
  } catch (error) {
    console.error('Error al cargar resultado:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
