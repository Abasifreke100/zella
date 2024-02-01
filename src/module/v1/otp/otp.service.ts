import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { environment } from 'src/common/config/environment';
import { OtpEnum } from 'src/common/constants/otp.enum';
import { generateOTP } from 'src/common/utils/uniqueId';
import { MailService } from '../mail/mail.service';
import { otpTemplate } from '../mail/template/otp';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { Otp } from './entity/otp.entity';

interface IVerifyEmail {
  // email: string;
  otp: number;
  reason: OtpEnum;
}

@Injectable()
export class OtpService {
  constructor(
    private mailService: MailService,
    @InjectRepository(Otp)
    private otpModel: Repository<Otp>,

    @InjectRepository(User)
    private userModel: Repository<User>,
  ) {}

  async create(email: string, reason) {
    const otp = generateOTP();
    const subject = `${environment.APP.NAME} - One-time password`;

    const payload = {
      email: email,
      reason: reason,
      otp: otp,
    };

    // Delete all existing OTPs for the given email
    await this.otpModel.delete({ email });

    const createdOtp = this.otpModel.create({
      ...payload,
    });

    if (!createdOtp) {
      throw new BadRequestException('Could not create OTP');
    }

    await this.mailService.sendMail({
      to: email,
      subject,
      template: otpTemplate({ otp }),
    });

    return await this.otpModel.save(createdOtp);
  }
  async sendOtpForExistingUsers(email: string, reason: OtpEnum): Promise<Otp> {
    const user = await this.userModel.findOne({ where: { email: email } });
    if (!user) throw new NotFoundException('This email does not exist');
    return this.create(email, reason);
  }
  async validate({ otp, reason }: IVerifyEmail) {
    const validateOtp = await this.otpModel.findOne({
      where: {
        otp: otp,
        deactivated: false,
        reason,
      },
    });
    if (!validateOtp) throw new BadRequestException('Invalid OTP');

    return validateOtp;
  }

  async emailConfirmation({ otp }: { otp: number }): Promise<void> {
    const validateOtp = await this.otpModel.findOne({
      where: { otp, deactivated: false },
    });

    if (!validateOtp) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.otpModel.update(validateOtp.id, { deactivated: true });
  }

  async confirmEmail({ otp }) {
    return await this.emailConfirmation({ otp });
  }

  async sendOtp(email: string) {
    const otp = generateOTP();
    const subject = `${environment.APP.NAME} - One-time password`;

    const payload = {
      email: email,
      reason: OtpEnum.EMAIL,
    };

    await this.otpModel.update(
      { email, deactivated: false },
      { deactivated: true },
    );

    // Create a new OTP record
    const createdOtp = this.otpModel.create({
      ...payload,
    });

    if (!createdOtp) {
      throw new BadRequestException('Could not create OTP');
    }

    await this.mailService.sendMail({
      to: email,
      subject,
      template: otpTemplate({ otp }),
    });

    return await this.otpModel.save(createdOtp);
  }

  async verifyOtp(requestData) {
    const otp = await this.otpModel.findOne({
      where: { otp: requestData.otp },
    });

    if (!otp) {
      throw new NotFoundException('Invalid OTP');
    }

    const user = await this.userModel.findOne({
      where: {
        email: otp.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = true;
    await this.userModel.save(user);

    await this.otpModel.remove(otp);

    return user;
  }

  async clear(otp) {
    return await this.otpModel.delete({
      otp: otp,
    });
  }
}
