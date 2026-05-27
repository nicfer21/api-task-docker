import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import morgan from 'morgan';

import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(morgan('dev'));
  console.log(process.env.POSTGRES_USER);
  console.log(process.env.POSTGRES_PASSWORD);
  console.log(process.env.POSTGRES_DB);

  console.log(process.env.DATABASE_URL);
  console.log(process.env.JWTword);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
