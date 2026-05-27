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
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import type { Request } from 'express';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  async getAllPerson() {
    return await this.personService.getAllPersons();
  }

  @Get('/session')
  async getOnePersonSession(@Req() req: Request) {
    const person = req['person'];
    return await this.personService.getOnePersonSession(person.id);
  }

  @Get('/task/:id')
  async getOnePersonTask(
    @Req() req: Request,
    @Param() param: Record<string, any>,
  ) {
    return await this.personService.getOnePersonTask(+param.id);
  }

  @Post()
  async createPerson(@Body() createPersonDto: CreatePersonDto) {
    return await this.personService.createPerson(createPersonDto);
  }
  @Patch()
  async updatePerson(
    @Req() req: Request,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    const person = req['person'];
    return await this.personService.updatePerson(person.id, updatePersonDto);
  }

  @Delete()
  async deletePerson(@Req() req: Request) {
    const person = req['person'];
    return await this.personService.deletePerson(person.id);
  }
}
