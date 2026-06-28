import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = process.env.SITE_SECRET;

  if (!secret) {
    return NextResponse.json({ error: 'SITE_SECRET no configurado' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { token } = body;

    if (token === secret) {
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ valid: false }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }
}
