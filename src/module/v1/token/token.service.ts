import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entity/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenModel: Repository<Token>,
  ) {}

  async findOneUserToken(userId: string) {
    const token = await this.tokenModel.findOne({
      where: {
        user: { id: userId },
      },
    });

    return token;
  }

  async create(requestData) {
    const { user } = requestData;

    const existingToken = await this.findOneUserToken(user);

    if (existingToken) {
      existingToken.token = requestData.token;
      await this.tokenModel.save(existingToken);

      return existingToken;
    }

    const newToken = await this.tokenModel.create({
      user: requestData.user,
      token: requestData.token,
    });

    await this.tokenModel.save(newToken);

    return newToken;
  }

  async findOne(requestData) {
    const authorize = await this.tokenModel.findOne({
      where: {
        user: requestData.user,
        token: requestData.token,
      },
    });

    return authorize;
  }

  async clear() {
    return await this.tokenModel.delete({
      user: null,
    });
  }

  async logout(id: string) {
    const token = await this.findOneUserToken(id);
    if (token) await this.tokenModel.remove(token);

    return;
  }
}
