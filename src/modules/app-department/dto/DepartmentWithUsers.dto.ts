import { Department } from '@/global/prisma-classes/department';
import { UserWithRelation } from '@/global/prisma-classes/user_with_relation';

export class DepartmentWithUsers extends Department {
  User: UserWithRelation[];
}
