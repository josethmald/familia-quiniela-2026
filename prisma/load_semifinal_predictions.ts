import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Pred {
  name: string;
  match101: [number, number];
  match102: [number, number];
}

const PREDICTIONS: Pred[] = [
  { name: 'Jefferson',     match101: [2, 1], match102: [1, 1] },
  { name: 'Franco',        match101: [2, 1], match102: [2, 2] },
  { name: 'Werner Dario',  match101: [1, 0], match102: [1, 1] },
  { name: 'Gabriel',       match101: [0, 2], match102: [2, 1] },
  { name: 'David',         match101: [1, 2], match102: [1, 2] },
  { name: 'Werner',        match101: [1, 2], match102: [0, 1] },
  { name: 'Omareño',       match101: [3, 2], match102: [2, 3] },
  { name: 'Luciano',       match101: [1, 2], match102: [1, 2] },
  { name: 'Omar Alberto',  match101: [2, 1], match102: [1, 2] },
  { name: 'Jomar',         match101: [2, 3], match102: [2, 4] },
  { name: 'Alwin',         match101: [3, 1], match102: [3, 1] },
  { name: 'Josue',         match101: [1, 2], match102: [0, 3] },
  { name: 'Raynel',        match101: [3, 1], match102: [2, 3] },
  { name: 'Alexander',     match101: [3, 2], match102: [2, 3] },
  { name: 'Dawson',        match101: [1, 2], match102: [2, 2] },
];

async function main() {
  console.log('📥 Cargando pronósticos de semifinal...\n');

  const participants = await prisma.participante.findMany();
  const partMap = new Map(participants.map((p) => [p.nombre.toLowerCase(), p.id]));

  // Delete existing semifinal predictions
  await prisma.pronostico.deleteMany({ where: { partido_id: { in: [101, 102] } } });
  console.log('🗑️ Pronósticos anteriores de semifinal eliminados\n');

  let total = 0;
  for (const pred of PREDICTIONS) {
    const pid = partMap.get(pred.name.toLowerCase());
    if (!pid) {
      console.log(`  ⚠️  ${pred.name}: no encontrado en DB`);
      continue;
    }

    const [fGol, eGol] = pred.match101;
    const [iGol, aGol] = pred.match102;

    await prisma.pronostico.create({ data: { participante_id: pid, partido_id: 101, goles_local_pronostico: fGol, goles_visitante_pronostico: eGol } });
    await prisma.pronostico.create({ data: { participante_id: pid, partido_id: 102, goles_local_pronostico: iGol, goles_visitante_pronostico: aGol } });

    console.log(`  ${pred.name}: 🇫🇷 ${fGol}-${eGol} 🇪🇸  ·  🏴󠁧󠁢󠁥󠁮󠁧󠁿 ${iGol}-${aGol} 🇦🇷`);
    total += 2;
  }

  console.log(`\n✅ ${total} pronósticos insertados (${PREDICTIONS.length} participantes)`);
}

main()
  .catch((e) => { console.error('❌', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
