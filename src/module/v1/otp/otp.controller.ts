import { Controller, Post, Body } from '@nestjs/common';
import { OtpService } from './otp.service';
import { CreateOtpDto, SendOtpDto, VerifyOtpDto } from './dto/create-otp.dto';
import { ResponseMessage } from 'src/common/decorator/response.decorator';
import { Public } from 'src/common/decorator/public.decorator';
import { EMAIL_VERIFIED, OTP_SENT } from 'src/common/constants/otp.constants';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Public()
  @ResponseMessage(OTP_SENT)
  @Post()
  async create(@Body() createOtpDto: CreateOtpDto) {
    const { email, reason } = createOtpDto;
    await this.otpService.sendOtpForExistingUsers(email, reason);
    return;
  }

  @Public()
  @ResponseMessage(EMAIL_VERIFIED)
  @Post('verify/email')
  async verifyEmail(@Body() verifyOtpDto: VerifyOtpDto) {
    const { otp } = verifyOtpDto;
    await this.otpService.confirmEmail({ otp });
    return;
  }

  @Public()
  @ResponseMessage(OTP_SENT)
  @Post('send')
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    const { email } = sendOtpDto;
    await this.otpService.sendOtp(email);
    return;
  }
}
