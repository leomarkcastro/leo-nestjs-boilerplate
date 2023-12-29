import { AuthResponse } from '../api';
import { api, randomString } from './_client_gen';

async function main() {
  const client = api();

  const user = `leomarkcastro123+${randomString(5, 8)}` + '@gmail.com';
  const password = `@Password-${user}`;

  // Register
  const register = await client.auth.appAuthControllerRegister({
    email: user,
    password,
  });

  console.log('register', register);

  // Login
  const login = await client.auth.appAuthControllerLogin({
    username: user,
    password,
  });

  console.log('login', login);

  if (login.type === AuthResponse.type.JWT) {
    client.request.config.TOKEN = login.jwt.accessToken;
  }

  const me = await client.auth.appAuthControllerMe();

  console.log('me', me);

  // Update
  const update = await client.auth.appAuthControllerUpdate({
    firstName: 'John',
    lastName: 'Doe',
  });

  console.log('update', update);

  const newMe = await client.auth.appAuthControllerMe();

  console.log('newMe', newMe);

  // Change Password

  const changePassword = await client.auth.appAuthControllerChangePassword({
    oldPassword: password,
    newPassword: `${password}new`,
  });

  console.log('changePassword', changePassword);

  // Forgot Password
  const forgotPassword =
    await client.auth.appAuthControllerRequestResetPassword({
      email: user,
    });

  console.log('forgotPassword', forgotPassword);
}

main().catch((e) => console.error(JSON.stringify(e)));
