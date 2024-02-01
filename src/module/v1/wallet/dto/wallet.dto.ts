import { IsNotEmpty, IsString } from 'class-validator';

export class WalletDto {
  @IsString()
  @IsNotEmpty()
  currencyCode: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
