import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const participante = await prisma.participante.findFirst({
    where: { nombre: 'Werner Dario' },
  });

  if (!participante) {
    console.error('❌ No se encontró a Werner Dario');
    process.exit(1);
  }

  const partido = await prisma.partido.findUnique({ where: { id: 73 } });
  if (!partido) {
    console.error('❌ No se encontró el partido Sudáfrica vs Canadá (id: 73)');
    process.exit(1);
  }

  const existente = await prisma.pronostico.findFirst({
    where: {
      participante_id: participante.id,
      partido_id: 73,
    },
  });

  if (existente) {
    console.log('ℹ️  Werner Dario ya tiene pronóstico para Sudáfrica vs Canadá');
    return;
  }

  await prisma.pronostico.create({
    data: {
      participante_id: participante.id,
      partido_id: 73,
      goles_local_pronostico: 0,   // Sudáfrica
      goles_visitante_pronostico: 2, // Canadá
    },
  });

  console.log('✅ Pronóstico agregado: Werner Dario → Sudáfrica 0 - 2 Canadá');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
