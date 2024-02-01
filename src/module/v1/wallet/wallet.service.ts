import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entity/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletModel: Repository<Wallet>,
  ) {}

  async create(requestData) {
    return this.walletModel.create({ ...requestData });
  }

  async createWallet(requestData, user) {
    const { currencyCode, type } = requestData;
    let precision = 2;

    if (currencyCode === 'USD') {
      precision = 8;
    }

    const existingWallet = await this.walletModel.findOne({
      where: {
        user,
        currencyCode,
        type,
      },
    });

    if (existingWallet) {
      if (currencyCode === 'USD' && type === 'static') {
        throw new BadRequestException('User already has a static USD wallet.');
      } else if (currencyCode === 'USD' && type === 'express') {
        throw new BadRequestException(
          'User already has an express USD wallet.',
        );
      } else if (currencyCode === 'NGN' && type === 'static') {
        throw new BadRequestException('User already has an NGN wallet.');
      }
    }

    let newWallet;

    if (currencyCode === 'USD') {
      newWallet = await this.create({
        ...requestData,
        user,
        usdBalance: 0,
      });
      newWallet.usdBalance = +newWallet.usdBalance.toFixed(precision);
    } else {
      newWallet = await this.create({
        ...requestData,
        user,
        ngnBalance: 0,
      });

      newWallet.ngnBalance = +newWallet.ngnBalance.toFixed(precision);
    }

    const saveWallet = await this.walletModel.save(newWallet);

    return {
      id: saveWallet.id,
      ngnBalance: currencyCode === 'NGN' ? saveWallet.ngnBalance : undefined,
      usdBalance: currencyCode === 'USD' ? saveWallet.usdBalance : undefined,
      type: saveWallet.type,
      currencyCode: saveWallet.currencyCode,
      createdAt: saveWallet.createdAt,
    };
  }

  async paginate(
    query: any,
    user,
  ): Promise<{
    response: Wallet[];
    pagination: { total: number; currentPage: number; size: number };
  }> {
    let { currentPage, size, sortOrder } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 10;
    sortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC';

    delete query.currentPage;
    delete query.size;
    delete query.sort;
    delete query.type;

    const queryBuilder = this.walletModel.createQueryBuilder('wallet');

    const count = await queryBuilder
      .where('wallet.user = :userId', { userId: user.id })
      .getCount();

    const response = await queryBuilder
      .where('wallet.user = :userId', { userId: user.id })
      .skip(size * (currentPage - 1))
      .take(size)
      .orderBy('wallet.createdAt', sortOrder)
      .getMany();

    return {
      response,
      pagination: {
        total: count,
        currentPage,
        size,
      },
    };
  }

  async findOne(user: string, type: string, currencyCode: string) {
    const wallet = await this.walletModel.findOne({
      where: {
        user: { id: user },
        type: type,
        currencyCode: currencyCode,
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async findById(id: string) {
    const wallet = await this.walletModel.findOne({
      where: {
        id: id,
      },
    });

    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found.`);
    }

    return wallet;
  }

  async updateNgnAmount(walletId: string, amount): Promise<Wallet> {
    const wallet = await this.findById(walletId);
    wallet.ngnBalance += amount;

    return await this.walletModel.save(wallet);
  }

  async updateUsdAmount(walletId: string, amount): Promise<Wallet> {
    const wallet = await this.findById(walletId);
    wallet.usdBalance += amount;

    return await this.walletModel.save(wallet);
  }

  async updateBtcAmount(walletId: string, amount: number): Promise<Wallet> {
    const wallet = await this.findById(walletId);
    wallet.usdBalance += amount;

    return await this.walletModel.save(wallet);
  }
}
