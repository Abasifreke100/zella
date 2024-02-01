import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from '../../transaction/entity/transaction.entity';
import { Payment } from '../../payment/entity/payment.entity';
import { Wallet } from '../../wallet/entity/wallet.entity';
import { Token } from '../../token/entity/token.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  pin: string;

  @Column({ default: false })
  hasPin: boolean;

  @Column({ default: false })
  isActive: boolean;

  @Column()
  referralCode: number;

  @Column()
  role: string;

  @Column({ nullable: true })
  level: string;

  @Column({ nullable: true })
  badge: string;

  @Column({ nullable: true })
  referer: number;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
