import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const RAW = `Alwin

Marruecos : 3
Canada : 1

Paraguay: 0
Francia: 3

Brasil : 2
Noruega: 2

México: 1
Inglaterra: 2

España : 3
Portugal: 1

USA: 2
Belgica: 1

Suiza: 2
Colombia: 2

Argentina: 2
Egipto: 1

Omareño

Marruecos : 2
Canada :1

Paraguay: 1
Francia:  3

Brasil : 2 
Noruega: 1

México: 1
Inglaterra: 2

España : 2
Portugal: 1

USA: 1
Belgica: 2

Suiza: 1
Colombia: 2

Argentina: 2
gipto:1

Chander

Marruecos : 2
Canada : 0

Paraguay: 1
Francia: 3

Brasil : 2
Noruega: 1

México: 1
Inglaterra: 2

España : 3
Portugal: 2

USA: 2
Belgica: 1

Suiza: 1
Colombia  : 2

Argentina: 2
Egipto: 0

Jomar

Marruecos :2
Canada :1

Paraguay:1
Francia:2

Brasil :2
Noruega:2

México:2
Inglaterra:1

España :2
Portugal:1

USA:2
Belgica:1

Suiza:0
Colombia  :2

Argentina:2
Egipto1

Raynel

Marruecos :2
Canada :1

Paraguay:1
Francia:2

Brasil :2
Noruega:2

México:2
Inglaterra:1

España :2
Portugal:1

USA:2
Belgica:1

Suiza:0
Colombia:2

Argentina:3
Egipto:1

Franco

Marruecos : 3
Canada : 1

Paraguay: 2
Francia: 3

Brasil : 2
Noruega: 1

México: 2
Inglaterra: 1

España :2
Portugal:3

USA: 2
Belgica: 1

Suiza: 1
Colombia  : 2

Argentina: 3
Egipto 0

Werner Dario

Marruecos : 1
Canada : 0

Paraguay: 0
Francia: 3

Brasil : 2
Noruega: 2

México: 1
Inglaterra: 2

España : 2
Portugal: 0

USA: 2
Belgica: 1

Suiza: 0
Colombia  : 2

Argentina: 2
Egipto: 0

Werner

Marruecos : 1
Canada : 0

Paraguay: 0
Francia: 2

Brasil : 2
Noruega: 0

México: 1
Inglaterra: 2

España : 2
Portugal: 1

USA: 1
Belgica: 1

Suiza: 1
Colombia  : 1

Argentina: 3
Egipto: 1


Jefferson

Marruecos : 2
Canada : 1

Paraguay: 1
Francia: 3

Brasil : 1
Noruega: 1

México: 2
Inglaterra: 1

España: 2
Portugal: 1

USA: 1
Belgica: 1

Suiza: 0
Colombia: 1

Argentina: 3
Egipto: 1

Omar Alberto

Marruecos: 2
Canada: 1

Paraguay: 0
Francia: 3

Brasil: 2
Noruega: 0

México: 1
Inglaterra: 2

España : 2
Portugal: 1

USA: 2
Belgica: 0

Suiza: 0
Colombia: 1

Argentina: 2
 Egipto: 1

Jesus David

Marruecos : 1
Canada : 2
.
Paraguay: 1
Francia: 1
.
Brasil : 1
Noruega: 2
.
México: 2
Inglaterra: 1
.
España : 1
Portugal: 3
.
USA: 2
Belgica: 0
.
Suiza: 2
Colombia  : 2
.
Argentina: 0
Egipto : 0

Dawson

Marruecos : 2
Canada :      1

Paraguay:   1
Francia:      3

Brasil :       3
Noruega:   2

México:     2
Inglaterra: 1

España :  1
Portugal: 2

USA:      0
Belgica: 2

Suiza:    1
Colombia:1

Argentina:3
Egipto:     1

Jasue

Marruecos: 2
Canada: 1

Paraguay: 1
Francia: 1

Brasil: 2
Noruega: 0

México: 1
Inglaterra: 2

España : 1
Portugal: 1

USA: 1
Belgica: 1

Suiza: 1
Colombia: 2

Argentina: 2
Egipto: 0

Luciano

Marruecos 2 - 1 Canadá

Paraguay 0 - 1 Francia

Brasil 2 - 1 Noruega

México 1 - 2 Inglaterra

España 1 - 2 Portugal

USA 1 - 2 Bélgica

Suiza 0 - 1 Colombia

argentina vs egito 2-1

Gabriel

CANADA.          0
MARRUECOS.   1

PARAGUAY.  1
FRANCIA.     3

BRASIL.        1
NORUEGA.   2

MEXICO.             2
INGLATERRA.     2

PORTUGAL.   0
ESPAÑA.        2

ESTADOS UNIDOS.   1
BELGICA.                    1

ARGENTINA: 3
EGIPTO : 0

COLOMBIA :  0
SUIZA: 1`;

