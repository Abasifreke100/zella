import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { CurrencyEnum } from '../../../../common/constants/payment.constant';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  user: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsEnum(CurrencyEnum)
  @IsOptional()
  currency?: CurrencyEnum;

  @IsNotEmpty()
  @IsString()
  pin: string;
}
