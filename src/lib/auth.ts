/**
 * Autenticación del administrador
 *
 * Verifica el token secreto del administrador contra la variable de entorno ADMIN_SECRET.
 * Se utiliza tanto en el middleware como en los API endpoints protegidos.
 */

import { NextRequest } from 'next/server';

/**
 * Extrae y valida el token de administrador de la request.
 * Busca en: query param `token`, header `x-admin-token`, o header `Authorization: Bearer <token>`.
 *
 * @returns true si el token es válido, false en caso contrario
 */
export function validateAdminToken(request: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret) {
    console.error('ADMIN_SECRET no está configurado en las variables de entorno');
    return false;
  }

  // 1. Buscar en query params
  const tokenFromQuery = request.nextUrl.searchParams.get('token');
  if (tokenFromQuery === adminSecret) {
    return true;
  }

  // 2. Buscar en header personalizado
  const tokenFromHeader = request.headers.get('x-admin-token');
  if (tokenFromHeader === adminSecret) {
    return true;
  }

  // 3. Buscar en Authorization: Bearer <token>
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7);
    if (bearerToken === adminSecret) {
      return true;
    }
  }

  return false;
}

/**
 * Valida el token de administrador desde el body de un POST request o headers.
 * Para usar en API Route Handlers que no tienen acceso a query params fácilmente.
 */
export function validateAdminFromHeaders(request: NextRequest): boolean {
  return validateAdminToken(request);
}
