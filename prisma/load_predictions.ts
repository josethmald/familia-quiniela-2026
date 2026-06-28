import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── RAW TEXT FROM USER ──────────────────────────────────────────────────────
const RAW = `Dawson
- Sudáfrica: 0
- Canada:    2

  29/06
- Brasil:    2
- Japón:     1

- Alemania:  3
- Paraguay:  0

- Paises Bajos: 2
- Marruecos:    1

  30/06
- Costa de Marfil: 1
- Noruega:         2
  
- Francia:    3
- Suecia:     1
 
- México:     1
- Ecuador:    0 

  01/07
- Inglaterra: 2
- Rep Congo:  0

- Bélgica:  1
- Senegal:  0

- Estados Unidos: 1
- Bosnia H:       0

  02/07
- España:  2
- Austria: 0

- Portugal: 2
- Croacia:  1

- Suiza:    1
- Argelia:  0

  03/07
- Australia: 0
- Egipto:    2

- Argentina:  2
- Cabo Verde: 0

- Colombia:   1
- Ghana:      1

Jefferson
Sudáfrica..... 1
Canada......... 1

29/06
Brasil...... 2
Japón.... 1

Alemania.... 1
Paraguay.... 0

Paises Bajos.... 1
Marruecos...... 1

30/06
Costa de Marfil.... 0
Noruega............... 1

Francia....... 2
Suecia........ 0

México....... 0
Ecuador...... 0

01/07
Inglaterra....... 3
Rep Congo.... 0

Bélgica........ 1
Senegal....... 0

Estados Unidos...... 3
Bosnia H................. 1

02/07
España........ 1
Austria........ 1

Portugal..... 2
Croacia....... 1

Suiza........ 2
Argelia..... 1

03/07
Australia.... 1
Egipto........ 2

Argentina....... 2
Cabo Verde.... 1

Colombia.... 1
Ghana......... 1

Werner
Sudáfrica..... 0
Canadá......... 1

29/06
Brasil...... 2
Japón.... 1

Alemania.... 3
Paraguay.... 0

Países Bajos.... 2
Marruecos...... 2

30/06
Costa de Marfil.... 1
Noruega............... 3

Francia....... 2
Suecia........ 0

México....... 2
Ecuador...... 1

01/07
Inglaterra....... 3
Rep Congo.... 0

Bélgica........ 0
Senegal....... 1

Estados Unidos...... 2
Bosnia H................. 0

02/07
España........ 2
Austria........ 0

Portugal..... 1
Croacia....... 0

Suiza........ 1
Argelia..... 1

03/07
Australia.... 0
Egipto........ 2

Argentina....... 2
Cabo Verde.... 0

Colombia.... 1
Ghana......... 0

Gabriel
Sudáfrica..... 0
Canadá......... 1

29/06
Brasil...... 2
Japón.... 1

Alemania.... 3
Paraguay.... 0

Países Bajos.... 2
Marruecos...... 2

30/06
Costa de Marfil.... 1
Noruega............... 3

Francia....... 2
Suecia........ 0

México....... 2
Ecuador...... 1

01/07
Inglaterra....... 3
Rep Congo.... 0

Bélgica........ 0
Senegal....... 1

Estados Unidos...... 2
Bosnia H................. 0

02/07
España........ 2
Austria........ 0

Portugal..... 1
Croacia....... 0

Suiza........ 1
Argelia..... 1

03/07
Australia.... 0
Egipto........ 2

Argentina....... 2
Cabo Verde.... 0

Colombia.... 1
Ghana......... 0


Werner Dario
BRASIL 3 - 2 JAPON
ALEMANIA 2 - 0 PARAGUAY
PAISES BAJOS 2 - 2 MARUECOS
COSTA DE MARFIL 1 - 2 NORUEGA
FRANCIA 3 - 0 SUECIA
MEXICO 2 - 1 ECUADOR
INGLATERRA 2 - 0 CONGO
BELGICA 1 - 2 SENEGAL
USA 2 - 0 BOSNIA
ESPAÑA 2 - 0 AUSTRIA
PORTUGAL 1 - 0 CROACIA
SUIZA 2 - 2 ARGELIA
AUSTRALIA 0 - 1 EGIPTO
ARGENTINA 2 - 0 CABO VERDE
COLOMBIA 1 - 0 GHANA

Jomar
Sudáfrica..... 0
Canada......... 2

29/06
Brasil......2
Japón....2

Alemania....2
Paraguay....0

Paises Bajos....2
Marruecos......1

30/06
Costa de Marfil....1
Noruega...............3

Francia.......2
Suecia........0

México.......1
Ecuador......1

01/07
Inglaterra.......2
Rep Congo....0

Bélgica........1
Senegal.......2

Estados Unidos......2
Bosnia H.................0

02/07
España........2
Austria........0

Portugal.....1
Croacia.......1

Suiza........2
Argelia.....1

03/07
Australia....0
Egipto........2

Argentina.......3
Cabo Verde....0

Colombia....2
Ghana.........1

Omar Alberto
Sudáfrica..... 0.
Canada.........2.

29/06
Brasil...... 2.
Japón....1.

Alemania....2.
Paraguay...1.

Paises Bajos....2.
Marruecos.....2.

30/06
Costa de Marfil....2.
Noruega...........3.

Francia.......3.
Suecia........0.

México.......2.
Ecuador.....2.

01/07
Inglaterra.......3.
Rep Congo...0.

Bélgica........1.
Senegal......2.

Estados Unidos......3.
Bosnia H.................0.

02/07
España........3.
Austria.......0.

Portugal.....3.
Croacia......2.

Suiza........2.
Argelia.....0.

03/07
Australia....0.
Egipto........2.

Argentina.......2
Cabo Verde...0.

Colombia....1
Ghana.........0

Omareño
Sudáfrica..... 1
Canada.........2

29/06
Brasil......2
Japón....2

Alemania....3
Paraguay....1

Paises Bajos....2
Marruecos......1

30/06
Costa de Marfil....2
Noruega...............3

Francia.......3
Suecia........1

México.......2
Ecuador......1

01/07
Inglaterra.......3
Rep Congo....0

Bélgica........1
Senegal.......1

Estados Unidos......3
Bosnia H.................1

02/07
España........3
Austria........1

Portugal.....3
Croacia.......1

Suiza........2
Argelia.....1

03/07
Australia....1
Egipto........1

Argentina.......3
Cabo Verde....2

Colombia....2
Ghana.........1


Alwin
Sudáfrica..... 1
Canada.........2

29/06
Brasil...... 3
Japón....1

Alemania....4
Paraguay...1

Paises Bajos....2
Marruecos.....2.

30/06
Costa de Marfil....2
Noruega...........3....

Francia.......3
Suecia........0

México.......2
Ecuador.....2.

01/07
Inglaterra.......3
Rep Congo...0.

Bélgica........1
Senegal......2.

Estados Unidos......3
Bosnia H.................0

02/07
España........4
Austria.......0.

Portugal.....2
Croacia......2.

Suiza........2
Argelia.....0

03/07
Australia....0
Egipto........2

Argentina.......3
Cabo Verde...0.

Colombia....1
Ghana.........2

Franco
Sudáfrica..... 0
Canada.........1

29/06
Brasil......2
Japón....1

Alemania....2
Paraguay....2

Paises Bajos....0
Marruecos......1

30/06
Costa de Marfil....2
Noruega...............1

Francia.......2
Suecia........1

México.......1
Ecuador......2

01/07
Inglaterra.......3
Rep Congo....2

Bélgica........1
Senegal.......0

Estados Unidos......2
Bosnia H.................1

02/07
España........2
Austria........1

Portugal.....3
Croacia.......1

Suiza........2
Argelia.....1

03/07
Australia....2
Egipto........1

Argentina.......1
Cabo Verde....1

Colombia....2
Ghana.........1

Raynel
Sudáfrica..... 1
Canada.........2

29/06
Brasil......2
Japón....1

Alemania....3
Paraguay....1

Paises Bajos....2
Marruecos......2

30/06
Costa de Marfil....1
Noruega...............2

Francia.......3
Suecia........1

México.......2
Ecuador......1

01/07
Inglaterra.......3
Rep Congo....1

Bélgica........2
Senegal.......1

Estados Unidos......2
Bosnia H.................0

02/07
España........2
Austria........0

Portugal.....2
Croacia.......1

Suiza........2
Argelia.....0

03/07
Australia....1
Egipto........1

Argentina.......3
Cabo Verde....0

Colombia....2
Ghana.........0

Alexander
Sudáfrica.....  0
Canada......... 1

29/06
Brasil......  3
Japón.... 2

Alemania....3
Paraguay.... 1

Paises Bajos.... 3
Marruecos...... 1

30/06
Costa de Marfil.... 1
Noruega............... 2

Francia....... 4
Suecia........ 1

México....... 1
Ecuador...... 2

01/07
Inglaterra....... 2
Rep Congo.... 0

Bélgica........ 1
Senegal....... 1

Estados Unidos...... 2
Bosnia H................. 0

02/07
España........ 2
Austria........ 0

Portugal..... 2
Croacia....... 1

Suiza........ 2
Argelia..... 1

03/07
Australia.... 0
Egipto........ 1

Argentina....... 3
Cabo Verde.... 0

Colombia.... 2 
Ghana......... 0

Josue

Sudáfrica..... 1
Canada......... 2

29/06
Brasil...... 2
Japón.... 0

Alemania.... 1
Paraguay.... 0

Paises Bajos.... 1
Marruecos...... 1

30/06
Costa de Marfil.... 1
Noruega............... 1

Francia....... 2
Suecia........ 0

México....... 1
Ecuador...... 1

01/07
Inglaterra....... 3
Rep Congo.... 0

Bélgica........ 2
Senegal....... 1

Estados Unidos...... 2
Bosnia H................. 0

02/07
España........ 2
Austria........ 0

Portugal..... 1
Croacia....... 1

Suiza........ 1
Argelia..... 0

03/07
Australia.... 1
Egipto........ 1

Argentina....... 3
Cabo Verde.... 0

Colombia.... 2
Ghana......... 1

Luciano

Sudáfrica..... 1
Canada......... 2

29/06
Brasil...... 1
Japón.... 1

Alemania.... 1
Paraguay.... 0

Paises Bajos.... 2
Marruecos...... 1

30/06
Costa de Marfil.... 0
Noruega............... 1

Francia....... 1
Suecia........ 0

México....... 0
Ecuador...... 1

01/07
Inglaterra....... 3
Rep Congo.... 0

Bélgica........ 0
Senegal....... 0

Estados Unidos...... 2
Bosnia H................. 1

02/07
España........ 1
Austria........ 0

Portugal..... 0
Croacia....... 1

Suiza........ 1
Argelia..... 1

03/07
Australia.... 2
Egipto........ 1

Argentina....... 2
Cabo Verde.... 0

Colombia.... 2
Ghana......... 1

David

Sudáfrica..... 1
Canada.........1

29/06
Brasil......1
Japón....0

Alemania....3
Paraguay....1

Paises Bajos....2
Marruecos......0

30/06
Costa de Marfil....0
Noruega...............2

Francia.......3
Suecia........0

México.......1
Ecuador......2

01/07
Inglaterra.......2
Rep Congo....0

Bélgica........1
Senegal.......1

Estados Unidos......1
Bosnia H.................0

02/07
España........2
Austria........0

Portugal.....3
Croacia.......1

Suiza........2
Argelia.....0

03/07
Australia....1
Egipto........2

Argentina.......2
Cabo Verde....0

Colombia....1
Ghana.........0`;

