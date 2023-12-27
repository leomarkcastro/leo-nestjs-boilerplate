import axios from 'axios';
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
}

main().catch((e) => {
  console.error(e);
  console.error(JSON.stringify(e));
});
