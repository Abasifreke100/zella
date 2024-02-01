import {
  BadRequestException,
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { EMAIL_VERIFIED, OTP_SENT } from 'src/common/constants/otp.constants';
import { OtpEnum } from 'src/common/constants/otp.enum';
import {
  FORGOT_PWD_RESET,
  LOGGED_IN,
  USER_CREATED,
} from 'src/common/constants/user.constants';
import { Public } from 'src/common/decorator/public.decorator';
import { ResponseMessage } from 'src/common/decorator/response.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { CheckOtpDto, LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ForgotPasswordResetDto } from './dto/password.dto';
import { OtpService } from '../otp/otp.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private otpService: OtpService,
  ) {}

  @Public()
  @Post('register')
  @ResponseMessage(USER_CREATED)
  async register(@Body() requestPayload: CreateUserDto) {
    return await this.authService.register(requestPayload);
  }
  @Public()
  @Post('verify/email')
  @ResponseMessage(EMAIL_VERIFIED)
  async verifyOtp(@Body() requestData: CheckOtpDto) {
    return await this.otpService.verifyOtp(requestData);
  }

  @Public()
  @Post('login')
  @ResponseMessage(LOGGED_IN)
  async login(@Body() requestPayload: LoginDto) {
    return await this.authService.login(requestPayload);
  }

  @Public()
  @Post('password/forgot')
  @ResponseMessage(OTP_SENT)
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return await this.otpService.sendOtpForExistingUsers(
      email,
      OtpEnum.PASSWORD,
    );
  }

  @Public()
  @Post('password/reset')
  @ResponseMessage(FORGOT_PWD_RESET)
  async resetPassword(@Body() requestData: ForgotPasswordResetDto) {
    return await this.authService.resetPassword(requestData);
  }
}
