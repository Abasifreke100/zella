import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LoggedInUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user ?? null;
  },
);

export interface ILoggedInUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  isSuspended: boolean;
}
