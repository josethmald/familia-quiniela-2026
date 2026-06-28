/**
 * Middleware — Protección de rutas de administrador
 *
 * Valida el token ADMIN_SECRET para todas las rutas bajo /admin/*.
 * Si el token no es válido, redirige a la página principal.
 */

import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir login sin autenticación
  if (pathname === '/admin' || pathname === '/admin/') {
    return NextResponse.next();
  }

  // Proteger el resto de rutas /admin/*
  if (pathname.startsWith('/admin/')) {
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret) {
      return NextResponse.redirect(new URL('/?error=config', request.url));
    }

    const tokenFromQuery = request.nextUrl.searchParams.get('token');
    const tokenFromCookie = request.cookies.get('admin_token')?.value;

    if (tokenFromQuery === adminSecret) {
      const response = NextResponse.next();
      response.cookies.set('admin_token', adminSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
      });
      return response;
    }

    if (tokenFromCookie === adminSecret) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/?error=unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
