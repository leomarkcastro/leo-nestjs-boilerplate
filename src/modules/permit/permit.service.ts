import { HttpException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { IUserJwt } from '../auth/types/UserJWT.dto';
import { PrismaService } from '../db-prisma/db-prisma.service';
import { PermitRule } from './permit-rule.types';

// create a new exception for PERMISSION_DENIED
export class PermissionDeniedException extends HttpException {
  constructor() {
    super('Permission denied', 401);
  }
}

@Injectable()
export class PermitService {
  constructor(private readonly db: PrismaService) {}

  // User can <action> on <resource> if User has permission A and permission B
  // User can <action> on <resource> if User is author of <resource>
  async checkPermit<V>(
    user: IUserJwt | null,
    resource: V,
    rule: PermitRule<V>,
  ): Promise<boolean> {
    switch (rule.type) {
      case 'Permission':
        return this.checkPermission(user, rule.role);
      case 'Condition':
        return rule.condition(user, resource);
      case 'AND':
        return this.checkAND(user, resource, rule.rules);
      case 'OR':
        return this.checkOR(user, resource, rule.rules);
    }
  }

  async checkPermission(user: IUserJwt | null, permission: string) {
    let role: Role;
    if (user) {
      const userObj = await this.db.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          Role: true,
        },
      });

      if (!userObj) throw new HttpException('User has no role', 403);

      role = userObj.Role;
    } else {
      role = await this.db.role.findFirst({
        where: {
          name: 'GUEST',
        },
      });
    }

    if (!role) throw new HttpException('User has no role', 403);

    // Cache Start === Role.<id>.PermissionOnRole
    const permissionsObjects = await this.db.role.findUnique({
      where: {
        id: role.id,
      },
      include: {
        PermissionOnRole: {
          include: {
            permission: true,
          },
        },
      },
    });
    const permissions = permissionsObjects.PermissionOnRole.map(
      (p) => p.permission.name,
    );
    // Cache End === Role.<id>.PermissionOnRole

    const permitted = permissions.includes(permission);
    if (!permitted) throw new PermissionDeniedException();
    return permitted;
  }

  async checkAND<V>(
    user: IUserJwt,
    resource: V,
    rules: PermitRule<V>[],
  ): Promise<boolean> {
    for (const rule of rules) {
      const result = await this.checkPermit(user, resource, rule);
      if (!result) throw new PermissionDeniedException();
    }
    return true;
  }

  async checkOR<V>(
    user: IUserJwt,
    resource: V,
    rules: PermitRule<V>[],
  ): Promise<boolean> {
    for (const rule of rules) {
      const result = await this.checkPermit(user, resource, rule);
      if (result) return true;
    }
    throw new PermissionDeniedException();
  }
}
