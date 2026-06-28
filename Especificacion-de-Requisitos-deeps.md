# ESPECIFICACIÓN DE REQUISITOS DE SOFTWARE (SRS)
## Sistema de Quiniela – Mundial FIFA 2026

**Versión:** 3.0 (Fusión)  
**Fecha:** 2026-06-15  
**Estado:** Aprobado para desarrollo  
**Referencias:** IEEE 29148 (adaptado)

---

## 1. INTRODUCCIÓN

### 1.1 Propósito
Este documento define todos los requisitos funcionales, no funcionales, reglas de negocio, modelo de datos, APIs e interfaces de usuario para una aplicación web que administrará una quiniela privada del Mundial de Fútbol 2026. El documento servirá como guía única para el equipo de desarrollo (humano o IA).

### 1.2 Alcance
**Dentro del alcance:**
- Visualización de ranking general acumulado.
- Carga de resultados reales por parte de un administrador.
- Cálculo automático de puntos según pronósticos precargados.
- Reporte diario de puntos por jornada (fecha).
- Detalle de pronósticos vs resultados por participante (opcional).
- Actualización en tiempo real (sin recarga completa de página).

**Fuera del alcance:**
- Creación, edición o eliminación de participantes, partidos o pronósticos desde la interfaz web.
- Registro de usuarios (todos los visitantes ven la misma información).
- Gestión de múltiples quinielas o torneos.
- Integración con APIs externas de resultados deportivos.

**Carga de datos inicial:**  
Los participantes, el calendario de partidos y los pronósticos de cada participante para cada partido **deben ser cargados manualmente en la base de datos** (mediante script, herramienta de administración o migración inicial). La aplicación solo leerá esos datos, nunca permitirá modificarlos desde la UI.

### 1.3 Definiciones
| Término | Definición |
|---------|-------------|
| Participante | Persona que participa en la quiniela. Tiene un nombre único. |
| Partido | Encuentro entre dos selecciones (local y visitante), con fecha y hora. |
| Pronóstico | Predicción de un participante para un partido (goles local y visitante). |
| Resultado real | Marcador final oficial del partido. |
| Jornada | Conjunto de partidos que se disputan en una misma fecha (día calendario). |
| PuntajePartido | Puntos obtenidos por un participante en un partido específico (0-5). |
| Ranking general | Lista ordenada de participantes por puntaje total acumulado. |

---

## 2. DESCRIPCIÓN GENERAL

### 2.1 Perspectiva del producto
La aplicación es una web independiente construida con:
- **Frontend y Backend:** Next.js (App Router), TypeScript.
- **ORM:** Prisma.
- **Base de datos:** PostgreSQL.
- **Estilos:** Tailwind CSS (responsive, mobile first).

No requiere autenticación para los visitantes. Solo el administrador tiene acceso restringido a la carga de resultados.

### 2.2 Actores y roles
| Actor | Rol | Permisos |
|-------|-----|-----------|
| **Visitante** | Usuario sin autenticación | Ver ranking, reporte diario, detalle de participante |
| **Administrador** | Persona autorizada | Autenticación básica o token; puede cargar resultados reales |

### 2.3 Suposiciones y dependencias
- Los pronósticos y el calendario de partidos son precargados completamente **antes** del inicio del torneo.
- Cada partido tiene una fecha/hora única.
- No se modifican los pronósticos durante el mundial.
- Los resultados reales se cargan después de que cada partido finaliza.
- Se soporta hasta 100 participantes y 64 partidos (más que suficiente).

---

## 3. REGLAS DE NEGOCIO (Puntuación)

| Regla | Descripción | Puntos |
|-------|-------------|--------|
| **RN-01** | Acertar el ganador del partido (local o visitante) o el empate | +3 |
| **RN-02** | Acertar exactamente los goles del equipo local | +1 |
| **RN-03** | Acertar exactamente los goles del equipo visitante | +1 |
| **RN-04** | Puntaje máximo por partido | 5 |

**Fórmula de resultado:**  
- Ganador local: `real_local > real_visitante` y `pronostico_local > pronostico_visitante`.  
- Ganador visitante: `real_local < real_visitante` y `pronostico_local < pronostico_visitante`.  
- Empate: `real_local == real_visitante` y `pronostico_local == pronostico_visitante`.

**Ejemplos:**
| Real | Pronóstico | Aciertos | Puntos |
|------|------------|----------|--------|
| 2-1  | 3-2        | Ganador  | 3 |
| 2-1  | 2-0        | Ganador + goles local | 4 |
| 2-1  | 2-1        | Ganador + ambos goles | 5 |
| 0-0  | 1-1        | Empate | 3 |

---

## 4. REQUISITOS FUNCIONALES (RF)

### RF-01: Visualización de ranking general
- **Descripción:** Muestra tabla de posiciones con puntaje total acumulado de cada participante (solo partidos finalizados).
- **Orden:** Descendente por puntos.
- **Desempate:**
  1. Mayor cantidad de partidos con 5 puntos.
  2. Mayor cantidad de partidos con acierto de resultado (3 puntos).
  3. Orden alfabético por nombre.
