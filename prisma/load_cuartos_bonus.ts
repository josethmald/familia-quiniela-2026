import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const RAW = `Josue
09/07/2026  4:00pm
FRANCIA 2
MARRUECOS 2

10/07/2026  3:00pm
ESPAÑA 0
BELGICA 2

11/07/2026  5:00pm
NORUEGA 1
INGLATERRA 0

11/07/2026  9:00pm
ARGENTINA 2
SUIZA 0

Campeon : Argentina
Sub Campeon: Francia
Goleador: Messi

Werner
09/07/2026  4:00pm
FRANCIA 1
MARRUECOS 1

10/07/2026  3:00pm
ESPAÑA 1
BELGICA 0

11/07/2026  5:00pm
NORUEGA 1
INGLATERRA 2

11/07/2026  9:00pm
ARGENTINA 2
SUIZA 0

Campeon : Argentina
Sub Campeon: Francia
Goleador: Messi

David
09/07/2026  4:00pm
FRANCIA 0
MARRUECOS 1

10/07/2026  3:00pm
ESPAÑA 2
BELGICA 0

11/07/2026  5:00pm
NORUEGA 2
INGLATERRA 1

11/07/2026  9:00pm
ARGENTINA 2
SUIZA 0

Campeon : Argentina
Sub Campeon: España
Goleador: Messi

Raynel
09/07/2026  4:00pm
FRANCIA: 2
MARRUECOS: 1

10/07/2026  3:00pm
ESPAÑA: 2
BELGICA: 2

11/07/2026  5:00pm
NORUEGA:2
INGLATERRA:3

11/07/2026  9:00pm
ARGENTINA: 2
SUIZA: 0

Campeon : Argentina
Sub Campeon:Francia
Goleador: Messi

Alexander
09/07/2026  4:00pm
FRANCIA 3
MARRUECOS 1

10/07/2026  3:00pm
ESPAÑA 2
BELGICA 1

11/07/2026  5:00pm
NORUEGA 2
INGLATERRA 3

11/07/2026  9:00pm
ARGENTINA 2
SUIZA 1

Campeon : Francia
Sub Campeon: Inglaterra
Goleador: mbappe

Jomar
09/07/2026  4:00pm
FRANCIA: 2
MARRUECOS:1

10/07/2026  3:00pm
ESPAÑA:2
BELGICA:2

11/07/2026  5:00pm
NORUEGA:2
INGLATERRA:1

11/07/2026  9:00pm
ARGENTINA:2
SUIZA:1

Campeon : Argentina
Sub Campeon: España
Goleador: Messi

Alwin
09/07/2026  4:00pm
FRANCIA 2
MARRUECs 1

10/07/2026  3:00pm
ESPAÑA 2
BELGICA 0

11/07/2026  5:00pm
NORUEGA 3
INGLATERRA 1

11/07/2026  9:00pm
ARGENTINA 2
SUIZA 1

Campeon : Francia
Sub Campeon: Noruega
Goleador: Mbappe


Gabriel

Francia  0
Marruecos 1

España 1
Bélgica 0

Noruega 2
Inglaterra 1

Argentina 2
Suiza 0

Campeon: Argentina
Sub Campeon: España
Goleador: Messi

Omar Alberto
09/07/2026  4:00pm
FRANCIA 2
MARRUECOS 0

10/07/2026  3:00pm
ESPAÑA 1
BELGICA 0

11/07/2026  5:00pm
NORUEGA 1
INGLATERRA 2

11/07/2026  9:00pm
ARGENTINA 2
SUIZA 1

Campeon : Argentina
Sub Campeon: Francia
Goleador: Messi

Omareño
09/07/2026  4:00pm
FRANCIA 2
MARRUECOS 1

10/07/2026  3:00pm
ESPAÑA 2
BELGICA 0

11/07/2026  5:00pm
NORUEGA 2
INGLATERRA 1

11/07/2026  9:00pm
ARGENTINA 2
SUIZA 1

Campeon : Francia
Sub Campeon: Noruega
Goleador: Haaland

Luciano

FRANCIA 1
MARRUECOS 2

10/07/2026  3:00pm
ESPAÑA 1
BELGICA 0

11/07/2026  5:00pm
NORUEGA 2
INGLATERRA 1

11/07/2026  9:00pm
ARGENTINA 1
SUIZA 0

Campeon : Argentina
Sub Campeon: españa
Goleador: Mesi

Jefferson

Francia  1
Marruecos 1

España 1
Bélgica 2

Noruega 1
Inglaterra 0

Argentina 2
Suiza 1

Campeon: Noruega
Sub Campeon: Marruecos
Goleador: Haaland

Dawson

09/07/2026  4:00pm
FRANCIA         2
MARRUECOS  2

10/07/2026  3:00pm
ESPAÑA   2
BELGICA  1

11/07/2026  5:00pm
NORUEGA      3
INGLATERRA  2

11/07/2026  9:00pm
ARGENTINA 2
SUIZA            1

Campeon :         Noruega
Sub Campeon:   Francia
Goleador:   Haaland


Werner Dario
09/07/2026  4:00pm
FRANCIA         1
MARRUECOS  0

10/07/2026  3:00pm
ESPAÑA   2
BELGICA  1

11/07/2026  5:00pm
NORUEGA      0
INGLATERRA  2

11/07/2026  9:00pm
ARGENTINA  1
SUIZA             0

Campeon :  Francia
Sub Campeon: Argentina
Goleador:  Messi

Franco
09/07/2026  4:00pm
FRANCIA: 2
MARRUECOS: 1

10/07/2026  3:00pm
ESPAÑA: 2
BELGICA: 1

11/07/2026  5:00pm
NORUEGA:2
INGLATERRA:3

11/07/2026  9:00pm
ARGENTINA: 2
SUIZA: 1

Campeon : Francia
Sub Campeon:Argentina
Goleador: Messi`;

