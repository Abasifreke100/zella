import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsStrongPassword } from './password.validator';

export class CreateUserDto {
  @Length(2, 30)
  @IsString()
  firstName: string;

  @Length(2, 30)
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsStrongPassword()
  password: string;

  @IsNumber()
  @IsOptional()
  referralCode: number;

  @IsNumber()
  @IsOptional()
  referer: string;
}

export class CreatePinDto {
  @IsString()
  @Length(4, 4)
  pin: string;
}

export class UpdatePinDto {
  @IsString()
  pin: string;

  @IsString()
  @Length(4, 4)
  newPin: string;
}

export class PercentAllocationDto {
  percent: number;
}
