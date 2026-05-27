import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean = false;

  @IsNumber()
  @IsOptional()
  personId?: number;
}
