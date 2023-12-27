// import prisma client
import { PrismaClient } from '@prisma/client';
import { Roles } from '../../global/types/Roles.dto';
import { PERMISSIONS } from '../../modules/permit/permissions.types';

// instantiate prisma client
const prisma = new PrismaClient();

function recursivelyGetValues(obj: any) {
  const values: string[] = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      values.push(...recursivelyGetValues(obj[key]));
    } else {
      values.push(obj[key]);
    }
  }
  return values;
}

async function main() {
  const ROLES_TO_CREATE = Object.values(Roles);
  const PERMISSIONS_TO_CREATE = recursivelyGetValues(PERMISSIONS);

  const PERMISSIONS_TO_ROLE = {
    USER: [
      PERMISSIONS.AUTH.CHANGE_PASSWORD,
      PERMISSIONS.AUTH.ME,
      PERMISSIONS.AUTH.UPDATEME,
      ...recursivelyGetValues(PERMISSIONS.FILE),
      ...recursivelyGetValues(PERMISSIONS.EVENTS.EVENT),
      PERMISSIONS.EVENTS.CALENDAR.GET,
      PERMISSIONS.EVENTS.EVENT.GET,
      ...recursivelyGetValues(PERMISSIONS.TASK),
      PERMISSIONS.NOTIF.READ,
    ],
    GUEST: [
      PERMISSIONS.AUTH.LOGIN,
      PERMISSIONS.AUTH.REGISTER,
      PERMISSIONS.AUTH.RESET_PASSWORD,
    ],
  };

  PERMISSIONS_TO_ROLE['ADMIN'] = [
    ...PERMISSIONS_TO_ROLE.USER,
    ...recursivelyGetValues(PERMISSIONS.CONTACTS),
    ...recursivelyGetValues(PERMISSIONS.DEPARTMENTS),
    ...recursivelyGetValues(PERMISSIONS.EVENTS),
    ...recursivelyGetValues(PERMISSIONS.FILE),
    ...recursivelyGetValues(PERMISSIONS.NOTIF),
    ...recursivelyGetValues(PERMISSIONS.POSITIONS),
    ...recursivelyGetValues(PERMISSIONS.TASK),
  ];

  PERMISSIONS_TO_ROLE['DEV'] = [
    ...PERMISSIONS_TO_ROLE['ADMIN'],
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
        console.log(`Role ${role} already exists`);
        return roleExists;
      }
      console.log(`Creating role ${role}`);
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
        console.log(`Permission ${permission} already exists`);
        return permissionExists;
      }
      console.log(`Creating permission ${permission}`);
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
            console.log(
              `Permission ${permission} already assigned to role ${role.name}`,
            );
            return permissionAssigned;
          }
          console.log(
            `Assigning permission ${permission} to role ${role.name}`,
          );
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

  // delete all PermissionOnRole that is not in PERMISSIONS_TO_ROLE
  const permissionOnRoles = await prisma.permissionOnRole.findMany();
  await Promise.all(
    permissionOnRoles.map(async (permissionOnRole) => {
      const permission = await prisma.permission.findUnique({
        where: {
          id: permissionOnRole.permissionId,
        },
      });
      const role = await prisma.role.findUnique({
        where: {
          id: permissionOnRole.roleId,
        },
      });
      if (!PERMISSIONS_TO_ROLE[role.name].includes(permission.name)) {
        console.log(
          `Deleting permission ${permission.name} from role ${role.name}`,
        );
        await prisma.permissionOnRole.delete({
          where: {
            id: permissionOnRole.id,
          },
        });
      }
    }),
  );
}

main();
