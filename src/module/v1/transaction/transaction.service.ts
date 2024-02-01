import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionCategoryEnum } from '../../../common/constants/payment.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entity/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionModel: Repository<Transaction>,
  ) {}

  async updateIsUsd(
    transactionId: string,
    isUsd: boolean,
  ): Promise<Transaction> {
    const transaction = await this.transactionModel.findOne({
      where: {
        id: transactionId,
      },
    });

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with ID ${transactionId} not found.`,
      );
    }

    transaction.isUsd = isUsd;

    return await this.transactionModel.save(transaction);
  }

  async createTransaction(requestData) {
    const transaction = this.transactionModel.create({
      user: requestData.user,
      status: requestData.status,
      reference: requestData.reference,
      amount: requestData.amount,
      type: requestData.type,
      currency: requestData.currency,
      category: requestData.category,
      isUsd: requestData.isUsd,
    });

    return await this.transactionModel.save(transaction);
  }

  async getReferralBonusTransactions(userId: string): Promise<Transaction[]> {
    const transactions = await this.transactionModel.find({
      where: {
        user: { id: userId },
        category: TransactionCategoryEnum.REF_BONUS,
      },
    });

    return transactions;
  }

  async sumReferralBonusAmount(userId: string): Promise<number> {
    try {
      const referralBonusTransactions = await this.getReferralBonusTransactions(
        userId,
      );

      /** Calculate the total sum of amounts for user's referral bonus transactions **/
      const totalReferralBonusAmount = referralBonusTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0,
      );

      return totalReferralBonusAmount;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getTransactionsByUserId(userId: string) {
    const transactions = await this.transactionModel.find({
      where: {
        user: { id: userId },
        isUsd: true,
      },
    });

    return transactions;
  }

  async calculateTotalSum(userId: string): Promise<any> {
    try {
      const userTransactions = await this.getTransactionsByUserId(userId);

      /** Calculate the total sum of amounts for user transactions **/
      const totalSum = userTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0,
      );

      return totalSum;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async paginate(
    query: any,
    user,
  ): Promise<{
    response: Transaction[];
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

    const queryBuilder =
      this.transactionModel.createQueryBuilder('transaction');

    const count = await queryBuilder
      .where('transaction.user = :userId', { userId: user.id })
      .getCount();

    const response = await queryBuilder
      .where('transaction.user = :userId', { userId: user.id })
      .skip(size * (currentPage - 1))
      .take(size)
      .orderBy('transaction.createdAt', sortOrder)
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
}