const TEAM_MAP: Record<string, string> = {
  'canadá': 'Canadá',
  'canada': 'Canadá',
  'brasil': 'Brasil',
  'noruega': 'Noruega',
  'paraguay': 'Paraguay',
  'francia': 'Francia',
  'méxico': 'México',
  'mexico': 'México',
  'inglaterra': 'Inglaterra',
  'españa': 'España',
  'espana': 'España',
  'portugal': 'Portugal',
  'usa': 'Estados Unidos',
  'estados unidos': 'Estados Unidos',
  'belgica': 'Bélgica',
  'bélgica': 'Bélgica',
  'suiza': 'Suiza',
  'colombia': 'Colombia',
  'argentina': 'Argentina',
  'egipto': 'Egipto',
  'egito': 'Egipto',
  'marruecos': 'Marruecos',
  'maruecos': 'Marruecos',
  'gipto': 'Egipto',
};

const PARTICIPANT_MAP: Record<string, string> = {
  'werner dario': 'Werner Dario',
  'omar alberto': 'Omar Alberto',
  'dawson': 'Dawson',
  'jefferson': 'Jefferson',
  'werner': 'Werner',
  'gabriel': 'Gabriel',
  'jomar': 'Jomar',
  'omareño': 'Omareño',
  'alwin': 'Alwin',
  'franco': 'Franco',
  'raynel': 'Raynel',
  'chander': 'Alexander',
  'jasue': 'Josue',
  'jesus david': 'David',
  'luciano': 'Luciano',
};

const OCTAVOS_MATCHES = [
  { id: 89, local: 'Paraguay', visitante: 'Francia' },
  { id: 90, local: 'Canadá', visitante: 'Marruecos' },
  { id: 91, local: 'Brasil', visitante: 'Noruega' },
  { id: 92, local: 'México', visitante: 'Inglaterra' },
  { id: 93, local: 'Portugal', visitante: 'España' },
  { id: 94, local: 'Estados Unidos', visitante: 'Bélgica' },
  { id: 95, local: 'Argentina', visitante: 'Egipto' },
  { id: 96, local: 'Suiza', visitante: 'Colombia' },
];

function normalizeTeam(raw: string): string | null {
  const cleaned = raw.trim().replace(/^[.\s-]+|[.\s-]+$/g, '').toLowerCase();
  return TEAM_MAP[cleaned] ?? null;
}

