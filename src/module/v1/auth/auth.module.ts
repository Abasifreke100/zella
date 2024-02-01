import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guard/jwt.guard';
import { environment } from 'src/common/config/environment';
import { LocalStrategy } from './strategy/local.strategy';
// import { JwtStrategy } from './strategy/auth.strategy';
import { TokenModule } from '../token/token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { RoleModule } from '../role/role.module';
import { OtpModule } from '../otp/otp.module';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UserModule,
    RoleModule,
    OtpModule,
    PassportModule,
    TokenModule,
    TypeOrmModule.forFeature([User]),
    {
      ...JwtModule.register({
        secret: environment.JWT.SECRET,
        signOptions: { expiresIn: '1h' },
      }),
      global: true,
    },
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
