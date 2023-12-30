import { Permission } from '@/global/prisma-classes/permission';
import { PermissionOnRole } from '@/global/prisma-classes/permission_on_role';
import { Role } from '@/global/prisma-classes/role';
import { PERMISSIONS } from '@/modules/permit/permissions.types';
import { ApiProperty, PartialType } from '@nestjs/swagger';

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

function recursivelyGetValuesNoDuplicate(obj: any) {
  const values: string[] = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      values.push(...recursivelyGetValuesNoDuplicate(obj[key]));
    } else {
      values.push(obj[key]);
    }
  }

  // remove duplicates

  const uniqueValues = [...new Set(values)];

  return uniqueValues;
}
const flatPermissionList = recursivelyGetValuesNoDuplicate(PERMISSIONS);

export class PermissionToCheck {
  @ApiProperty({ enum: flatPermissionList, isArray: true })
  permissions: string[];
}

export class PermissionMapResponse {
  permissions: {
    [key: string]: boolean;
  };
}
