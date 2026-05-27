import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PersonModule } from '../person/person.module';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    PersonModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWTword,
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthModule {}