function parseGoals(raw: string): number | null {
  const match = raw.trim().match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

interface ParsedPrediction {
  team1: string;
  goals1: number;
  team2: string;
  goals2: number;
}

function parseBothTeamsLine(line: string): ParsedPrediction | null {
  // Format: "Equipo X - Y Equipo"  or "Equipo X-Y Equipo"
  const parts = line.split(/\s*-\s*/);
  if (parts.length !== 2) return null;

  const left = parts[0].trim();
  const right = parts[1].trim();

  // Left: look for team name ending with a number
  const leftMatch = left.match(/^(.*?)\s+(\d+)$/);
  if (!leftMatch) return null;

  const team1 = normalizeTeam(leftMatch[1]);
  const goals1 = parseGoals(leftMatch[2]);
  if (!team1 || goals1 === null) return null;

  // Right: look for number followed by team name
  const rightMatch = right.match(/^(\d+)\s+(.*)$/);
  if (!rightMatch) return null;

  const goals2 = parseGoals(rightMatch[1]);
  const team2 = normalizeTeam(rightMatch[2]);
  if (!team2 || goals2 === null) return null;

  return { team1, goals1, team2, goals2 };
}

interface TeamGoal {
  team: string;
  goals: number;
}

function parseSingleTeamLine(line: string): TeamGoal | null {
  let cleaned = line.trim();
  if (!cleaned) return null;

  // Skip lines that are just dots/separators
  if (/^[.\s]+$/.test(cleaned)) return null;

  // Try colon format: "Equipo: X" or "Equipo : X"
  const colonIdx = cleaned.indexOf(':');
  if (colonIdx >= 0) {
    const teamRaw = cleaned.substring(0, colonIdx).trim();
    const goalsRaw = cleaned.substring(colonIdx + 1).trim();
    const team = normalizeTeam(teamRaw);
    const goals = parseGoals(goalsRaw);
    if (team && goals !== null) return { team, goals };
  }

  // Try "TEAM.    X" format (Gabriel style - team name with trailing dots/spaces then goals)
  const dotSpaceMatch = cleaned.match(/^([A-Za-záéíóúÁÉÍÓÚñÑ\s.]+?)\.{1,}\s*(\d+)\s*$/);
  if (dotSpaceMatch) {
    const team = normalizeTeam(dotSpaceMatch[1].replace(/\./g, '').trim());
    const goals = parseGoals(dotSpaceMatch[2]);
    if (team && goals !== null) return { team, goals };
  }

  // Try space-separated: "Equipo X" (last token is number)
  const spaceMatch = cleaned.match(/^(.+?)\s+(\d+)\s*\.?\s*$/);
  if (spaceMatch) {
    const team = normalizeTeam(spaceMatch[1]);
    const goals = parseGoals(spaceMatch[2]);
    if (team && goals !== null) return { team, goals };
  }

  // Fallback: try to extract known team name from start, then check trailing digits
  // e.g. "Egipto1" → "Egipto" + 1
  const knownTeams = Object.values(TEAM_MAP);
  for (const known of knownTeams) {
    const lowerKnown = known.toLowerCase();
    if (cleaned.toLowerCase().startsWith(lowerKnown)) {
      const rest = cleaned.slice(known.length).trim();
      if (rest && /^\d+$/.test(rest)) {
        const goals = parseInt(rest, 10);
        if (!isNaN(goals) && !cleaned.toLowerCase().includes(' - ')) {
          return { team: known, goals };
        }
      }
    }
  }

  return null;
}

function findMatchId(team1: string, team2: string): number | null {
  for (const m of OCTAVOS_MATCHES) {
    const hasLocal = team1 === m.local || team1 === m.visitante;
    const hasVisitante = team2 === m.local || team2 === m.visitante;
    if (hasLocal && hasVisitante && team1 !== team2) {
      return m.id;
    }
  }
  // Try reversed
  for (const m of OCTAVOS_MATCHES) {
    if (team1 === m.visitante && team2 === m.local) {
      return m.id;
    }
  }
  return null;
}

function getMatchInfo(team1: string, team2: string) {
  for (const m of OCTAVOS_MATCHES) {
    if (team1 === m.local && team2 === m.visitante) {
      return { id: m.id, swapped: false };
    }
    if (team1 === m.visitante && team2 === m.local) {
      return { id: m.id, swapped: true };
    }
  }
  return null;
}

async function main() {
  console.log('📥 Cargando pronósticos de octavos...\n');

  const participants = await prisma.participante.findMany();
  const partMap = new Map(participants.map(p => [p.nombre.toLowerCase(), p.id]));

  const lines = RAW.split('\n');
  const blocks: { rawName: string; lines: string[] }[] = [];
  let current: { rawName: string; lines: string[] } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    const lower = trimmed.toLowerCase();
    const mappedName = PARTICIPANT_MAP[lower];
    if (mappedName) {
      current = { rawName: mappedName, lines: [] };
      blocks.push(current);
    } else if (current) {
      current.lines.push(line);
    }
  }

  console.log(`📋 Detectados ${blocks.length} participantes\n`);

  let totalPredictions = 0;
  let errors: string[] = [];

  for (const block of blocks) {
    const predictions: ParsedPrediction[] = [];
    const parsedLines: TeamGoal[] = [];

    for (const line of block.lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === '.' || /^[\s.]+$/.test(trimmed)) continue;

      // Try both-teams format (Luciano style)
      const both = parseBothTeamsLine(trimmed);
      if (both) {
        predictions.push(both);
        continue;
      }

      // Try "argentina vs egito 2-1"
      const vsMatch = trimmed.match(/^(.+?)\s+vs\s+(.+?)\s+(\d+)\s*-\s*(\d+)$/i);
      if (vsMatch) {
        const team1 = normalizeTeam(vsMatch[1]);
        const team2 = normalizeTeam(vsMatch[2]);
        const g1 = parseInt(vsMatch[3], 10);
        const g2 = parseInt(vsMatch[4], 10);
        if (team1 && team2) {
          predictions.push({ team1, goals1: g1, team2, goals2: g2 });
          continue;
        }
      }

      const single = parseSingleTeamLine(trimmed);
      if (single) {
        parsedLines.push(single);
      }
    }

    // Pair up for non-Luciano formats
    if (predictions.length === 0) {
      for (let i = 0; i < parsedLines.length - 1; i += 2) {
        predictions.push({
          team1: parsedLines[i].team,
          goals1: parsedLines[i].goals,
          team2: parsedLines[i + 1].team,
          goals2: parsedLines[i + 1].goals,
        });
      }
      if (parsedLines.length % 2 !== 0) {
        errors.push(`${block.rawName}: línea impar (${parsedLines.length}), última "${parsedLines[parsedLines.length-1].team}:${parsedLines[parsedLines.length-1].goals}" ignorada`);
      }
    }

    console.log(`  ${block.rawName}: ${predictions.length} parejas`);

    if (predictions.length === 0) {
      errors.push(`${block.rawName}: 0 predicciones parseadas`);
      continue;
    }

    const participanteId = partMap.get(block.rawName.toLowerCase());
    if (!participanteId) {
      errors.push(`${block.rawName}: no encontrado en DB. Participantes disponibles: ${[...partMap.keys()].join(', ')}`);
      continue;
    }

    let matched = 0;
    for (const pred of predictions) {
      const matchInfo = getMatchInfo(pred.team1, pred.team2);
      if (!matchInfo) {
        errors.push(`${block.rawName}: no se encontró partido para ${pred.team1} vs ${pred.team2}`);
        continue;
      }

      const golesLocal = matchInfo.swapped ? pred.goals2 : pred.goals1;
      const golesVisitante = matchInfo.swapped ? pred.goals1 : pred.goals2;
      const equipoLocal = matchInfo.swapped ? pred.team2 : pred.team1;
      const equipoVisitante = matchInfo.swapped ? pred.team1 : pred.team2;

      try {
        await prisma.pronostico.create({
          data: {
            participante_id: participanteId,
            partido_id: matchInfo.id,
            goles_local_pronostico: golesLocal,
            goles_visitante_pronostico: golesVisitante,
          },
        });
        matched++;
        totalPredictions++;
        console.log(`    ✔️ Partido ${matchInfo.id} (${equipoLocal} vs ${equipoVisitante}): ${golesLocal}-${golesVisitante}`);
      } catch (err: any) {
        if (err.code === 'P2002') {
          // Already exists, skip
          errors.push(`${block.rawName}: pronóstico duplicado para partido ${matchInfo.id} (${equipoLocal} - ${equipoVisitante}), se omite`);
        } else {
          errors.push(`${block.rawName}: error insertando partido ${matchInfo.id}: ${err.message}`);
        }
      }
    }

    console.log(`    → ${matched} insertados para ${block.rawName}\n`);
  }

  console.log('\n═══════════════════════════════════');
  console.log(`✅ ${totalPredictions} pronósticos de octavos insertados`);
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
