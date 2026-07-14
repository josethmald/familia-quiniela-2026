import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function calculatePoints(gP: number, gPv: number, gR: number, gRv: number) {
  const aciertoResultado =
    (gP > gPv && gR > gRv) ||
    (gPv > gP && gRv > gR) ||
    (gP === gPv && gR === gRv);
  const aciertoLocal = gP === gR ? 1 : 0;
  const aciertoVisitante = gPv === gRv ? 1 : 0;
  const puntos = (aciertoResultado ? 3 : 0) + aciertoLocal + aciertoVisitante;
  return { puntos, aciertoResultado, aciertoLocal: aciertoLocal === 1, aciertoVisitante: aciertoVisitante === 1 };
}

async function main() {
  for (const matchId of [101, 102]) {
    const match = await prisma.partido.findUnique({ where: { id: matchId } });
    if (!match || match.estado !== 'FINALIZADO' || match.goles_local_real === null || match.goles_visitante_real === null) {
      console.log(`Partido ${matchId}: no finalizado, saltando`);
      continue;
    }

    // Delete existing puntajes for this match
    await prisma.puntajePartido.deleteMany({ where: { partido_id: matchId } });

    const predictions = await prisma.pronostico.findMany({
      where: { partido_id: matchId },
    });

    let count = 0;
    for (const p of predictions) {
      const score = calculatePoints(
        p.goles_local_pronostico,
        p.goles_visitante_pronostico,
        match.goles_local_real,
        match.goles_visitante_real
      );
      await prisma.puntajePartido.create({
        data: {
          participante_id: p.participante_id,
          partido_id: matchId,
          puntos: score.puntos,
          acierto_resultado: score.aciertoResultado,
          acierto_local: score.aciertoLocal,
          acierto_visitante: score.aciertoVisitante,
        },
      });
      count++;
    }
    console.log(`Partido ${matchId} (${match.equipo_local} ${match.goles_local_real}-${match.goles_visitante_real} ${match.equipo_visitante}): ${count} puntajes calculados`);
  }
}

main()
  .catch((e) => { console.error('❌', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
