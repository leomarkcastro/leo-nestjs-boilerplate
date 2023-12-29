import { AuthResponse } from '../api';
import { api } from './_client_gen';
import { PREAUTH } from './preAuths';

async function main() {
  const client = api();

  // Login
  const login = await client.auth.appAuthControllerLogin({
    username: PREAUTH.ADMIN.email,
    password: PREAUTH.ADMIN.password,
  });

  console.log('login', login);

  if (login.type === AuthResponse.type.JWT) {
    client.request.config.TOKEN = login.jwt.accessToken;
  }

  // get roles
  const roles = await client.roles.appRolesControllerGetRolesList();

  console.log('roles', roles);

  // check if has role

  const hasRole = await client.roles.appRolesControllerGetMyPermissions({
    permissions: ['FLAGS_ADMINUI', 'AUTH_LOGIN'],
  });

  console.log('hasRole', hasRole);

  // create new role

  const createRole = await client.roles.appRolesControllerCreateRole({
    name: 'Observer',
  });

  console.log('createRole', createRole);

  // update role

  const updateRole = await client.roles.appRolesControllerUpdateRole(
    createRole.id,
    {
      name: 'HR',
    },
  );

  console.log('updateRole', updateRole);

  // get role permissions

  const rolePermissions = await client.roles.appRolesControllerGetRoles();

  console.log('rolePermissions', rolePermissions);

  // get roles with permissions

  const permissions = await client.roles.appRolesControllerGetPermissions();

  console.log('permissions', permissions);

  // assign permission to role

  const assignPermissionToRole =
    await client.roles.appRolesControllerApplyPermissions(createRole.id, [
      permissions[0].id,
    ]);

  console.log('assignPermissionToRole', assignPermissionToRole);

  // get roles with permissions

  const roles2 = await client.roles.appRolesControllerGetRoles();

  console.log('roles2', roles2);

  // remove permission from role

  const removePermissionFromRole =
    await client.roles.appRolesControllerRemovePermissions(createRole.id, [
      permissions[0].id,
    ]);

  console.log('removePermissionFromRole', removePermissionFromRole);

  // get roles with permissions

  const roles3 = await client.roles.appRolesControllerGetRoles();

  console.log('roles3', roles3);

  // delete role

  const deleteRole = await client.roles.appRolesControllerDeleteRole(
    createRole.id,
  );

  console.log('deleteRole', deleteRole);
}

main().catch((e) => console.error(JSON.stringify(e)));
