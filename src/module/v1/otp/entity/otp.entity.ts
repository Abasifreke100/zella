import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OtpEnum } from '../../../../common/constants/otp.enum';

@Entity({ name: 'otps' })
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  otp: number;

  @Column({ default: false })
  deactivated: boolean;

  @Column()
  email: string;

  @Column({ default: OtpEnum.EMAIL })
  reason: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    type: 'timestamp',
    default: () => `CURRENT_TIMESTAMP + INTERVAL 300 SECOND`,
  })
  expiresAt: Date;
}