- **Actualización:** Asíncrona sin recargar la página.

### RF-02: Carga de resultados reales (administrador)
- **Acceso:** Solo administrador autenticado (Basic Auth o token secreto en variable de entorno).
- **Forma:** Individual por partido (mínimo). Opcional: carga en lote (múltiples partidos).
- **Validaciones:** El partido debe estar en estado `PENDIENTE`. Goles enteros ≥ 0 (máximo razonable 15).
- **Proceso:** Al guardar → actualizar `Partido` con resultado y estado `FINALIZADO` → disparar cálculo de puntos para todos los participantes → almacenar en `PuntajePartido`.

### RF-03: Cálculo automático de puntos
- **Disparador:** Cuando un partido cambia a `FINALIZADO`.
- **Algoritmo:** Para cada participante con pronóstico en ese partido, evaluar reglas RN-01 a RN-03.
- **Persistencia:** Guardar en `PuntajePartido` (participante_id, partido_id, puntos, y detalles de aciertos).
- **Inmutabilidad:** Una vez calculado, no se modifica (salvo que se corrija el resultado, lo cual requiere funcionalidad extra no prioritaria).

### RF-04: Reporte diario por jornada
- **Entrada:** Selector de fecha (YYYY-MM-DD).
- **Salida:** Tabla con nombre del participante, puntos totales obtenidos en partidos de esa fecha (solo finalizados).
- **Opcional:** Desglose por partido (pronóstico, resultado real, puntos).

### RF-05: Detalle de participante (opcional pero recomendado)
- **Ruta:** `/participante/[id]`
- **Muestra:** Lista de todos los partidos con pronóstico del participante, resultado real (si existe) y puntos obtenidos.

### RF-06: Actualización en tiempo real
- La interfaz de ranking y reporte diario debe reflejar cambios inmediatamente después de cargar un resultado.
- **Técnica sugerida:** Fetch periódico (cada 10-30 segundos) o Server-Sent Events (más eficiente). No es obligatorio usar WebSockets.

### RF-07: Estados de partido
- `PENDIENTE`: Sin resultado cargado.
- `FINALIZADO`: Con resultado cargado, puntos calculados.
- No se puede cargar un resultado para un partido ya finalizado (a menos que se implemente corrección, fuera de alcance inicial).

---

## 5. REQUISITOS NO FUNCIONALES (RNF)

| ID | Categoría | Especificación |
|----|-----------|----------------|
| RNF-01 | Usabilidad | Responsive (Tailwind), funciona en móviles y escritorio. Textos en español. |
| RNF-02 | Rendimiento | Ranking para 100 participantes y 64 partidos < 2 segundos. Carga de resultado (recalculo) < 3 segundos. |
| RNF-03 | Seguridad | Ruta de administrador protegida (Basic Auth o token). Validación backend de goles. Sin SQL injection (Prisma). |
| RNF-04 | Mantenibilidad | Código en TypeScript, Prisma Migrations, lógica de negocio en servicios separados. |
| RNF-05 | Integridad | La tabla `PuntajePartido` almacena puntos históricos. No se recalculan partidos finalizados. |

---

## 6. MODELO DE DATOS

### 6.1 Tablas

#### Participante
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | Int | PK, autoincrement |
| nombre | String(100) | NOT NULL, UNIQUE |
| email | String(200) | NULL, UNIQUE (opcional) |
| created_at | DateTime | DEFAULT NOW() |

#### Partido
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | Int | PK, autoincrement |
| fecha | DateTime | NOT NULL |
| equipo_local | String(100) | NOT NULL |
| equipo_visitante | String(100) | NOT NULL |
| goles_local_real | Int | NULL |
| goles_visitante_real | Int | NULL |
| estado | Enum | NOT NULL, default 'PENDIENTE' |

#### Pronostico
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | Int | PK, autoincrement |
| participante_id | Int | FK -> Participante(id), NOT NULL |
| partido_id | Int | FK -> Partido(id), NOT NULL |
| goles_local_pronostico | Int | NOT NULL (>=0) |
| goles_visitante_pronostico | Int | NOT NULL (>=0) |
| UNIQUE(participante_id, partido_id) | - | - |

#### PuntajePartido
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | Int | PK, autoincrement |
| participante_id | Int | FK -> Participante(id), NOT NULL |
| partido_id | Int | FK -> Partido(id), NOT NULL |
| puntos | Int | NOT NULL (0-5) |
| acierto_resultado | Boolean | NOT NULL (si obtuvo 3 puntos) |
| acierto_local | Boolean | NOT NULL |
| acierto_visitante | Boolean | NOT NULL |
| calculado_en | DateTime | DEFAULT NOW() |
| UNIQUE(participante_id, partido_id) | - | - |

