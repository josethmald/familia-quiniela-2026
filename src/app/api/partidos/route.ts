import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const partidos = await prisma.partido.findMany({
      orderBy: { fecha: 'asc' },
    });

    return NextResponse.json(partidos);
  } catch (error) {
    console.error('Error fetching partidos:', error);
    return NextResponse.json(
      { error: 'Error al obtener la lista de partidos' },
      { status: 500 }
    );
  }
}
