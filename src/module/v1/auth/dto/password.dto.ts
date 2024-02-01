import {
  IsEmail,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsStrongPassword } from '../../user/dto/password.validator';

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ForgotPasswordResetDto {
  @IsNumber()
  otp: number;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsStrongPassword()
  @IsString()
  password: string;
}
