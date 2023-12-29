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
    ...recursivelyGetValues(PERMISSIONS.ROLES),
    ...recursivelyGetValues(PERMISSIONS.PERMISSIONS),
  ];

  PERMISSIONS_TO_ROLE['DEV'] = [
    ...PERMISSIONS_TO_ROLE['ADMIN'],
    PERMISSIONS.TEST.USE,
  ];

  const roles = [];
  // create roles
  for (const role of ROLES_TO_CREATE) {
    // check if role exists
    const roleExists = await prisma.role.findFirst({
      where: {
        name: role,
      },
    });
    if (roleExists) {
      console.log(`Role ${role} already exists`);
      roles.push(roleExists);
      continue;
    }
    console.log(`Creating role ${role}`);
    const _role = await prisma.role.create({
      data: {
        name: role,
      },
    });
    roles.push(_role);
  }

  const permissions = [];
  // create permissions
  for (const permission of PERMISSIONS_TO_CREATE) {
    // check if permission exists
    const permissionExists = await prisma.permission.findFirst({
      where: {
        name: permission,
      },
    });
    if (permissionExists) {
      console.log(`Permission ${permission} already exists`);
      permissions.push(permissionExists);
      continue;
    }
    console.log(`Creating permission ${permission}`);
    const _permission = await prisma.permission.create({
      data: {
        name: permission,
      },
    });
    permissions.push(_permission);
  }

  for (const role of roles) {
    const permissionsToAssign = PERMISSIONS_TO_ROLE[role.name];
    for (const permission of permissionsToAssign) {
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
        continue;
      }
      console.log(`Assigning permission ${permission} to role ${role.name}`);
      await prisma.permissionOnRole.create({
        data: {
          roleId: role.id,
          permissionId: permissions.find((p) => p.name === permission).id,
        },
      });
    }
  }

  console.log('Correcting permissions on roles drift');
  // delete all PermissionOnRole that is not in PERMISSIONS_TO_ROLE
  const permissionOnRoles = await prisma.permissionOnRole.findMany();
  for (const permissionOnRole of permissionOnRoles) {
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
  }
}

main();
