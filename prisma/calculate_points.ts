import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getResultSign(a: number, b: number): 'L' | 'V' | 'E' {
  if (a > b) return 'L';
  if (a < b) return 'V';
  return 'E';
}

function calculatePoints(
  gLocal: number, gVisitante: number,
  rLocal: number, rVisitante: number
): { puntos: number; aciertoResultado: boolean; aciertoLocal: boolean; aciertoVisitante: boolean } {
  let puntos = 0;
  const aciertoResultado = getResultSign(gLocal, gVisitante) === getResultSign(rLocal, rVisitante);
  if (aciertoResultado) puntos += 3;
  const aciertoLocal = gLocal === rLocal;
  if (aciertoLocal) puntos += 1;
  const aciertoVisitante = gVisitante === rVisitante;
  if (aciertoVisitante) puntos += 1;
  return { puntos: Math.min(puntos, 5), aciertoResultado, aciertoLocal, aciertoVisitante };
}

async function main() {
  // Clear all existing points
  await prisma.puntajePartido.deleteMany();
  console.log('🗑️ Puntajes anteriores eliminados\n');

  // Get all finalized matches
  const matches = await prisma.partido.findMany({
    where: { estado: 'FINALIZADO' },
  });

  console.log(`📊 ${matches.length} partidos finalizados\n`);

  let totalPuntos = 0;

  for (const match of matches) {
    const predictions = await prisma.pronostico.findMany({
      where: { partido_id: match.id },
    });

    if (predictions.length === 0) continue;

    for (const pred of predictions) {
      const score = calculatePoints(
        pred.goles_local_pronostico,
        pred.goles_visitante_pronostico,
        match.goles_local_real!,
        match.goles_visitante_real!
      );

      await prisma.puntajePartido.create({
        data: {
          participante_id: pred.participante_id,
          partido_id: match.id,
          puntos: score.puntos,
          acierto_resultado: score.aciertoResultado,
          acierto_local: score.aciertoLocal,
          acierto_visitante: score.aciertoVisitante,
        },
      });
      totalPuntos++;
    }

    console.log(`  Partido ${match.id} (${match.equipo_local} ${match.goles_local_real}-${match.goles_visitante_real} ${match.equipo_visitante}): ${predictions.length} pronósticos calculados`);
  }

  // Summary by participant
  const participants = await prisma.participante.findMany({
    include: {
      puntajePartidos: true,
    },
    orderBy: { nombre: 'asc' },
  });

  console.log('\n═══════════════════════════════════');
  for (const p of participants) {
    const total = p.puntajePartidos.reduce((s, pp) => s + pp.puntos, 0);
    console.log(`  ${p.nombre}: ${total} pts (${p.puntajePartidos.length} partidos)`);
  }
  console.log(`\n✅ ${totalPuntos} puntajes calculados`);
  console.log('═══════════════════════════════════\n');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
