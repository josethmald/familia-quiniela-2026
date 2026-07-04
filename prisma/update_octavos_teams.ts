import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  { id: 89, local: 'Paraguay', visitante: 'Francia' },
  { id: 90, local: 'Canadá', visitante: 'Marruecos' },
  { id: 91, local: 'Brasil', visitante: 'Noruega' },
  { id: 92, local: 'México', visitante: 'Inglaterra' },
  { id: 93, local: 'Portugal', visitante: 'España' },
  { id: 94, local: 'Estados Unidos', visitante: 'Bélgica' },
  { id: 95, local: 'Argentina', visitante: 'Egipto' },
  { id: 96, local: 'Suiza', visitante: 'Colombia' },
];

async function main() {
  for (const u of updates) {
    const prev = await prisma.partido.findUnique({ where: { id: u.id } });
    await prisma.partido.update({
      where: { id: u.id },
      data: { equipo_local: u.local, equipo_visitante: u.visitante },
    });
    console.log(`✅ Partido ${u.id}: ${prev?.equipo_local} → ${u.local} | ${prev?.equipo_visitante} → ${u.visitante}`);
  }
  console.log('\n🎯 Octavos actualizados correctamente');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
