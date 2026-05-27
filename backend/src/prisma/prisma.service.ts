import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /* De manera obligatoria poner siempre el constructor y el super para conectarlo al adaptador de PG */
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error(
        'DATABASE_URL no está definida en las variables de entorno',
      );
    }

    const adapter = new PrismaPg({ connectionString });

    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Prueba de conexión exitosa');

      /* console.log('🌱 Comenzando con el seed de datos :');
      console.log('->');

      const person = await this.person.upsert({
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
      ); */
    } catch (error) {
      console.log(error);
    } finally {
      await this.$disconnect();
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
