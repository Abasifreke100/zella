import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdatePinDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { TokenService } from '../token/token.service';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userModel: Repository<User>,
    private tokenService: TokenService,
  ) {}

  async update(userId: string, updateData) {
    const user = await this.userModel.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateData);
    return await this.userModel.save(user);
  }

  async findReferee(code) {
    const user = await this.userModel.findOne({
      where: { referralCode: code },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findUserById(id) {
    const user = await this.userModel.findOne({ where: { id: id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(requestData) {
    try {
      const newUser = this.userModel.create({
        firstName: requestData.firstName,
        lastName: requestData.lastName,
        email: requestData.email,
        password: requestData.password,
        referralCode: requestData.referralCode,
        role: requestData.role,
        referer: requestData.referer,
      });

      const savedUser = await this.userModel.save(newUser);

      return savedUser;
    } catch (error) {
      console.error(error);

      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`${error.index} already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 12);
  }

  async fullUserDetails(email: string) {
    return await this.userModel.findOne({
      where: {
        email: email,
      },
    });
  }

  async logout(userId: string) {
    await this.tokenService.logout(userId);
  }

  async createPin(pin: string, user) {
    const hash = await this.hashData(pin);

    const updateResult = await this.userModel.update(
      { id: user.id },
      {
        pin: hash,
        hasPin: true,
      },
    );

    if (!updateResult) {
      throw new BadRequestException('Could not create transaction pin');
    }

    return null;
  }

  async changePin(requestData: UpdatePinDto, user) {
    const { pin, newPin } = requestData;

    const comparePin = await this.comparePin(pin, user.pin);
    if (!comparePin) {
      throw new NotFoundException('Incorrect current transaction pin');
    }

    if (pin === newPin) {
      throw new NotFoundException(
        'New transaction pin cannot be same as current transaction pin',
      );
    }
    if (!user.hasPin) {
      throw new BadRequestException(
        'You do not have an existing transaction pin',
      );
    }

    return await this.createPin(newPin, user);
  }

  async comparePin(plainPin, hashedPin): Promise<boolean> {
    return bcrypt.compare(plainPin, hashedPin);
  }

  async listReferredUsers(referralCode: string, query: any) {
    try {
      let { currentPage, size, sort } = query;

      currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
      size = Number(size) ? parseInt(size) : 10;
      sort = sort ? sort : 'DESC';

      const [result, total] = await this.userModel
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.firstName',
          'user.firstName',
          'user.email',
          'user.hasPin',
          'user.isActive',
          'user.referralCode',
          'user.role',
          'user.badge',
          'user.level',
          'user.createdAt',
        ])
        .where('user.referer = :referralCode', { referralCode })
        .orderBy('user.createdAt', sort)
        .skip(size * (currentPage - 1))
        .take(size)
        .getManyAndCount();

      return {
        response: result,
        pagination: {
          total: total,
          currentPage,
          size,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async countUserReferral(referralCode) {
    try {
      const total = await this.userModel
        .createQueryBuilder('user')
        .where('user.referer = :referralCode', { referralCode })
        .getCount();
      return total;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
