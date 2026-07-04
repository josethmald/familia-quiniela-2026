import { PrismaClient } from '@prisma/client';
import { calculatePoints } from '../src/lib/scoring';

const prisma = new PrismaClient();

interface Prediccion {
  matchId: number;
  local: number;
  visitante: number;
}

const predicciones: Prediccion[] = [
  { matchId: 73, local: 1, visitante: 2 },  // Sudáfrica vs Canadá
  { matchId: 76, local: 3, visitante: 1 },  // Brasil vs Japón
  { matchId: 74, local: 2, visitante: 0 },  // Alemania vs Paraguay
  { matchId: 75, local: 2, visitante: 1 },  // Países Bajos vs Marruecos
  { matchId: 78, local: 1, visitante: 2 },  // Costa de Marfil vs Noruega
  { matchId: 77, local: 3, visitante: 1 },  // Francia vs Suecia
  { matchId: 79, local: 2, visitante: 1 },  // México vs Ecuador
  { matchId: 80, local: 3, visitante: 0 },  // Inglaterra vs RD Congo
  { matchId: 82, local: 2, visitante: 1 },  // Bélgica vs Senegal
  { matchId: 81, local: 2, visitante: 0 },  // Estados Unidos vs Bosnia H
  { matchId: 84, local: 3, visitante: 1 },  // España vs Austria
  { matchId: 83, local: 2, visitante: 1 },  // Portugal vs Croacia
  { matchId: 85, local: 2, visitante: 0 },  // Suiza vs Argelia
  { matchId: 88, local: 1, visitante: 0 },  // Australia vs Egipto
  { matchId: 86, local: 3, visitante: 0 },  // Argentina vs Cabo Verde
  { matchId: 87, local: 2, visitante: 1 },  // Colombia vs Ghana
];

async function main() {
  const participante = await prisma.participante.findFirst({
    where: { nombre: 'Gabriel' },
  });
  if (!participante) {
    console.error('❌ No se encontró a Gabriel');
    process.exit(1);
  }
  console.log(`✏️  Actualizando pronósticos de Gabriel (id: ${participante.id})\n`);

  let actualizados = 0;
  let recalculados = 0;

  for (const p of predicciones) {
    // Actualizar pronóstico
    await prisma.pronostico.update({
      where: {
        participante_id_partido_id: {
          participante_id: participante.id,
          partido_id: p.matchId,
        },
      },
      data: {
        goles_local_pronostico: p.local,
        goles_visitante_pronostico: p.visitante,
      },
    });
    actualizados++;
    console.log(`  ✅ Partido ${p.matchId}: ${p.local} - ${p.visitante}`);

    // Si el partido está FINALIZADO, recalcular puntaje
    const partido = await prisma.partido.findUnique({ where: { id: p.matchId } });
    if (partido?.estado === 'FINALIZADO') {
      const score = calculatePoints(
        p.local,
        p.visitante,
        partido.goles_local_real!,
        partido.goles_visitante_real!,
      );

      await prisma.puntajePartido.upsert({
        where: {
          participante_id_partido_id: {
            participante_id: participante.id,
            partido_id: p.matchId,
          },
        },
        update: {
          puntos: score.puntos,
          acierto_resultado: score.aciertoResultado,
          acierto_local: score.aciertoLocal,
          acierto_visitante: score.aciertoVisitante,
        },
        create: {
          participante_id: participante.id,
          partido_id: p.matchId,
          puntos: score.puntos,
          acierto_resultado: score.aciertoResultado,
          acierto_local: score.aciertoLocal,
          acierto_visitante: score.aciertoVisitante,
        },
      });
      recalculados++;
      console.log(`     └── 🔄 Recalculado: ${score.puntos} pts (resultado: ${score.aciertoResultado ? '✅' : '❌'}, local: ${score.aciertoLocal ? '🟢' : '🔴'}, visitante: ${score.aciertoVisitante ? '🟢' : '🔴'})`);
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   Pronósticos actualizados: ${actualizados}`);
  console.log(`   Puntajes recalculados: ${recalculados}`);
  console.log(`\n✅ Listo. Recarga la app para ver los cambios.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