const TEAM_MAP: Record<string, string> = {
  'francia': 'Francia',
  'marruecos': 'Marruecos',
  'maruecos': 'Marruecos',
  'maruecs': 'Marruecos',
  'españa': 'España',
  'espana': 'España',
  'belgica': 'Bélgica',
  'bélgica': 'Bélgica',
  'noruega': 'Noruega',
  'inglaterra': 'Inglaterra',
  'argentina': 'Argentina',
  'suiza': 'Suiza',
};

const CUARTOS_MATCHES = [
  { id: 97, local: 'Francia', visitante: 'Marruecos' },
  { id: 98, local: 'España', visitante: 'Bélgica' },
  { id: 99, local: 'Noruega', visitante: 'Inglaterra' },
  { id: 100, local: 'Argentina', visitante: 'Suiza' },
];

const PARTICIPANT_MAP: Record<string, string> = {
  'josue': 'Josue',
  'werner': 'Werner',
  'david': 'David',
  'raynel': 'Raynel',
  'alexander': 'Alexander',
  'chander': 'Alexander',
  'jomar': 'Jomar',
  'alwin': 'Alwin',
  'gabriel': 'Gabriel',
  'omar alberto': 'Omar Alberto',
  'omareño': 'Omareño',
  'luciano': 'Luciano',
  'jefferson': 'Jefferson',
  'dawson': 'Dawson',
  'werner dario': 'Werner Dario',
  'franco': 'Franco',
};

function normalizeTeam(raw: string): string | null {
  let cleaned = raw.trim().replace(/[.:,\s]+$/, '').trim().toLowerCase();
  // Fuzzy: treat any "marr" prefix as Marruecos (handles typos like MARRUECs, Maruecos, etc.)
  if (cleaned.startsWith('marr')) return 'Marruecos';
  // Also handle "belgic" / "belg" typos
  if (cleaned.startsWith('belg')) return 'Bélgica';
  // Exact map as fallback
  return TEAM_MAP[cleaned] ?? null;
}

