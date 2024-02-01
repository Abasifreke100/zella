import { IsString } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  user: string;

  @IsString()
  token: string;
}