// ─── TEAM NAME NORMALIZATION ─────────────────────────────────────────────────

const TEAM_MAP: Record<string, string> = {
  'sudáfrica': 'Sudáfrica',
  'sudafrica': 'Sudáfrica',
  'canadá': 'Canadá',
  'canada': 'Canadá',
  'brasil': 'Brasil',
  'japón': 'Japón',
  'japon': 'Japón',
  'alemania': 'Alemania',
  'paraguay': 'Paraguay',
  'países bajos': 'Países Bajos',
  'paises bajos': 'Países Bajos',
  'marruecos': 'Marruecos',
  'maruecos': 'Marruecos',
  'costa de marfil': 'Costa de Marfil',
  'noruega': 'Noruega',
  'francia': 'Francia',
  'suecia': 'Suecia',
  'méxico': 'México',
  'mexico': 'México',
  'ecuador': 'Ecuador',
  'inglaterra': 'Inglaterra',
  'rep congo': 'RD Congo',
  'congo': 'RD Congo',
  'rd congo': 'RD Congo',
  'bélgica': 'Bélgica',
  'belgica': 'Bélgica',
  'senegal': 'Senegal',
  'estados unidos': 'Estados Unidos',
  'usa': 'Estados Unidos',
  'bosnia y herzegovina': 'Bosnia y Herzegovina',
  'bosnia h': 'Bosnia y Herzegovina',
  'bosnia': 'Bosnia y Herzegovina',
  'españa': 'España',
  'espana': 'España',
  'austria': 'Austria',
  'portugal': 'Portugal',
  'croacia': 'Croacia',
  'suiza': 'Suiza',
  'argelia': 'Argelia',
  'australia': 'Australia',
  'egipto': 'Egipto',
  'argentina': 'Argentina',
  'cabo verde': 'Cabo Verde',
  'colombia': 'Colombia',
  'ghana': 'Ghana',
};

