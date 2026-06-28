/**
 * GET /api/partidos/pendientes
 *
 * Devuelve la lista de partidos con estado PENDIENTE,
 * ordenados por fecha ascendente.
 * Usado por el formulario del administrador para seleccionar qué partido cargar.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const partidos = await prisma.partido.findMany({
      where: {
        estado: 'PENDIENTE',
      },
      orderBy: {
        fecha: 'asc',
      },
      select: {
        id: true,
        fecha: true,
        equipo_local: true,
        equipo_visitante: true,
        estado: true,
      },
    });

    return NextResponse.json(partidos);
  } catch (error) {
    console.error('Error al obtener partidos pendientes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
