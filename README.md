# Quiniela Mundial 2026 🏆

Aplicación web para gestionar una quiniela privada del Mundial de Fútbol FIFA 2026. Permite visualizar el ranking general en tiempo real, consultar reportes diarios por jornada y ver el detalle de cada participante. Desarrollada según la Especificación de Requisitos de Software (SRS) v3.0.

## Características

- 📊 **Ranking General:** Tabla de posiciones con cálculo de puntos automático y reglas de desempate.
- 📅 **Reporte Diario:** Puntos obtenidos por jornada con desglose por partido.
- 👤 **Detalle de Participante:** Historial completo de pronósticos vs resultados reales.
- ⚙️ **Panel de Administración:** Interfaz protegida para cargar resultados de partidos.
- ⚡ **Tiempo Real:** Actualización automática (polling cada 30s) sin recargar la página.
- 🎨 **Diseño Premium:** Tema oscuro inspirado en la copa del mundo con efectos glassmorphism.

## Tecnologías

- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript
- **ORM:** Prisma
- **Base de Datos:** PostgreSQL
- **Estilos:** Tailwind CSS

## Requisitos Previos

- Node.js 18+ o superior
- PostgreSQL (puedes usar Docker con el archivo incluido)

## Configuración y Ejecución Local

1. **Clonar e instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   Copia `.env.example` a `.env` y configura tus variables.
   ```bash
   cp .env.example .env
   ```

3. **Base de datos (Opcional - Docker):**
   Si no tienes PostgreSQL instalado, puedes levantar una instancia con Docker:
   ```bash
   docker compose up -d
   ```

4. **Inicializar Base de Datos:**
   Sincroniza el esquema de Prisma con tu base de datos:
   ```bash
   npm run db:push
   ```

5. **Cargar datos de prueba (Seed):**
   Esto cargará participantes, partidos y pronósticos de ejemplo (como indica el SRS):
   ```bash
   npm run db:seed
   ```

6. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Panel de Administración

Para acceder al panel de carga de resultados, debes ir a la ruta `/admin/resultados` incluyendo el token configurado en tu `.env` (variable `ADMIN_SECRET`).

**Ejemplo:**
`http://localhost:3000/admin/resultados?token=mi_token_secreto_2026`

Una vez accedas con el token correcto por primera vez, se guardará una cookie en tu navegador por 24 horas y podrás acceder directamente a `/admin/resultados` sin el parámetro en la URL.

## Estructura del Proyecto

- `src/app/` - Páginas de Next.js (Routing) y API endpoints.
- `src/components/` - Componentes reutilizables de UI.
- `src/lib/` - Lógica de negocio (Cálculo de puntos, Auth, Instancia de Prisma).
- `prisma/` - Esquema de base de datos y script de datos iniciales (seed).

## Comandos Útiles

- `npm run db:studio` - Abre Prisma Studio para ver la base de datos gráficamente.
- `npm run db:reset` - Reinicia la base de datos y vuelve a cargar los datos iniciales.
- `npm run build` - Construye la aplicación para producción.
