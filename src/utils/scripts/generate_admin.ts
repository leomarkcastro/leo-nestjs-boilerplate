import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { Roles } from '../../global/types/Roles.dto';

// instantiate prisma client
const prisma = new PrismaClient();

export async function generate_admin() {
  const email = 'leo+bdbadmin@rvo.group';
  const password = '@Admin123';
  const hashedPassword = hashSync(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      LocalAuth: {
        create: {
          password: hashedPassword,
        },
      },
      Role: {
        connect: {
          name: Roles.ADMIN,
        },
      },
    },
  });

  console.log(user);
}
