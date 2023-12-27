import axios from 'axios';
import { api } from './_client_gen';
import { PREAUTH } from './preAuths';

async function createFile() {
  const client = api();

  // Login
  const login = await client.auth.appAuthControllerLogin({
    username: PREAUTH.ADMIN.email,
    password: PREAUTH.ADMIN.password,
  });

  console.log('login', login);

  // Me
  client.request.config.TOKEN = login.accessToken;

  // create presigned urls

  console.log('Generating Presigned Upload URL');

  const uploadURLs = await client.file.appFileControllerGeneratePresignedUrls({
    fileNames: ['test.txt'],
  });

  console.log('uploadURLs', uploadURLs);

  // mock upload file

  // 1. create text file buffer with content "Hello World"
  const fileBuffer = Buffer.from('Hello World');

  // 2. upload to uploadURLs[0].uploadURL using axios (use PUT method)
  await axios.put(uploadURLs[0].uploadURL, fileBuffer);

  // create file object

  const createFileObject = await client.file.appFileControllerCreateObject({
    files: [
      {
        name: 'test.txt',
        size: 0,
        type: 'text/plain',
        url: uploadURLs[0].viewURL,
      },
    ],
  });

  console.log('createFileObject', createFileObject);

  return createFileObject;
}

async function testUserGet() {
  const client = api();

  // Login
  const login = await client.auth.appAuthControllerLogin({
    username: PREAUTH.USER.email,
    password: PREAUTH.USER.password,
  });

  console.log('login', login);

  // Me
  client.request.config.TOKEN = login.accessToken;

  // get all boards

  console.log('Fetching boards');

  const boards = await client.task.appTaskControllerGetBoard();

  console.log('boards', boards);

  if (boards.length === 0) {
    return console.log('No board found');
  }

  // get all lists of a board

  const lists = await client.task.appTaskControllerGetTask(boards[0].id);

  console.log('lists', lists);
}

async function testUserAddTask(listId: string) {
  const client = api();

  // Login
  const login = await client.auth.appAuthControllerLogin({
    username: PREAUTH.USER.email,
    password: PREAUTH.USER.password,
  });

  console.log('login', login);

  // Me
  client.request.config.TOKEN = login.accessToken;

  const createTask = await client.task.appTaskControllerCreateTask({
    title: 'Hello World',
    dueDate: new Date().toISOString(),
    listId: listId,
    priority: 'low',
  });

  console.log('createTask', createTask);
}

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

  // create board

  const createBoard = await client.task.appTaskControllerCreateBoard({
    name: 'Hello World',
  });

  console.log('createBoard', createBoard);

  // update board

  const updateBoard = await client.task.appTaskControllerUpdateBoard(
    createBoard.id,
    {
      name: 'Hello World 2',
    },
  );

  console.log('updateBoard', updateBoard);

  // create list

  const createList = await client.task.appTaskControllerCreateList({
    name: 'Hello World',
    boardId: createBoard.id,
  });

  console.log('createList', createList);

  // update list

  const updateList = await client.task.appTaskControllerUpdateList(
    createList.id,
    {
      name: 'Hello World 2',
    },
  );

  console.log('updateList', updateList);

  // create task

  const createTask = await client.task.appTaskControllerCreateTask({
    title: 'Hello World',
    dueDate: new Date().toISOString(),
    listId: createList.id,
    priority: 'low',
  });

  console.log('createTask', createTask);

  // update task

  const updateTask = await client.task.appTaskControllerUpdateTask(
    createTask.id,
    {
      title: 'Hello World 2',
    },
  );

  console.log('updateTask', updateTask);

  // get all list of a board

  const lists = await client.task.appTaskControllerGetTask(createBoard.id);

  console.log('lists', lists);

  // add member

  const addMember = await client.task.appTaskControllerAddMembersToBoard(
    createBoard.id,
    {
      members: [
        {
          userId: PREAUTH.USER.id,
        },
      ],
    },
  );

  console.log('addMember', addMember);

  await testUserGet();

  // modify member

  const modifyMember = await client.task.appTaskControllerModifyMembersOnBoard(
    createBoard.id,
    {
      members: [
        {
          userId: PREAUTH.USER.id,
          type: 'EDIT',
        },
      ],
    },
  );

  console.log('modifyMember', modifyMember);

  await testUserAddTask(createList.id);

  // delete member

  const deleteMember = await client.task.appTaskControllerDeleteMembersOnBoard(
    createBoard.id,
    {
      members: [
        {
          userId: PREAUTH.USER.id,
        },
      ],
    },
  );

  console.log('deleteMember', deleteMember);

  await testUserGet();

  // add file to task

  const createFileObject = await createFile();

  const addFile = await client.task.appTaskControllerAddFileToTask(
    createTask.id,
    {
      files: [
        {
          fileId: createFileObject[0].id,
          taskId: createTask.id,
        },
      ],
    },
  );

  console.log('addFile', addFile);

  // get all list of a board

  const lists2 = await client.task.appTaskControllerGetTask(createBoard.id);

  console.log('lists2', lists2);

  // delete file from task

  const deleteFile = await client.task.appTaskControllerDeleteFileToTask(
    createTask.id,
    {
      files: [
        {
          fileId: createFileObject[0].id,
          taskId: createTask.id,
        },
      ],
    },
  );

  console.log('deleteFile', deleteFile);

  // delete task

  const deleteTask = await client.task.appTaskControllerDeleteTask(
    createTask.id,
  );

  console.log('deleteTask', deleteTask);

  // delete list

  const deleteList = await client.task.appTaskControllerDeleteList(
    createList.id,
  );

  console.log('deleteList', deleteList);

  // delete board

  const deleteBoard = await client.task.appTaskControllerDeleteBoard(
    createBoard.id,
  );

  console.log('deleteBoard', deleteBoard);
}

main().catch((e) => {
  console.error(e);
  console.error(JSON.stringify(e));
});
