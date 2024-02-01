import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { UserModule } from '../user/user.module';
import { TransactionModule } from '../transaction/transaction.module';
import { BadgeModule } from '../badge/badge.module';
import { LevelModule } from '../level/level.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { Transaction } from '../transaction/entity/transaction.entity';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Transaction]),
    UserModule,
    TransactionModule,
    LevelModule,
    BadgeModule,
    WalletModule,
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
