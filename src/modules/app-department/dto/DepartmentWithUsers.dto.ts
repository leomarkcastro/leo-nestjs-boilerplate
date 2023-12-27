import { Department } from '@/global/prisma-classes/department';
import { User } from '@/global/prisma-classes/user';

export class DepartmentWithUsers extends Department {
  User: User[];
}
