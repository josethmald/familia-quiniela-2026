/**
 * GET /api/reporte-diario?fecha=YYYY-MM-DD
 *
 * Devuelve el reporte de puntos por jornada (fecha).
 * Incluye puntos totales del día por participante y desglose por partido.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const fechaParam = request.nextUrl.searchParams.get('fecha');

    if (!fechaParam) {
      return NextResponse.json(
        { error: 'Parámetro "fecha" requerido (formato YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    // Validar formato de fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fechaParam)) {
      return NextResponse.json(
        { error: 'Formato de fecha inválido. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Definir rango del día (inicio y fin)
    const fechaInicio = new Date(`${fechaParam}T00:00:00Z`);
    const fechaFin = new Date(`${fechaParam}T23:59:59.999Z`);

    // Obtener partidos finalizados de esa fecha
    const partidosDelDia = await prisma.partido.findMany({
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
        estado: 'FINALIZADO',
      },
      include: {
        puntajePartidos: {
          include: {
            participante: true,
          },
        },
      },
      orderBy: {
        fecha: 'asc',
      },
    });

    // Agrupar puntos por participante
    const puntosPorParticipante: Record<
      number,
      {
        participante_id: number;
        nombre: string;
        puntos_dia: number;
        partidos_perfectos: number;
        desglose: {
          partido_id: number;
          equipo_local: string;
          equipo_visitante: string;
          goles_local_real: number | null;
          goles_visitante_real: number | null;
          puntos: number;
          acierto_resultado: boolean;
          acierto_local: boolean;
          acierto_visitante: boolean;
        }[];
      }
    > = {};

    // Obtener todos los participantes para incluir a los que tienen 0 puntos
    const todosParticipantes = await prisma.participante.findMany();

    for (const participante of todosParticipantes) {
      puntosPorParticipante[participante.id] = {
        participante_id: participante.id,
        nombre: participante.nombre,
        puntos_dia: 0,
        partidos_perfectos: 0,
        desglose: [],
      };
    }

    // Llenar con datos reales
    for (const partido of partidosDelDia) {
      for (const puntaje of partido.puntajePartidos) {
        const entry = puntosPorParticipante[puntaje.participante_id];
        if (entry) {
          entry.puntos_dia += puntaje.puntos;
          if (puntaje.puntos === 5) entry.partidos_perfectos++;
          entry.desglose.push({
            partido_id: partido.id,
            equipo_local: partido.equipo_local,
            equipo_visitante: partido.equipo_visitante,
            goles_local_real: partido.goles_local_real,
            goles_visitante_real: partido.goles_visitante_real,
            puntos: puntaje.puntos,
            acierto_resultado: puntaje.acierto_resultado,
            acierto_local: puntaje.acierto_local,
            acierto_visitante: puntaje.acierto_visitante,
          });
        }
      }
    }

    // Convertir a array y ordenar por puntos del día (descendente)
    const reporte = Object.values(puntosPorParticipante).sort(
      (a, b) => b.puntos_dia - a.puntos_dia
    );

    // Info de los partidos del día
    const partidosInfo = partidosDelDia.map((p) => ({
      id: p.id,
      equipo_local: p.equipo_local,
      equipo_visitante: p.equipo_visitante,
      goles_local_real: p.goles_local_real,
      goles_visitante_real: p.goles_visitante_real,
      fecha: p.fecha,
    }));

    return NextResponse.json({
      fecha: fechaParam,
      partidos_finalizados: partidosDelDia.length,
      partidos: partidosInfo,
      reporte,
    });
  } catch (error) {
    console.error('Error al generar reporte diario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
