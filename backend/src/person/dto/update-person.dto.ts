import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonDto } from './create-person.dto';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class UpdatePersonDto extends PartialType(CreatePersonDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsDateString()
  @IsOptional()
  birthday?: string;

  @IsString()
  @Length(4, 120)
  password!: string;
}
