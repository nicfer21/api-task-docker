import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import type { Request } from 'express';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('/task/:id')
  async getOneToDo(@Param() param: { id: number }) {
    return this.todoService.getOneToDo(+param.id);
  }

  @Post('/task')
  async createToDo(@Req() req: Request, @Body() createTodoDto: CreateTodoDto) {
    const person = req['person'];

    return await this.todoService.createToDo({
      ...createTodoDto,
      personId: person.id,
    });
  }

  @Patch('/task/:id')
  async updateToDo(
    @Req() req: Request,
    @Body() updateToDoDto: UpdateTodoDto,
    @Param() param: { id: number },
  ) {
    const person = req['person'];

    return await this.todoService.updateToDo(+param.id, {
      ...updateToDoDto,
      personId: person.id,
    });
  }

  @Patch('/task/complete/:id')
  async completeToDo(@Req() req: Request, @Param() param: { id: number }) {
    const person = req['person'];

    return await this.todoService.completeToDo(+param.id, person.id);
  }

  @Patch('/task/incomplete/:id')
  async incompleteToDo(@Req() req: Request, @Param() param: { id: number }) {
    const person = req['person'];

    return await this.todoService.incompleteToDo(+param.id, person.id);
  }

  @Delete('/task/delete/:id')
  async deleteToDo(@Req() req: Request, @Param() param: { id: number }) {
    const person = req['person'];

    return await this.todoService.deleteToDo(+param.id, person.id);
  }
}
