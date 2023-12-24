import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IUserJwt } from '../../auth/types/UserJWT.dto';
import { PermitService } from '../permit.service';
import { PERMIT_KEY } from './permit.constants';

@Injectable()
export class SimplePermitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly permit: PermitService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<string>(PERMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRole) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const userObj: IUserJwt = user;
    return await this.permit.checkPermit(
      userObj,
      {},
      {
        type: 'Permission',
        role: requiredRole,
      },
    );
  }
}
