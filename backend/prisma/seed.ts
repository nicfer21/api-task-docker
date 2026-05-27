import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Comenzando con el seed de datos :');
  console.log('->');
  console.log('->');

  const person = await prisma.person.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'nicfer21',
      password: '1234',
      birthday: new Date('2026-05-25'),
    },
  });
  console.log(
    `   ✔ Se creo ${person.name} => ${person.id}, ${person.birthday} `,
  );
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
