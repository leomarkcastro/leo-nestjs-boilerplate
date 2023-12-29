import { Role } from '@/global/prisma-classes/role';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db-prisma/db-prisma.service';
import {
  CreateRole,
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
}
