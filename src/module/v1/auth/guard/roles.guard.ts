import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from 'src/common/constants/user.constants';
import { AuthGuard } from '@nestjs/passport';
import { ROLES_KEY } from '../../../../common/decorator/roles.decorator';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleEnum[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userType = request.user.role;
    return roles.some((r) => r === userType);
  }
}
