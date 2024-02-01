import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BadgeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  threshold: number;
}
