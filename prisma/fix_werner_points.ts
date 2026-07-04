import { PrismaClient } from '@prisma/client';
import { calculatePoints } from '../src/lib/scoring';

const prisma = new PrismaClient();

async function main() {
  // 1. Buscar a Werner Dario
  const participante = await prisma.participante.findFirst({
    where: { nombre: 'Werner Dario' },
  });
  if (!participante) {
    console.error('❌ No se encontró a Werner Dario');
    process.exit(1);
  }

  // 2. Buscar el partido Sudáfrica vs Canadá (id: 73)
  const partido = await prisma.partido.findUnique({ where: { id: 73 } });
  if (!partido) {
    console.error('❌ No se encontró el partido 73');
    process.exit(1);
  }

  if (partido.estado !== 'FINALIZADO') {
    console.error('❌ El partido 73 no está FINALIZADO. Carga el resultado primero.');
    process.exit(1);
  }

  // 3. Buscar el pronóstico de Werner Dario para este partido
  const pronostico = await prisma.pronostico.findUnique({
    where: {
      participante_id_partido_id: {
        participante_id: participante.id,
        partido_id: 73,
      },
    },
  });
  if (!pronostico) {
    console.error('❌ Werner Dario no tiene pronóstico para el partido 73');
    process.exit(1);
  }

  // 4. Verificar si ya tiene puntaje calculado
  const existente = await prisma.puntajePartido.findUnique({
    where: {
      participante_id_partido_id: {
        participante_id: participante.id,
        partido_id: 73,
      },
    },
  });
  if (existente) {
    console.log(`ℹ️  Werner Dario ya tiene puntaje para este partido: ${existente.puntos} pts`);
    return;
  }

  // 5. Calcular puntos
  const score = calculatePoints(
    pronostico.goles_local_pronostico,
    pronostico.goles_visitante_pronostico,
    partido.goles_local_real!,
    partido.goles_visitante_real!,
  );

  // 6. Insertar puntaje
  await prisma.puntajePartido.create({
    data: {
      participante_id: participante.id,
      partido_id: 73,
      puntos: score.puntos,
      acierto_resultado: score.aciertoResultado,
      acierto_local: score.aciertoLocal,
      acierto_visitante: score.aciertoVisitante,
    },
  });

  console.log(`✅ Puntaje calculado para Werner Dario en ${partido.equipo_local} ${partido.goles_local_real} - ${partido.goles_visitante_real} ${partido.equipo_visitante}`);
  console.log(`   Pronóstico: ${pronostico.goles_local_pronostico} - ${pronostico.goles_visitante_pronostico}`);
  console.log(`   Puntos: ${score.puntos} (resultado: ${score.aciertoResultado ? '✅' : '❌'}, local: ${score.aciertoLocal ? '🟢' : '🔴'}, visitante: ${score.aciertoVisitante ? '🟢' : '🔴'})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