function parseGoals(raw: string): number | null {
  const m = raw.trim().match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function parseTeamLine(line: string): { team: string; goals: number } | null {
  let cleaned = line.trim();
  if (!cleaned || /^\d{1,2}\/\d{1,2}\/\d{4}/.test(cleaned)) return null;

  // Try colon format: "TEAM: X" or "TEAM : X"
  const colonIdx = cleaned.indexOf(':');
  if (colonIdx >= 0) {
    const teamRaw = cleaned.substring(0, colonIdx).trim();
    const goalsRaw = cleaned.substring(colonIdx + 1).trim();
    const team = normalizeTeam(teamRaw);
    const goals = parseGoals(goalsRaw);
    if (team && goals !== null) return { team, goals };
  }

  // Try space-separated format: "TEAM X" (last token is number)
  const parts = cleaned.split(/\s+/);
  const last = parts[parts.length - 1];
  const goals = parseGoals(last);
  if (goals !== null) {
    const teamRaw = parts.slice(0, -1).join(' ');
    const team = normalizeTeam(teamRaw);
    if (team) return { team, goals };
  }

  return null;
}

function parseBonusLine(line: string): { tipo: string; valor: string } | null {
  const cleaned = line.trim();
  if (!cleaned) return null;

  const lower = cleaned.toLowerCase();

  let tipo: string | null = null;
  if (lower.startsWith('campeon') || lower.startsWith('campeón')) tipo = 'CAMPEON';
  else if (lower.startsWith('sub campeon') || lower.startsWith('sub campeón') || lower.startsWith('subcampeon') || lower.startsWith('subcampeón')) tipo = 'SUB_CAMPEON';
  else if (lower.startsWith('goleador')) tipo = 'GOLEADOR';

  if (!tipo) return null;

  const colonIdx = cleaned.indexOf(':');
  const valor = colonIdx >= 0 ? cleaned.substring(colonIdx + 1).trim() : '';
  if (!valor) return null;

  return { tipo, valor };
}

function findMatchId(team1: string, team2: string): number | null {
  for (const m of CUARTOS_MATCHES) {
    if (team1 === m.local && team2 === m.visitante) return m.id;
    if (team1 === m.visitante && team2 === m.local) return m.id;
  }
  return null;
}

function needsSwap(team1: string, team2: string): boolean {
  for (const m of CUARTOS_MATCHES) {
    if (team1 === m.visitante && team2 === m.local) return true;
  }
  return false;
}

interface Block {
  name: string;
  matchData: { team1: string; g1: number; team2: string; g2: number }[];
  bonus: { campeon: string; subcampeon: string; goleador: string };
}

async function main() {
  console.log('📥 Cargando pronósticos de cuartos + bonificaciones...\n');

  const participants = await prisma.participante.findMany();
  const partMap = new Map(participants.map(p => [p.nombre.toLowerCase(), p.id]));

  const lines = RAW.split('\n');
  const blocks: Block[] = [];
  let current: { name: string; matchLines: string[]; bonusLines: string[]; inBonus: boolean } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    const lower = trimmed.toLowerCase();

    const mappedName = PARTICIPANT_MAP[lower];
    if (mappedName) {
      if (current) {
        blocks.push({
          name: current.name,
          matchData: [],
          bonus: { campeon: '', subcampeon: '', goleador: '' },
        });
      }
      current = { name: mappedName, matchLines: [], bonusLines: [], inBonus: false };
      continue;
    }

    if (!current) continue;

    if (trimmed.startsWith('Campeon') || trimmed.startsWith('Campeón') || trimmed.startsWith('Sub Campeon') || trimmed.startsWith('Sub campeon') || trimmed.startsWith('Sub campeón')
        || trimmed.startsWith('Subcampeon') || trimmed.startsWith('Subcampeón') || trimmed.startsWith('Goleador')) {
      current.inBonus = true;
      current.bonusLines.push(trimmed);
    } else if (current.inBonus) {
      if (trimmed.startsWith('Campeon') || trimmed.startsWith('Campeón') || trimmed.startsWith('Sub Campeon') || trimmed.startsWith('Sub campeon') || trimmed.startsWith('Sub campeón')
          || trimmed.startsWith('Subcampeon') || trimmed.startsWith('Subcampeón') || trimmed.startsWith('Goleador')) {
        current.bonusLines.push(trimmed);
      }
      // skip non-bonus lines when in bonus section
    } else {
      if (trimmed && !/^\d{1,2}\/\d{1,2}\/\d{4}/.test(trimmed)) {
        current.matchLines.push(trimmed);
      }
    }
  }

  // Push last block
  if (current) {
    blocks.push({
      name: current.name,
      matchData: [],
      bonus: { campeon: '', subcampeon: '', goleador: '' },
    });
  }

  // Now parse match lines and bonus lines for each block
  let i = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    const lower = trimmed.toLowerCase();
    const mappedName = PARTICIPANT_MAP[lower];
    if (mappedName && current) {
      i++;
      current = { name: mappedName, matchLines: [], bonusLines: [], inBonus: false };
      continue;
    }
    if (!mappedName && !current) continue;
    if (mappedName) {
      current = { name: mappedName, matchLines: [], bonusLines: [], inBonus: false };
      continue;
    }
    if (!current) continue;

    if (!trimmed || /^\d{1,2}\/\d{1,2}\/\d{4}/.test(trimmed)) continue;

    const bonus = parseBonusLine(trimmed);
    if (bonus) {
      current.bonusLines.push(bonus.valor);
      continue;
    }

    current.matchLines.push(trimmed);
  }

  // Much simpler: re-parse from scratch
  const blocks2: Block[] = [];
  let curr: Block | null = null;
  let matchAcc: { team1: string; g1: number; team2: string; g2: number }[] = [];
  let bonusAcc = { campeon: '', subcampeon: '', goleador: '' };
  let temp: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const lower = trimmed.toLowerCase();
    const mapped = PARTICIPANT_MAP[lower];

    if (mapped) {
      if (curr) {
        // Process accumulated match data
        for (let j = 0; j < temp.length - 1; j += 2) {
          const t1 = parseTeamLine(temp[j]);
          const t2 = parseTeamLine(temp[j + 1]);
          if (t1 && t2) {
            matchAcc.push({ team1: t1.team, g1: t1.goals, team2: t2.team, g2: t2.goals });
          }
        }
        finalizeBlock();
      }
      curr = { name: mapped, matchData: [], bonus: { campeon: '', subcampeon: '', goleador: '' } };
      matchAcc = [];
      bonusAcc = { campeon: '', subcampeon: '', goleador: '' };
      temp = [];
      continue;
    }
    if (!curr || !trimmed) continue;

    if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(trimmed)) continue;

    const bonus = parseBonusLine(trimmed);
    if (bonus) {
      if (bonus.tipo === 'CAMPEON') bonusAcc.campeon = bonus.valor;
      else if (bonus.tipo === 'SUB_CAMPEON') bonusAcc.subcampeon = bonus.valor;
      else if (bonus.tipo === 'GOLEADOR') bonusAcc.goleador = bonus.valor;

      if (temp.length > 0) {
        for (let j = 0; j < temp.length - 1; j += 2) {
          const t1 = parseTeamLine(temp[j]);
          const t2 = parseTeamLine(temp[j + 1]);
          if (t1 && t2) {
            matchAcc.push({ team1: t1.team, g1: t1.goals, team2: t2.team, g2: t2.goals });
          }
        }
        temp = [];
      }
      continue;
    }

    const parsed = parseTeamLine(trimmed);
    if (parsed) {
      temp.push(trimmed);
    }
  }

  // Final flush (must fire even if temp is empty — last participant)
  if (curr) {
    if (temp.length > 0) {
      for (let j = 0; j < temp.length - 1; j += 2) {
        const t1 = parseTeamLine(temp[j]);
        const t2 = parseTeamLine(temp[j + 1]);
        if (t1 && t2) {
          matchAcc.push({ team1: t1.team, g1: t1.goals, team2: t2.team, g2: t2.goals });
        }
      }
    }
    finalizeBlock();
  }

  function finalizeBlock() {
    if (curr) {
      curr.matchData = matchAcc;
      curr.bonus = { ...bonusAcc };
      blocks2.push(curr);
    }
  }

  console.log(`📋 Detectados ${blocks2.length} participantes\n`);

  // Clear existing cuartos predictions and bonus
  await prisma.prediccionBonus.deleteMany();
  await prisma.configuracionBonus.deleteMany();
  await prisma.puntajePartido.deleteMany({ where: { partido: { ronda: 'CUARTOS' } } });
  // Delete cuartos predictions
  const cuartosIds = [97, 98, 99, 100];
  await prisma.pronostico.deleteMany({ where: { partido_id: { in: cuartosIds } } });
  console.log('🗑️ Datos anteriores de cuartos y bonus eliminados\n');

  let totalPredictions = 0;
  let errors: string[] = [];
  let bonusCount = 0;

  for (const block of blocks2) {
    const participanteId = partMap.get(block.name.toLowerCase());
    if (!participanteId) {
      errors.push(`${block.name}: no encontrado en DB`);
      continue;
    }

    // Insert cuartos predictions
    let matchCount = 0;
    for (const pred of block.matchData) {
      const mid = findMatchId(pred.team1, pred.team2);
      if (!mid) {
        errors.push(`${block.name}: no se encontró partido para ${pred.team1} vs ${pred.team2}`);
        continue;
      }
      const swap = needsSwap(pred.team1, pred.team2);
      const gLocal = swap ? pred.g2 : pred.g1;
      const gVisit = swap ? pred.g1 : pred.g2;
      const eLocal = swap ? pred.team2 : pred.team1;
      const eVisit = swap ? pred.team1 : pred.team2;

      try {
        await prisma.pronostico.create({
          data: {
            participante_id: participanteId,
            partido_id: mid,
            goles_local_pronostico: gLocal,
            goles_visitante_pronostico: gVisit,
          },
        });
        matchCount++;
        totalPredictions++;
        console.log(`  ${block.name} → Partido ${mid} (${eLocal} vs ${eVisit}): ${gLocal}-${gVisit}`);
      } catch (err: any) {
        if (err.code === 'P2002') {
          errors.push(`${block.name}: duplicado partido ${mid}`);
        } else {
          errors.push(`${block.name}: error partido ${mid}: ${err.message}`);
        }
      }
    }

    // Insert bonus predictions
    if (block.bonus.campeon) {
      await prisma.prediccionBonus.upsert({
        where: { participante_id_tipo: { participante_id: participanteId, tipo: 'CAMPEON' } },
        update: { valor: block.bonus.campeon },
        create: { participante_id: participanteId, tipo: 'CAMPEON', valor: block.bonus.campeon },
      });
      bonusCount++;
      console.log(`  ${block.name} → Campeón: ${block.bonus.campeon}`);
    }
    if (block.bonus.subcampeon) {
      await prisma.prediccionBonus.upsert({
        where: { participante_id_tipo: { participante_id: participanteId, tipo: 'SUB_CAMPEON' } },
        update: { valor: block.bonus.subcampeon },
        create: { participante_id: participanteId, tipo: 'SUB_CAMPEON', valor: block.bonus.subcampeon },
      });
      bonusCount++;
      console.log(`  ${block.name} → Subcampeón: ${block.bonus.subcampeon}`);
    }
    if (block.bonus.goleador) {
      await prisma.prediccionBonus.upsert({
        where: { participante_id_tipo: { participante_id: participanteId, tipo: 'GOLEADOR' } },
        update: { valor: block.bonus.goleador },
        create: { participante_id: participanteId, tipo: 'GOLEADOR', valor: block.bonus.goleador },
      });
      bonusCount++;
      console.log(`  ${block.name} → Goleador: ${block.bonus.goleador}`);
    }

    console.log(`  → ${matchCount} pronósticos, 3 bonus para ${block.name}\n`);
  }

  console.log('\n═══════════════════════════════════');
  console.log(`✅ ${totalPredictions} pronósticos de cuartos insertados`);
  console.log(`✅ ${bonusCount} bonificaciones insertadas`);
  if (errors.length > 0) {
    console.log(`\n⚠️  ${errors.length} advertencias:`);
    for (const e of errors) console.log(`  • ${e}`);
  }
  console.log('═══════════════════════════════════\n');
}

main()
  .catch(e => { console.error('❌', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
