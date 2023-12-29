import { AuthResponse } from '../api';
import { api, randomString } from './_client_gen';
import { PREAUTH } from './preAuths';

async function main() {
  const client = api();

  const user = PREAUTH.ADMIN.email;
  const password = PREAUTH.ADMIN.password;

  // Login
  const login = await client.auth.appAuthControllerLogin({
    username: user,
    password,
  });

  console.log('login', login);

  if (login.type === AuthResponse.type.JWT) {
    client.request.config.TOKEN = login.jwt.accessToken;
  }

  // get roles
  const roles = await client.roles.appRolesControllerGetRolesList();

  console.log('roles', roles);

  // get the USER role
  const userRole = roles.find((role) => role.name === 'USER');

  const userAccount = `leomarkcastro123+${randomString(5, 8)}` + '@gmail.com';

  // craete user

  const createUser = await client.users.appUsersControllerCreate({
    email: userAccount,
    roleId: userRole.id,
  });

  console.log('createUser', createUser);

  // update user

  const updateUser = await client.users.appUsersControllerUpdate(
    createUser.id,
    {
      firstName: 'Dev Leo Mark',
      lastName: 'Dev Castro',
    },
  );

  console.log('updateUser', updateUser);

  // get user

  const getUser = await client.users.appUsersControllerGetOne(createUser.id);

  console.log('getUser', getUser);

  // delete user

  const deleteUser = await client.users.appUsersControllerDelete(createUser.id);

  console.log('deleteUser', deleteUser);

  // get user list

  const getUsers = await client.users.appUsersControllerGetList();

  console.log('getUsers', getUsers);
}

main().catch((e) => console.error(JSON.stringify(e)));
