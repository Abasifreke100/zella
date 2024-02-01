import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TransactionService } from '../transaction/transaction.service';
import { generateReference } from '../../../common/utils/uniqueId';
import {
  CurrencyEnum,
  PAYMENT_PERCENTAGE_ENUM,
  TransactionCategoryEnum,
  TransactionTypeEnum,
  TypeEnum,
} from '../../../common/constants/payment.constant';
import { BadgeService } from '../badge/badge.service';
import { LevelService } from '../level/level.service';
import { PercentAllocationDto } from '../user/dto/create-user.dto';
import { User } from '../user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entity/payment.entity';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentModel: Repository<Payment>,
    private userService: UserService,
    private transactionService: TransactionService,
    private readonly badgeService: BadgeService,
    private readonly levelService: LevelService,
    private readonly walletService: WalletService,
  ) {}

  async createPayment(requestData) {
    const payment = this.paymentModel.create({
      user: requestData.user,
      amount: requestData.amount,
      status: requestData.status,
      currency: requestData.currency,
    });
    return await this.paymentModel.save(payment);
  }

  async makeDeposit(user: User, requestData) {
    const { pin, amount, currency } = requestData;
    const userId = user.id;

    if (user.hasPin === false) {
      throw new BadRequestException(
        'You do not have an existing transaction pin. Create one now!',
      );
    }

    const comparePin = await this.userService.comparePin(pin, user.pin);
    if (!comparePin) {
      throw new NotFoundException('Incorrect transaction pin');
    }

    try {
      /** Create payment and transaction records **/
      const [payment, transaction] = await Promise.all([
        this.createPayment({
          user: userId,
          amount: amount,
          status: 'success',
          currency: currency,
        }),
        this.transactionService.createTransaction({
          user: userId,

          status: 'success',
          reference: await generateReference(),
          amount: amount,
          type: TransactionTypeEnum.DEPOSIT,
          currency: currency,
          category: TransactionCategoryEnum.TNX,
        }),
      ]);

      /** Update user wallet balance **/
      let wallet;

      if (payment) {
        if (payment.currency === CurrencyEnum.USD) {
          await this.transactionService.updateIsUsd(transaction.id, true);

          wallet = await this.walletService.findOne(
            userId,
            TypeEnum.STATIC,
            CurrencyEnum.USD,
          );

          await this.walletService.updateUsdAmount(wallet.id, amount);
        } else if (currency === CurrencyEnum.BTC) {
          wallet = await this.walletService.findOne(
            userId,
            TypeEnum.EXPRESS,
            CurrencyEnum.BTC,
          );

          await this.walletService.updateBtcAmount(wallet.id, amount);
        } else if (currency === CurrencyEnum.NGN) {
          wallet = await this.walletService.findOne(
            userId,
            TypeEnum.STATIC,
            CurrencyEnum.NGN,
          );

          await this.walletService.updateNgnAmount(wallet.id, amount);
        }
      }

      /** Update the user level and badge base on total transaction */
      const totalSum = await this.transactionService.calculateTotalSum(userId);

      /** Upgrade User Badge **/
      await this.upgradeUserBadge(userId, totalSum);

      /** Upgrade User Level **/
      await this.upgradeUserLevel(userId, totalSum);

      /** Credit referrer if exist **/

      if (user.referer) {
        const referee = await this.userService.findReferee(user.referer);

        const percentAllocationDto = new PercentAllocationDto();

        percentAllocationDto.percent =
          PAYMENT_PERCENTAGE_ENUM.ONE_POINT_FIVE_PERCENT;

        await this.allocatePercentToReferrer(
          referee,
          amount,
          percentAllocationDto,
          currency,
        );
      }

      return payment;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async allocatePercentToReferrer(
    referee,
    paidAmount: number,
    percentAllocationDto: PercentAllocationDto,
    currency: string,
  ) {
    try {
      let wallet;

      const refereeId = referee.id;

      /** Calculate referer total transaction */
      const totalSum = await this.transactionService.calculateTotalSum(
        refereeId,
      );

      /** Allocate a percentage of the paid amount to the referrer's wallet **/
      const allocationAmount =
        (paidAmount * percentAllocationDto.percent) / 100;

      if (currency === CurrencyEnum.USD) {
        wallet = await this.walletService.findOne(
          refereeId,
          TypeEnum.STATIC,
          CurrencyEnum.USD,
        );

        await this.walletService.updateUsdAmount(wallet.id, allocationAmount);
        /** Create a transaction for the referrer **/
        await this.transactionService.createTransaction({
          user: refereeId,
          status: 'success',
          reference: await generateReference(),
          currency: currency,
          amount: allocationAmount,
          type: TransactionTypeEnum.DEPOSIT,
          category: TransactionCategoryEnum.REF_BONUS,
          isUsd: true,
        });
      } else if (currency === CurrencyEnum.BTC) {
        wallet = await this.walletService.findOne(
          refereeId,
          TypeEnum.EXPRESS,
          CurrencyEnum.BTC,
        );

        await this.walletService.updateBtcAmount(wallet.id, allocationAmount);
        /** Create a transaction for the referrer **/
        await this.transactionService.createTransaction({
          user: refereeId,
          status: 'success',
          reference: await generateReference(),
          currency: currency,
          amount: allocationAmount,
          type: TransactionTypeEnum.DEPOSIT,
          category: TransactionCategoryEnum.REF_BONUS,
          isUsd: true,
        });
      } else if (currency === CurrencyEnum.NGN) {
        wallet = await this.walletService.findOne(
          refereeId,
          TypeEnum.STATIC,
          CurrencyEnum.NGN,
        );

        await this.walletService.updateNgnAmount(wallet.id, allocationAmount);

        /** Create a transaction for the referrer **/
        await this.transactionService.createTransaction({
          user: refereeId,
          status: 'success',
          reference: await generateReference(),
          currency: currency,
          amount: allocationAmount,
          type: TransactionTypeEnum.DEPOSIT,
          category: TransactionCategoryEnum.REF_BONUS,
          isUsd: false,
        });
      }

      /** Upgrade User Badge **/
      await this.upgradeUserBadge(refereeId, totalSum);

      /** Upgrade User Level **/
      await this.upgradeUserLevel(refereeId, totalSum);

      return { referee, allocationAmount };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async upgradeUserBadge(userId: string, totalSum: number) {
    const badges = await this.badgeService.getAllBadges();
    const highestBadge = await this.findHighestThreshold(badges, totalSum);

    if (highestBadge) {
      await this.userService.update(userId, { badge: highestBadge.name });
    }
  }

  async upgradeUserLevel(userId: string, totalSum: number) {
    const levels = await this.levelService.getAllLevels();
    const highestLevel = await this.findHighestThreshold(levels, totalSum);

    if (highestLevel) {
      await this.userService.update(userId, { level: highestLevel.name });
    }
  }

  private async findHighestThreshold(entities: any[], totalSum: number) {
    return entities.reduce((prev, curr) => {
      if (
        curr.threshold <= totalSum &&
        curr.threshold > (prev?.threshold || 0)
      ) {
        return curr;
      }
      return prev;
    }, null);
  }
}
