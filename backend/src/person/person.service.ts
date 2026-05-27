import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SessionService } from '../session/session.service';

@Injectable()
export class PersonService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly session: SessionService,
  ) {}

  async getAllPersons() {
    try {
      const res = await this.prisma.person.findMany({
        include: {
          _count: { select: { sessions: true, toDos: true } },
        },
      });

      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getOnePersonSession(id: number) {
    try {
      const res = await this.prisma.person.findFirstOrThrow({
        where: { id: id },
        include: {
          sessions: { orderBy: { createdAt: 'desc' } },
        },
      });

      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getOnePersonTask(id: number) {
    try {
      const res = await this.prisma.person.findFirstOrThrow({
        where: { id: id },
        include: {
          toDos: { orderBy: { createdAt: 'desc' } },
        },
      });

      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getOneSingIn(name: string, password: string) {
    try {
      const res = await this.prisma.person.findFirstOrThrow({
        where: {
          name: name,
          password: password,
        },
      });

      if (!(await this.session.createSession({ personId: res.id }))) {
        throw new BadRequestException();
      }

      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createPerson(createPersonDto: CreatePersonDto) {
    try {
      const res = this.prisma.person.create({
        data: {
          ...createPersonDto,
          birthday: new Date(createPersonDto.birthday),
        },
        omit: { password: true },
      });

      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updatePerson(id: number, updatePersonDto: UpdatePersonDto) {
    try {
      const res = await this.prisma.person.update({
        where: { id },
        data: {
          ...updatePersonDto,
          birthday: updatePersonDto.birthday
            ? new Date(updatePersonDto.birthday)
            : undefined,
        },
      });
      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deletePerson(id: number) {
    try {
      const res = await this.prisma.person.delete({
        where: { id: id },
        omit: { password: true },
      });
      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
