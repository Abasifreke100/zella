import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import {
  TransactionCategoryEnum,
  TransactionTypeEnum,
} from '../../../../common/constants/payment.constant';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsEnum(TransactionTypeEnum)
  @IsOptional()
  type?: TransactionTypeEnum;

  @IsEnum(TransactionCategoryEnum)
  @IsOptional()
  category?: TransactionCategoryEnum;

}
