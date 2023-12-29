import { Role } from '@/global/prisma-classes/role';
import { Injectable } from '@nestjs/common';
import { IUserJwt } from '../auth/types/UserJWT.dto';
import { PrismaService } from '../db-prisma/db-prisma.service';
import {
  CreateRole,
  PermissionMapResponse,
  RoleWithPermissions,
  UpdateRole,
} from './dto/RoleObjects.dto';

@Injectable()
export class AppRolesService {
  constructor(private readonly database: PrismaService) {}

  async getRolesList(): Promise<Role[]> {
    return await this.database.role.findMany();
  }

  async getRolesInfo(): Promise<RoleWithPermissions[]> {
    return await this.database.role.findMany({
      include: {
        PermissionOnRole: {
          include: {
            Permission: true,
          },
        },
      },
    });
  }

  async createRole(data: CreateRole): Promise<Role> {
    return await this.database.role.create({
      data: {
        name: data.name,
        isCustom: true,
      },
    });
  }

  async updateRole(id: string, data: UpdateRole): Promise<Role> {
    return await this.database.role.update({
      where: {
        id,
      },
      data: {
        name: data.name,
      },
    });
  }

  async deleteRole(id: string): Promise<Role> {
    return await this.database.role.delete({
      where: {
        id,
        isCustom: true,
      },
    });
  }

  async getPermissions() {
    return await this.database.permission.findMany();
  }

  async applyPermissionsToRole(
    roleId: string,
    permissionIds: string[],
  ): Promise<RoleWithPermissions> {
    return await this.database.role.update({
      where: {
        id: roleId,
      },
      include: {
        PermissionOnRole: {
          include: {
            Permission: true,
          },
        },
      },
      data: {
        PermissionOnRole: {
          createMany: {
            data: permissionIds.map((id) => ({
              permissionId: id,
            })),
          },
        },
      },
    });
  }

  async removePermissionsFromRole(
    roleId: string,
    permissionIds: string[],
  ): Promise<RoleWithPermissions> {
    return await this.database.role.update({
      where: {
        id: roleId,
      },
      include: {
        PermissionOnRole: {
          include: {
            Permission: true,
          },
        },
      },
      data: {
        PermissionOnRole: {
          deleteMany: {
            permissionId: {
              in: permissionIds,
            },
          },
        },
      },
    });
  }

  async checkRole(user: IUserJwt): Promise<Role> {
    const userObj = await this.database.user.findUnique({
      where: { id: user.id },
      include: {
        Role: true,
      },
    });
    if (!userObj) throw new Error('User not found');
    return userObj.Role;
  }

  async hasPermissions(
    user: IUserJwt,
    permissions: string[],
  ): Promise<PermissionMapResponse> {
    const userObj = await this.database.user.findUnique({
      where: { id: user.id },
      include: {
        Role: {
          include: {
            PermissionOnRole: {
              include: {
                Permission: true,
              },
            },
          },
        },
      },
    });
    if (!userObj) throw new Error('User not found');
    const userPermissions = userObj.Role.PermissionOnRole.map(
      (permissionOnRole) => permissionOnRole.Permission.name,
    );
    const result = new Map<string, boolean>();
    permissions.forEach((permission) => {
      result.set(permission, userPermissions.includes(permission));
    });
    const resultObject = {};
    result.forEach((value, key) => {
      resultObject[key] = value;
    });
    return { permissions: resultObject };
  }
}