const PARTICIPANT_NAMES = [
  'Werner Dario',
  'Omar Alberto',
  'Dawson',
  'Jefferson',
  'Werner',
  'Gabriel',
  'Jomar',
  'Omareño',
  'Alwin',
  'Franco',
  'Raynel',
  'Alexander',
  'Josue',
  'Luciano',
  'David',
];

function normalizeTeam(raw: string): string | null {
  const cleaned = raw
    .trim()
    .replace(/^-\s*/, '')
    .replace(/[.,:]+$/, '')
    .trim()
    .toLowerCase();
  return TEAM_MAP[cleaned] ?? null;
}

function parseGoals(raw: string): number | null {
  const cleaned = raw.trim().replace(/[.,\s]+$/, '').trim();
  const n = parseInt(cleaned, 10);
  return isNaN(n) ? null : n;
}

// ─── LINE PARSING ────────────────────────────────────────────────────────────

interface TeamGoal {
  team: string;
  goals: number;
}

interface MatchPred {
  local: TeamGoal;
  visitante: TeamGoal;
  partidoId?: number;
}

function isDateLine(line: string): boolean {
  return /^\s*\d{1,2}\/\d{1,2}\s*$/.test(line);
}

function isParticipantLine(line: string): string | null {
  const trimmed = line.trim();
  for (const name of PARTICIPANT_NAMES) {
    if (trimmed === name) return name;
  }
  return null;
}