### 6.2 Índices recomendados
- `Partido.fecha`
- `Partido.estado`
- `Pronostico.participante_id`
- `Pronostico.partido_id`
- `PuntajePartido.participante_id`

### 6.3 Nota sobre carga inicial
Los datos de `Participante`, `Partido` y `Pronostico` deben ser insertados mediante un script de seeding (ej. `prisma/seed.ts`) o herramienta externa. La aplicación **no** provee formularios para ello.

---

## 7. API ENDPOINTS (Next.js Route Handlers)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|----------------|
| GET | `/api/ranking` | Lista de participantes con puntaje total | No |
| GET | `/api/partidos/pendientes` | Partidos con estado `PENDIENTE` (para selector de admin) | No (pero se filtra por uso interno) |
| GET | `/api/reporte-diario?fecha=YYYY-MM-DD` | Puntos por jornada | No |
| GET | `/api/participante/[id]/detalle` | Pronósticos y resultados de un participante | No |
| POST | `/api/resultados` | Cargar resultado de un partido | Sí (Basic Auth o token) |

### Detalle de POST `/api/resultados`
**Request body:**
```json
{
  "partidoId": 15,
  "goles_local": 2,
  "goles_visitante": 1
}
{ "message": "Resultado cargado y puntos calculados", "partidoId": 15 }

Errores posibles: 400 (partido ya finalizado o goles inválidos), 401 (no autenticado), 404 (partido no existe), 500.

8. INTERFACES DE USUARIO
8.1 Página principal – Ranking (/)
Tabla responsiva con columnas: Posición, Participante, Puntos totales.

Enlace a reporte diario y (opcional) a detalle de cada participante.

Actualización automática cada 30 segundos o mediante SSE.

8.2 Página de carga de resultados – solo administrador (/admin/resultados)
Protegida por autenticación básica (popup HTTP) o token en URL.

Selector de partido (extraído de /api/partidos/pendientes).

Campos: goles local, goles visitante.

Botón “Cargar resultado” → POST a /api/resultados.

Mensaje de éxito/error.

Después de cargar, el partido desaparece del selector.

8.3 Página de reporte diario (/reporte)
Date picker (input type="date").

Tabla con participantes y puntos de esa jornada.

Opcional: botón “Ver desglose” que muestra pronóstico vs resultado por partido.

8.4 (Opcional) Página de detalle de participante (/participante/[id])
Muestra todos los partidos (fecha, equipos), pronóstico, resultado real (si existe) y puntos.

8.5 Componentes compartidos
Navbar con enlaces a Ranking, Reporte diario y (si autenticado) Carga de resultados.

Loader y mensajes toast para feedback asíncrono.

9. RESTRICCIONES TECNOLÓGICAS
Framework: Next.js 14+ (App Router)

ORM: Prisma 5+

Base de datos: PostgreSQL 14+

Estilos: Tailwind CSS (sin frameworks adicionales)

Autenticación admin: Basic Auth mediante middleware de Next.js o variable de entorno ADMIN_SECRET. No se requiere registro de usuarios.

Despliegue: Vercel, servidor Node.js o cualquier hosting compatible.

10. CRITERIOS DE ACEPTACIÓN
ID	Criterio	Método de verificación
CA-01	El ranking muestra puntajes correctos según reglas de negocio.	Pruebas unitarias de cálculo + escenarios manuales.
CA-02	El administrador puede cargar un resultado y el partido cambia a FINALIZADO.	Prueba manual en entorno de desarrollo.
CA-03	Al cargar un resultado, los puntos se calculan y almacenan en PuntajePartido.	Verificar tabla en BD.
CA-04	El ranking se actualiza sin recargar la página (máximo 5 segundos después de carga).	Prueba de interfaz con dos navegadores.
CA-05	El reporte diario filtra por fecha y muestra solo partidos finalizados.	Probar con fechas distintas.
CA-06	No es posible cargar un resultado para un partido ya finalizado.	Intentar desde el formulario.
CA-07	La ruta /admin/resultados no es accesible sin autenticación.	Acceso directo sin credenciales → 401/403.
CA-08	La aplicación es responsive (vista móvil y escritorio).	Prueba con Chrome DevTools.
CA-09	Los datos iniciales (participantes, partidos, pronósticos) se cargan mediante script o seed, no desde la UI.	Revisar código: no hay formularios de creación.
CA-10	El cálculo de puntos para 100 participantes y 64 partidos no supera los 3 segundos.	Prueba de carga.
11. CONSIDERACIONES FUTURAS (Opcional)
Corrección de resultados (con auditoría).

Exportación de reportes a Excel/PDF.

Soporte para múltiples torneos.

Notificaciones por correo electrónico.

Integración con API de resultados en vivo.

12. APROBACIONES
Rol	Nombre	Firma	Fecha
Analista de sistemas	(Generado por IA)	-	2026-06-15
Product Owner	(Por definir)	-	-
Líder técnico	(Por definir)	-	-