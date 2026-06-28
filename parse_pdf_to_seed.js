const fs = require('fs');

const text = fs.readFileSync('_temp_final_pdf.txt', 'utf-8');
const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const allParticipants = new Set();
const matchesMap = new Map();
const predictions = [];

let currentParticipants = [];
let currentDate = null;
let parsingParticipants = false;

const dateRegex = /(\d{2}\/\d{2}\/\d{4}\s+\d{1,2}:\d{2}[ap]m)/i;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('RESULTADO')) {
        const parts = line.split('RESULTADO');
        const headerMatch = dateRegex.exec(parts[0]);
        if (headerMatch) {
            currentDate = headerMatch[1].trim();
        }

        let participantsStr = parts[1].trim();
        participantsStr = participantsStr.replace('GILBERTO MARTINEZ WILMAR MALDONADO', 'GILBERTO MARTINEZ  WILMAR MALDONADO');
        currentParticipants = participantsStr.split(/\s{2,}/).map(p => p.trim()).filter(p => p);
        currentParticipants.forEach(p => allParticipants.add(p));
        
        parsingParticipants = true;
        continue;
    }

    if (parsingParticipants) {
        // Stop parsing participants if we hit a date or a team line
        if ((dateRegex.test(line) && !line.includes('X')) || line.includes(' X ') || line.match(/\sX\s/)) {
            parsingParticipants = false;
        } else {
            let lineFixed = line.replace('GABRIEL MALDONADOWERNER MALDONADO DAVID MALDONADO', 'GABRIEL MALDONADO  WERNER MALDONADO  DAVID MALDONADO');
            const moreParticipants = lineFixed.split(/\s{2,}/).map(p => p.trim()).filter(p => p && p !== 'X' && p !== '0');
            for (let p of moreParticipants) {
                 currentParticipants.push(p);
                 allParticipants.add(p);
            }
            continue;
        }
    }

    // Detect standalone date
    const dateMatch = dateRegex.exec(line);
    if (dateMatch && !line.includes('X')) {
        currentDate = dateMatch[1].trim();
        continue;
    }

    // Detect team line
    if (line.includes(' X ') || line.match(/\sX\s/)) {
        const localLine = line;
        let awayLine = lines[i + 1];
        
        if (!awayLine || (!awayLine.includes(' X ') && !awayLine.match(/\sX\s/))) {
            if (lines[i+2] && (lines[i+2].includes(' X ') || lines[i+2].match(/\sX\s/))) {
               awayLine = lines[i+2];
               i++;
            } else {
               continue;
            }
        }

        let localParts = localLine.split(/\s+X\s+/);
        let localTeam = localParts[0].replace(dateRegex, '').trim();
        let localGoalsStr = localParts[1].trim().split(/\s+/);
        
        let awayParts = awayLine.split(/\s+X\s+/);
        let awayTeam = awayParts[0].trim();
        let awayGoalsStr = awayParts[1].trim().split(/\s+/);

        const matchKey = `${localTeam} vs ${awayTeam}`;
        
        if (!matchesMap.has(matchKey) && currentDate) {
            matchesMap.set(matchKey, {
                fecha: currentDate,
                equipo_local: localTeam,
                equipo_visitante: awayTeam,
                estado: 'PENDIENTE'
            });
        }

        for (let j = 0; j < currentParticipants.length; j++) {
            const participant = currentParticipants[j];
            const localG = parseInt(localGoalsStr[j], 10);
            const awayG = parseInt(awayGoalsStr[j], 10);
            
            if (!isNaN(localG) && !isNaN(awayG)) {
                predictions.push({
                    participant,
                    matchKey,
                    goles_local: localG,
                    goles_visitante: awayG
                });
            }
        }

        i++; 
    }
}

console.log(`Found ${allParticipants.size} participants.`);
console.log(`Found ${matchesMap.size} matches.`);
console.log(`Found ${predictions.length} predictions.`);

let seedContent = `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏟️  Iniciando seed de la Quiniela Mundial 2026 (Real Data)...');

  await prisma.puntajePartido.deleteMany();
  await prisma.pronostico.deleteMany();
  await prisma.partido.deleteMany();
  await prisma.participante.deleteMany();
  console.log('✅ Datos anteriores eliminados');

  const participantsList = ${JSON.stringify(Array.from(allParticipants), null, 2)};
  
  const participantMap = new Map();
  for (const name of participantsList) {
    const p = await prisma.participante.create({
      data: { nombre: name }
    });
    participantMap.set(name, p.id);
  }
  console.log('✅ ' + participantsList.length + ' participantes creados');

  const matchesData = ${JSON.stringify(Array.from(matchesMap.values()), null, 2)};
  
  const matchMap = new Map();
  for (const mData of matchesData) {
    const dateMatch = mData.fecha.match(/(\\d{2})\\/(\\d{2})\\/(\\d{4})\\s+(\\d{1,2}):(\\d{2})([ap]m)/i);
    let isoDate = new Date().toISOString();
    if (dateMatch) {
        let [_, day, month, year, hourStr, min, ampm] = dateMatch;
        let hourNum = parseInt(hourStr, 10);
        if (ampm.toLowerCase() === 'pm' && hourNum < 12) hourNum += 12;
        if (ampm.toLowerCase() === 'am' && hourNum === 12) hourNum = 0;
        
        isoDate = new Date(Date.UTC(parseInt(year), parseInt(month)-1, parseInt(day), hourNum, parseInt(min))).toISOString();
    }

    const partido = await prisma.partido.create({
      data: {
        fecha: isoDate,
        equipo_local: mData.equipo_local,
        equipo_visitante: mData.equipo_visitante,
        estado: 'PENDIENTE',
        goles_local_real: null,
        goles_visitante_real: null,
      }
    });
    matchMap.set(\`\${mData.equipo_local} vs \${mData.equipo_visitante}\`, partido.id);
  }
  console.log('✅ ' + matchesData.length + ' partidos creados');

  const predictionsData = ${JSON.stringify(predictions, null, 2)};
  
  const pronosticosToInsert = predictionsData.map(p => {
     return {
        participante_id: participantMap.get(p.participant),
        partido_id: matchMap.get(p.matchKey),
        goles_local_pronostico: p.goles_local,
        goles_visitante_pronostico: p.goles_visitante,
     };
  }).filter(p => p.participante_id && p.partido_id);

  const chunkSize = 1000;
  let count = 0;
  for (let i = 0; i < pronosticosToInsert.length; i += chunkSize) {
     const chunk = pronosticosToInsert.slice(i, i + chunkSize);
     await prisma.pronostico.createMany({ data: chunk });
     count += chunk.length;
  }
  
  console.log('✅ ' + count + ' pronósticos creados');
  
  console.log('🏆 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;

fs.writeFileSync('prisma/seed.ts', seedContent);
console.log('Generated prisma/seed.ts');
