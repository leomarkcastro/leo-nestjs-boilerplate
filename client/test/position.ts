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

  // Me
  client.request.config.TOKEN = login.accessToken;

  // get all positions

  console.log('Fetching positions');

  const positions = await client.position.appPositionControllerFindAll(
    undefined,
    undefined,
    1,
  );

  console.log('positions', positions);

  // create position

  const createPosition = await client.position.appPositionControllerCreate({
    name: 'Vice President',
  });

  console.log('createPosition', createPosition);

  // update position

  const updatePosition = await client.position.appPositionControllerUpdate(
    createPosition.id,
    {
      name: 'COO',
    },
  );

  console.log('updatePosition', updatePosition);

  // get all positions

  const repositions = await client.position.appPositionControllerFindAll();

  console.log('positions', repositions);

  // add member
  const addMember = await client.position.appPositionControllerMembersAdd(
    createPosition.id,
    {
      members: [PREAUTH.USER.id],
    },
  );

  console.log('addMember', addMember);

  // get all positions

  const re3positions = await client.position.appPositionControllerFindAll();

  console.log('positions', re3positions);

  // add member
  const removeMembers =
    await client.position.appPositionControllerMembersRemove(
      createPosition.id,
      {
        members: [PREAUTH.USER.id],
      },
    );

  console.log('removeMembers', removeMembers);

  // get all positions

  const re4positions = await client.position.appPositionControllerFindAll(
    undefined,
    undefined,
    1,
    undefined,
    false,
  );

  console.log('positions', re4positions);

  // delete position

  const deletePosition = await client.position.appPositionControllerRemove(
    createPosition.id,
  );

  console.log('deletePosition', deletePosition);

  // get all positions

  const re2positions = await client.position.appPositionControllerFindAll(
    undefined,
    undefined,
    1,
    undefined,
    false,
  );

  console.log('positions', re2positions);
}

main().catch((e) => {
  console.error(e);
  console.error(JSON.stringify(e));
});
