import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OtpEnum } from 'src/common/constants/otp.enum';
import { generateOTP } from 'src/common/utils/uniqueId';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordResetDto } from './dto/password.dto';
import { environment } from '../../../common/config/environment';
import { extraUserData } from '../../../common/utils/response.';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { RoleService } from '../role/role.service';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private otpService: OtpService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    @InjectRepository(User)
    private userModel: Repository<User>,
    private roleService: RoleService,
  ) {}

  async checkEmail(email: string) {
    const user = await this.userModel.findOne({ where: { email: email } });
    if (user) {
      throw new BadRequestException(
        `This email already exist in ${environment.APP.NAME}`,
      );
    }
    return;
  }
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
  async checkReferralCode(code) {
    const referralCodeUser = await this.userModel.findOne({
      where: {
        referralCode: code,
      },
    });

    if (!referralCodeUser) {
      throw new BadRequestException(
        `This code does not exist in ${environment.APP.NAME}`,
      );
    }

    return referralCodeUser;
  }
  async validateUser(email: string, password: string) {
    const user = await this.userService.fullUserDetails(email);
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new NotFoundException('Invalid login credentials');
    }

    return user;
  }
  async register(requestData) {
    const { password, email, referralCode, role } = requestData;

    try {
      await this.checkEmail(email);

      let referrerId: string | null = null;

      // Check and retrieve the referrer ID if referralCode is provided
      if (referralCode) {
        const referrer = await this.checkReferralCode(referralCode);
        referrerId = referrer.id;
      }

      const hash = await this.hashPassword(password);

      const generatedReferralCode = generateOTP();

      const roleCheck = await this.roleService.findOne(role);

      const user = await this.userService.createUser({
        ...requestData,
        password: hash,
        referralCode: generatedReferralCode,
        referer: referrerId,
        role: roleCheck.name,
      });

      const accessToken = this.jwtService.sign({
        id: user.id,
        role: user.role,
      });

      await this.otpService.create(email, OtpEnum.EMAIL);
      await this.tokenService.create({ user: user.id, token: accessToken });

      return await extraUserData(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`${error.index} already exists`);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
  async login(request: LoginDto) {
    const { email, password } = request;

    const userObj = await this.validateUser(email, password);

    if (userObj.isActive !== true) {
      throw new BadRequestException('User need to verify account before login');
    }

    const accessToken = this.jwtService.sign({
      id: userObj.id,
      role: userObj.role,
    });

    await this.tokenService.create({
      user: userObj.id,
      token: accessToken,
    });

    const user = await extraUserData(userObj);

    return {
      user,
      accessToken,
    };
  }
  async resetPassword(requestData: ForgotPasswordResetDto) {
    const { otp, password } = requestData;

    const otpObj = await this.otpService.validate({
      otp,
      reason: OtpEnum.PASSWORD,
    });

    const hash = await this.hashPassword(password);

    const updateResult = await this.userModel.update(
      { email: otpObj.email },
      { password: hash },
    );

    if (updateResult.affected && updateResult.affected > 0) {
      await this.otpService.clear(otp);
    } else {
      throw new BadRequestException(
        'Could not reset password. User not found.',
      );
    }
  }
}
