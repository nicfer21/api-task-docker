import { IsDateString, IsString, Length, Min } from 'class-validator';

export class CreatePersonDto {
  @IsString()
  name!: string;

  @IsDateString()
  birthday!: string;

  @IsString()
  @Length(4, 120)
  password!: string;
}
