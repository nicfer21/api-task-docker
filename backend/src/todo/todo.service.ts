import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async getOneToDo(id: number) {
    try {
      const res = await this.prisma.toDo.findFirstOrThrow({
        where: { id: id },
      });
      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createToDo(createTodoDto: CreateTodoDto) {
    try {
      if (!createTodoDto.personId) {
        throw new BadRequestException();
      }
      const res = await this.prisma.toDo.create({
        data: {
          title: createTodoDto.title,
          description: createTodoDto.description,
          personId: createTodoDto.personId,
        },
      });
      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateToDo(id: number, updateTodoDto: UpdateTodoDto) {
    try {
      const res = await this.prisma.toDo.update({
        where: {
          id: id,
          personId: updateTodoDto.personId,
        },
        data: updateTodoDto,
      });
      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async completeToDo(id: number, personId: number) {
    try {
      const res = await this.prisma.toDo.update({
        where: {
          id: id,
          personId: personId,
        },
        data: {
          completed: true,
        },
      });
      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async incompleteToDo(id: number, personId: number) {
    try {
      const res = await this.prisma.toDo.update({
        where: {
          id: id,
          personId: personId,
        },
        data: {
          completed: false,
        },
      });
      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteToDo(id: number, personId: number) {
    try {
      const res = await this.prisma.toDo.delete({
        where: {
          id: id,
          personId: personId,
        },
      });
      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
