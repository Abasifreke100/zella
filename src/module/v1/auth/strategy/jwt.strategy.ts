import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { environment } from 'src/common/config/environment';
import { UserService } from '../../user/user.service';
import { Request } from 'express';
import { TokenService } from '../../token/token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environment.JWT.SECRET,
    });
  }

  async validate(request: Request, payload: any) {
    try {
      const token = request.headers.authorization.replace('Bearer ', '');
      const userId = payload.id;

      const user = await this.userService.findUserById(userId);
      if (!user) {
        throw new UnauthorizedException('User not found.');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token.');
    }
  }
}
