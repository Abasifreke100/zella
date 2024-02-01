import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LevelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  threshold: number;
}
