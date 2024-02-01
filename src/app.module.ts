import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { environment } from './common/config/environment';
import { LevelModule } from './module/v1/level/level.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from './module/v1/token/token.module';
import { RoleModule } from './module/v1/role/role.module';
import { BadgeModule } from './module/v1/badge/badge.module';
import { UserModule } from './module/v1/user/user.module';
import { AuthModule } from './module/v1/auth/auth.module';
import { OtpModule } from './module/v1/otp/otp.module';
import { MailModule } from './module/v1/mail/mail.module';
import { PaymentModule } from './module/v1/payment/payment.module';
import { TransactionModule } from './module/v1/transaction/transaction.module';
import { WalletModule } from './module/v1/wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // ThrottlerModule.forRootAsync({
    //   ttl: 60,
    //   limit: 10,
    // }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: environment.MYSQL.HOST,
      port: 3306,
      username: environment.MYSQL.USERNAME,
      password: environment.MYSQL.PASSWORD,
      database: environment.MYSQL.DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    TokenModule,
    RoleModule,
    LevelModule,
    BadgeModule,
    OtpModule,
    MailModule,
    PaymentModule,
    TransactionModule,
    WalletModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