/**
 * Try to parse a "Werner Dario" style line: "BRASIL 3 - 2 JAPON"
 */
function parseBothTeamsLine(line: string): { t1: string; g1: number; t2: string; g2: number } | null {
  const parts = line.split(/\s*-\s*/);
  if (parts.length !== 2) return null;

  const left = parts[0].trim();
  const right = parts[1].trim();

  // Left: "BRASIL 3" — find last number
  const leftMatch = left.match(/^(.*?)\s+(\d+)$/);
  if (!leftMatch) return null;

  const t1 = normalizeTeam(leftMatch[1]);
  const g1 = parseGoals(leftMatch[2]);
  if (!t1 || g1 === null) return null;

  // Right: "2 JAPON" — find first number
  const rightMatch = right.match(/^(\d+)\s+(.*)$/);
  if (!rightMatch) return null;

  const g2 = parseGoals(rightMatch[1]);
  const t2 = normalizeTeam(rightMatch[2]);
  if (!t2 || g2 === null) return null;

  return { t1, g1, t2, g2 };
}

/**
 * Parse a single team-goal line: "- Equipo: X" or "Equipo..... X" or "Equipo..... X."
 */
function parseSingleTeamLine(line: string): TeamGoal | null {
  let cleaned = line.trim().replace(/^-\s*/, '').trim();

  // Try colon separator
  const colonIdx = cleaned.indexOf(':');
  if (colonIdx > 0) {
    const teamRaw = cleaned.substring(0, colonIdx).trim();
    const goalsRaw = cleaned.substring(colonIdx + 1).trim();
    const team = normalizeTeam(teamRaw);
    const goals = parseGoals(goalsRaw);
    if (team && goals !== null) return { team, goals };
  }

  // Try dots separator (2+ consecutive dots)
  const dotMatch = cleaned.match(/^(.+?)\s*\.{2,}\s*(.+)$/);
  if (dotMatch) {
    const team = normalizeTeam(dotMatch[1]);
    const goals = parseGoals(dotMatch[2]);
    if (team && goals !== null) return { team, goals };
  }

  // Try space separator — last token is the number
  const spaceMatch = cleaned.match(/^(.+?)\s+(\d+)\s*\.?\s*$/);
  if (spaceMatch) {
    // Make sure this isn't a both-teams line (shouldn't have " - ")
    if (!line.includes(' - ')) {
      const team = normalizeTeam(spaceMatch[1]);
      const goals = parseGoals(spaceMatch[2]);
      if (team && goals !== null) return { team, goals };
    }
  }

  return null;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📥 Cargando predicciones de la fase eliminatoria...\n');

  // 1. Fetch dieciseisavos matches from DB
  const matches = await prisma.partido.findMany({
    where: { ronda: 'DIECISEISAVOS' },
  });

  // Build lookup: normalized team1|team2 → matchId
  const matchLookup: Record<string, number> = {};
  for (const m of matches) {
    const key = `${m.equipo_local.toLowerCase()}|${m.equipo_visitante.toLowerCase()}`;
    matchLookup[key] = m.id;
  }

  // 2. Parse raw text into participant blocks
  const lines = RAW.split('\n');
  const blocks: { name: string; lines: string[] }[] = [];
  let currentBlock: { name: string; lines: string[] } | null = null;

  for (const line of lines) {
    const participant = isParticipantLine(line);
    if (participant) {
      currentBlock = { name: participant, lines: [] };
      blocks.push(currentBlock);
    } else if (currentBlock) {
      currentBlock.lines.push(line);
    }
  }

  console.log(`📋 Detectados ${blocks.length} participantes\n`);

  // 3. Parse each block into predictions
  let totalPredictions = 0;
  let errors: string[] = [];

  for (const block of blocks) {
    const predictions: MatchPred[] = [];
    let isWernerDario = false;
    const parsedLines: TeamGoal[] = [];

    // First pass: detect format and parse lines
    for (const line of block.lines) {
      const trimmed = line.trim();
      if (!trimmed || isDateLine(trimmed)) continue;

      // Try both-teams format (Werner Dario)
      const both = parseBothTeamsLine(trimmed);
      if (both) {
        isWernerDario = true;
        predictions.push({
          local: { team: both.t1, goals: both.g1 },
          visitante: { team: both.t2, goals: both.g2 },
        });
        continue;
      }

      // Try single team format
      const single = parseSingleTeamLine(trimmed);
      if (single) {
        parsedLines.push(single);
      }
    }

    // If not Werner Dario format, pair up lines
    if (!isWernerDario) {
      for (let i = 0; i < parsedLines.length - 1; i += 2) {
        predictions.push({
          local: parsedLines[i],
          visitante: parsedLines[i + 1],
        });
      }
      // Handle odd number of lines
      if (parsedLines.length % 2 !== 0) {
        errors.push(`${block.name}: línea impar (${parsedLines.length}), última ignorada`);
      }
    }

    // 4. Resolve match IDs
    let matchedCount = 0;
    for (const pred of predictions) {
      const key = `${pred.local.team.toLowerCase()}|${pred.visitante.team.toLowerCase()}`;
      const matchId = matchLookup[key];
      if (matchId) {
        pred.partidoId = matchId;
        matchedCount++;
      } else {
        errors.push(`${block.name}: no se encontró partido para ${pred.local.team} vs ${pred.visitante.team}`);
      }
    }

    console.log(`  ${block.name}: ${predictions.length} pronósticos, ${matchedCount} emparejados`);

    if (matchedCount !== predictions.length) continue;
    if (matchedCount === 0) {
      errors.push(`${block.name}: 0 partidos emparejados, se omite`);
      continue;
    }

    // 5. Create participant and insert predictions
    const participante = await prisma.participante.create({
      data: { nombre: block.name },
    });

    for (const pred of predictions) {
      if (!pred.partidoId) continue;
      await prisma.pronostico.create({
        data: {
          participante_id: participante.id,
          partido_id: pred.partidoId,
          goles_local_pronostico: pred.local.goals,
          goles_visitante_pronostico: pred.visitante.goals,
        },
      });
      totalPredictions++;
    }
  }

  // 6. Summary
  console.log('\n═══════════════════════════════════');
  console.log(`✅ ${blocks.length} participantes creados`);
  console.log(`✅ ${totalPredictions} pronósticos insertados`);
  if (errors.length > 0) {
    console.log(`\n⚠️  ${errors.length} advertencias:`);
    for (const e of errors) console.log(`  • ${e}`);
  }
  console.log('═══════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
