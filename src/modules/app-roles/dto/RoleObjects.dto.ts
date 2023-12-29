import { Permission } from '@/global/prisma-classes/permission';
import { PermissionOnRole } from '@/global/prisma-classes/permission_on_role';
import { Role } from '@/global/prisma-classes/role';
import { PartialType } from '@nestjs/swagger';

export class CreateRole {
  name: string;
}

export class UpdateRole extends PartialType(CreateRole) {}

export class RoleWithPermissions extends Role {
  PermissionOnRole: PermissionOnRoleWithPermission[];
}

export class PermissionOnRoleWithPermission extends PermissionOnRole {
  Permission: Permission;
}
