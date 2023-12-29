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

  // Me
  if (login.type === AuthResponse.type.JWT) {
    client.request.config.TOKEN = login.jwt.accessToken;
  }

  // get all contacts

  console.log('Fetching contacts');

  const contacts = await client.contacts.appContactsControllerFindAll(
    undefined,
    undefined,
    1,
  );

  console.log('contacts', contacts);

  // create contact

  const createContact = await client.contacts.appContactsControllerCreate({
    email: 'john3@doe.com',
    firstName: 'John3',
  });

  console.log('createContact', createContact);

  // update contact

  const updateContact = await client.contacts.appContactsControllerUpdate(
    createContact.id,
    {
      lastName: 'Doe',
    },
  );

  console.log('updateContact', updateContact);

  // get all contacts

  const recontacts = await client.contacts.appContactsControllerFindAll();

  console.log('contacts', recontacts);

  // search a contact

  const oneContact = await client.contacts.appContactsControllerFindAll('Doe');

  console.log('oneContact', oneContact);

  // delete contact

  const deleteContact = await client.contacts.appContactsControllerRemove(
    createContact.id,
  );

  console.log('deleteContact', deleteContact);

  // get all contacts

  const re2contacts = await client.contacts.appContactsControllerFindAll(
    undefined,
    undefined,
    1,
    undefined,
    false,
  );

  console.log('contacts', re2contacts);
}

main().catch((e) => {
  console.error(e);
  console.error(JSON.stringify(e));
});
