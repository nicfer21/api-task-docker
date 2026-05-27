import { IsNumber, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsNumber()
  personId!: number;
}
