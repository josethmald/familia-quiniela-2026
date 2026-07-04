import { PrismaClient, RondaPartido } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏟️  Iniciando seed — Fase Eliminatoria Mundial 2026');

  await prisma.puntajePartido.deleteMany();
  await prisma.pronostico.deleteMany();
  await prisma.partido.deleteMany();
  await prisma.participante.deleteMany();
  console.log('✅ Datos anteriores eliminados');

  interface MatchSeed {
    id: number;
    fecha: string;
    equipo_local: string;
    equipo_visitante: string;
    ronda: RondaPartido;
  }

  const matches: MatchSeed[] = [
    // ════════════════════════════════════════
    // DIECISEISAVOS DE FINAL (Round of 32)
    // ════════════════════════════════════════
    { id: 73,  fecha: '2026-06-28T19:00:00Z', equipo_local: 'Sudáfrica',         equipo_visitante: 'Canadá',            ronda: 'DIECISEISAVOS' },
    { id: 74,  fecha: '2026-06-29T20:30:00Z', equipo_local: 'Alemania',          equipo_visitante: 'Paraguay',          ronda: 'DIECISEISAVOS' },
    { id: 75,  fecha: '2026-06-30T01:00:00Z', equipo_local: 'Países Bajos',      equipo_visitante: 'Marruecos',         ronda: 'DIECISEISAVOS' },
    { id: 76,  fecha: '2026-06-29T17:00:00Z', equipo_local: 'Brasil',            equipo_visitante: 'Japón',             ronda: 'DIECISEISAVOS' },
    { id: 77,  fecha: '2026-06-30T21:00:00Z', equipo_local: 'Francia',           equipo_visitante: 'Suecia',            ronda: 'DIECISEISAVOS' },
    { id: 78,  fecha: '2026-06-30T17:00:00Z', equipo_local: 'Costa de Marfil',   equipo_visitante: 'Noruega',           ronda: 'DIECISEISAVOS' },
    { id: 79,  fecha: '2026-07-01T01:00:00Z', equipo_local: 'México',            equipo_visitante: 'Ecuador',           ronda: 'DIECISEISAVOS' },
    { id: 80,  fecha: '2026-07-01T16:00:00Z', equipo_local: 'Inglaterra',        equipo_visitante: 'RD Congo',          ronda: 'DIECISEISAVOS' },
    { id: 81,  fecha: '2026-07-02T00:00:00Z', equipo_local: 'Estados Unidos',    equipo_visitante: 'Bosnia y Herzegovina', ronda: 'DIECISEISAVOS' },
    { id: 82,  fecha: '2026-07-01T20:00:00Z', equipo_local: 'Bélgica',           equipo_visitante: 'Senegal',           ronda: 'DIECISEISAVOS' },
    { id: 83,  fecha: '2026-07-02T23:00:00Z', equipo_local: 'Portugal',          equipo_visitante: 'Croacia',           ronda: 'DIECISEISAVOS' },
    { id: 84,  fecha: '2026-07-02T19:00:00Z', equipo_local: 'España',            equipo_visitante: 'Austria',           ronda: 'DIECISEISAVOS' },
    { id: 85,  fecha: '2026-07-03T03:00:00Z', equipo_local: 'Suiza',             equipo_visitante: 'Argelia',           ronda: 'DIECISEISAVOS' },
    { id: 86,  fecha: '2026-07-03T22:00:00Z', equipo_local: 'Argentina',         equipo_visitante: 'Cabo Verde',        ronda: 'DIECISEISAVOS' },
    { id: 87,  fecha: '2026-07-04T01:30:00Z', equipo_local: 'Colombia',          equipo_visitante: 'Ghana',             ronda: 'DIECISEISAVOS' },
    { id: 88,  fecha: '2026-07-03T18:00:00Z', equipo_local: 'Australia',         equipo_visitante: 'Egipto',            ronda: 'DIECISEISAVOS' },

    // ════════════════════════════════════════
    // OCTAVOS DE FINAL (Round of 16)
    // ════════════════════════════════════════
    { id: 89,  fecha: '2026-07-04T21:00:00Z', equipo_local: 'Paraguay',          equipo_visitante: 'Francia',          ronda: 'OCTAVOS' },
    { id: 90,  fecha: '2026-07-04T17:00:00Z', equipo_local: 'Canadá',           equipo_visitante: 'Marruecos',        ronda: 'OCTAVOS' },
    { id: 91,  fecha: '2026-07-05T20:00:00Z', equipo_local: 'Brasil',            equipo_visitante: 'Noruega',          ronda: 'OCTAVOS' },
    { id: 92,  fecha: '2026-07-06T00:00:00Z', equipo_local: 'México',            equipo_visitante: 'Inglaterra',       ronda: 'OCTAVOS' },
    { id: 93,  fecha: '2026-07-06T19:00:00Z', equipo_local: 'Portugal',          equipo_visitante: 'España',           ronda: 'OCTAVOS' },
    { id: 94,  fecha: '2026-07-07T00:00:00Z', equipo_local: 'Estados Unidos',    equipo_visitante: 'Bélgica',          ronda: 'OCTAVOS' },
    { id: 95,  fecha: '2026-07-07T16:00:00Z', equipo_local: 'Argentina',         equipo_visitante: 'Egipto',           ronda: 'OCTAVOS' },
    { id: 96,  fecha: '2026-07-07T20:00:00Z', equipo_local: 'Suiza',             equipo_visitante: 'Colombia',         ronda: 'OCTAVOS' },

    // ════════════════════════════════════════
    // CUARTOS DE FINAL (Quarter-finals)
    // ════════════════════════════════════════
    { id: 97,  fecha: '2026-07-09T20:00:00Z', equipo_local: 'Ganador 89',        equipo_visitante: 'Ganador 90',        ronda: 'CUARTOS' },
    { id: 98,  fecha: '2026-07-10T19:00:00Z', equipo_local: 'Ganador 93',        equipo_visitante: 'Ganador 94',        ronda: 'CUARTOS' },
    { id: 99,  fecha: '2026-07-11T21:00:00Z', equipo_local: 'Ganador 91',        equipo_visitante: 'Ganador 92',        ronda: 'CUARTOS' },
    { id: 100, fecha: '2026-07-12T01:00:00Z', equipo_local: 'Ganador 95',        equipo_visitante: 'Ganador 96',        ronda: 'CUARTOS' },

    // ════════════════════════════════════════
    // SEMIFINALES
    // ════════════════════════════════════════
    { id: 101, fecha: '2026-07-14T19:00:00Z', equipo_local: 'Ganador 97',        equipo_visitante: 'Ganador 98',        ronda: 'SEMIFINAL' },
    { id: 102, fecha: '2026-07-15T19:00:00Z', equipo_local: 'Ganador 99',        equipo_visitante: 'Ganador 100',       ronda: 'SEMIFINAL' },

    // ════════════════════════════════════════
    // TERCER Y CUARTO PUESTO
    // ════════════════════════════════════════
    { id: 103, fecha: '2026-07-18T21:00:00Z', equipo_local: 'Perdedor 101',      equipo_visitante: 'Perdedor 102',      ronda: 'TERCER_LUGAR' },

    // ════════════════════════════════════════
    // FINAL
    // ════════════════════════════════════════
    { id: 104, fecha: '2026-07-19T19:00:00Z', equipo_local: 'Ganador 101',       equipo_visitante: 'Ganador 102',       ronda: 'FINAL' },
  ];

  for (const m of matches) {
    // Insertar con ID explícito para que coincida con los números de partido
    await prisma.partido.create({
      data: {
        id: m.id,
        fecha: new Date(m.fecha),
        equipo_local: m.equipo_local,
        equipo_visitante: m.equipo_visitante,
        ronda: m.ronda,
        estado: 'PENDIENTE',
      },
    });
  }

  console.log(`✅ ${matches.length} partidos cargados (${matches.filter(m => m.ronda === 'DIECISEISAVOS').length} dieciseisavos, ${matches.filter(m => m.ronda === 'OCTAVOS').length} octavos, ${matches.filter(m => m.ronda === 'CUARTOS').length} cuartos, ${matches.filter(m => m.ronda === 'SEMIFINAL').length} semifinales, ${matches.filter(m => m.ronda === 'TERCER_LUGAR').length} tercer puesto, ${matches.filter(m => m.ronda === 'FINAL').length} final)`);
  console.log('🎯 Seed completado. Los partidos están en estado PENDIENTE.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
