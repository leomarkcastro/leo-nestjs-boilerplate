import { generate_admin } from './generate_admin';
import { generate_boards } from './generate_boards';
import { generate_roles_and_permissions } from './generate_roles_and_permissions';
import { generate_situations } from './generate_situations';

async function main() {
  await generate_roles_and_permissions();
  await generate_admin();
  await generate_boards();
  await generate_situations();
}

main();
