import { IUserJwt } from '@/modules/auth/types/UserJWT.dto';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): IUserJwt => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return null;
    }
    return data ? user[data] : user;
  },
);
