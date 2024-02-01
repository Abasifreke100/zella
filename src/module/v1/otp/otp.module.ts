import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { User } from '../user/entity/user.entity';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entity/otp.entity';

@Module({
  imports: [MailModule, TypeOrmModule.forFeature([Otp, User])],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
