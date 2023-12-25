// import prisma client
import { PrismaClient } from '@prisma/client';
import { PERMISSIONS } from '../../modules/permit/permissions.types';

// instantiate prisma client
const prisma = new PrismaClient();

async function main() {
  const ROLES_TO_CREATE = ['GUEST', 'ADMIN', 'USER', 'DEV'];
  const PERMISSIONS_TO_CREATE = [];
  for (const role in PERMISSIONS) {
    for (const permission in PERMISSIONS[role]) {
      PERMISSIONS_TO_CREATE.push(PERMISSIONS[role][permission]);
    }
  }
  const PERMISSIONS_TO_ROLE = {
    ADMIN: [],
    USER: [],
    GUEST: [
      PERMISSIONS.AUTH.LOGIN,
      PERMISSIONS.AUTH.REGISTER,
      PERMISSIONS.AUTH.RESET_PASSWORD,
    ],
  };

  PERMISSIONS_TO_ROLE['DEV'] = [
    ...PERMISSIONS_TO_ROLE.ADMIN,
    PERMISSIONS.TEST.USE,
  ];

  // create roles
  const roles = await Promise.all(
    ROLES_TO_CREATE.map(async (role) => {
      // check if role exists
      const roleExists = await prisma.role.findFirst({
        where: {
          name: role,
        },
      });
      if (roleExists) {
        return roleExists;
      }
      return await prisma.role.create({
        data: {
          name: role,
        },
      });
    }),
  );

  // create permissions
  const permissions = await Promise.all(
    PERMISSIONS_TO_CREATE.map(async (permission) => {
      // check if permission exists
      const permissionExists = await prisma.permission.findFirst({
        where: {
          name: permission,
        },
      });
      if (permissionExists) {
        return permissionExists;
      }
      return await prisma.permission.create({
        data: {
          name: permission,
        },
      });
    }),
  );

  // assign permissions to roles
  await Promise.all(
    roles.map(async (role) => {
      const permissionsToAssign = PERMISSIONS_TO_ROLE[role.name];
      await Promise.all(
        permissionsToAssign.map(async (permission) => {
          // check if permission is already assigned to role
          const permissionAssigned = await prisma.permissionOnRole.findFirst({
            where: {
              roleId: role.id,
              permissionId: permissions.find((p) => p.name === permission).id,
            },
          });
          if (permissionAssigned) {
            return permissionAssigned;
          }
          await prisma.permissionOnRole.create({
            data: {
              roleId: role.id,
              permissionId: permissions.find((p) => p.name === permission).id,
            },
          });
        }),
      );
    }),
  );
}

main();
