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

  // get all departments

  console.log('Fetching departments');

  const departments = await client.department.appDepartmentControllerFindAll(
    undefined,
    undefined,
    1,
  );

  console.log('departments', departments);

  // create department

  const createDepartment =
    await client.department.appDepartmentControllerCreate({
      name: 'HR',
    });

  console.log('createDepartment', createDepartment);

  // update department

  const updateDepartment =
    await client.department.appDepartmentControllerUpdate(createDepartment.id, {
      name: 'Human Resources',
    });

  console.log('updateDepartment', updateDepartment);

  // get all departments

  const redepartments =
    await client.department.appDepartmentControllerFindAll();

  console.log('departments', redepartments);

  // add member
  const addMember = await client.department.appDepartmentControllerMembersAdd(
    createDepartment.id,
    {
      members: [PREAUTH.USER.id],
    },
  );

  console.log('addMember', addMember);

  // get all departments

  const re3departments =
    await client.department.appDepartmentControllerFindAll();

  console.log('departments', re3departments);

  // add member
  const removeMembers =
    await client.department.appDepartmentControllerMembersRemove(
      createDepartment.id,
      {
        members: [PREAUTH.USER.id],
      },
    );

  console.log('removeMembers', removeMembers);

  // get all departments

  const re4departments = await client.department.appDepartmentControllerFindAll(
    undefined,
    undefined,
    1,
    undefined,
    false,
  );

  console.log('departments', re4departments);

  // delete department

  const deleteDepartment =
    await client.department.appDepartmentControllerRemove(createDepartment.id);

  console.log('deleteDepartment', deleteDepartment);

  // get all departments

  const re2departments = await client.department.appDepartmentControllerFindAll(
    undefined,
    undefined,
    1,
    undefined,
    false,
  );

  console.log('departments', re2departments);
}

main().catch((e) => {
  console.error(e);
  console.error(JSON.stringify(e));
});
