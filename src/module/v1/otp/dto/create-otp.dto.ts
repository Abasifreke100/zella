import { IsEmail, IsEnum, IsNumber, IsOptional, Length } from 'class-validator';
import { OtpEnum } from 'src/common/constants/otp.enum';

export class CreateOtpDto {
  @IsEmail()
  email: string;

  @IsEnum(OtpEnum)
  reason: OtpEnum;
}

export class VerifyOtpDto {
  @IsNumber()
  otp: number;
}

export class SendOtpDto {
  @IsEmail()
  email: string;
}
