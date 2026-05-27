import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}
  async createSession(createSessionDto: CreateSessionDto) {
    try {
      await this.prisma.session.create({ data: createSessionDto });

      return true;
    } catch (error) {
      return false;
    }
  }
}
