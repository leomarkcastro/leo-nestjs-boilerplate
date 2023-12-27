import { api } from './_client_gen';
import { PREAUTH } from './preAuths';

async function checkNotification() {
  const client = api();

  // Login
  const login = await client.auth.appAuthControllerLogin({
    username: PREAUTH.USER.email,
    password: PREAUTH.USER.password,
  });

  console.log('login', login);

  // Me
  client.request.config.TOKEN = login.accessToken;

  // get all notifications

  const notifications =
    await client.notifications.appNotificationsControllerGetNotifications();

  console.log('notifications', notifications);
}

async function main() {
  await checkNotification();

  const client = api();

  // Login
  const login = await client.auth.appAuthControllerLogin({
    username: PREAUTH.ADMIN.email,
    password: PREAUTH.ADMIN.password,
  });

  console.log('login', login);

  // Me
  client.request.config.TOKEN = login.accessToken;

  // create broadcast

  console.log('Broadcasting');

  const broadcast =
    await client.notifications.appNotificationsControllerBroadcast({
      title: 'Hello World',
      content: 'Hello World',
      receivers: [PREAUTH.USER.id],
      type: 'info',
    });

  console.log('broadcast', broadcast);

  // get all notifications

  await checkNotification();

  // delete broadcast

  const deletedBroadcast =
    await client.notifications.appNotificationsControllerDeleteNotification({
      ids: [broadcast.id],
    });

  console.log('deletedBroadcast', deletedBroadcast);

  // get all notifications

  await checkNotification();
}

main().catch((e) => {
  console.error(e);
  console.error(JSON.stringify(e));
});
