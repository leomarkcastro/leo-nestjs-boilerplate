import { Department } from '@/global/prisma-classes/department';
import { Position } from '@/global/prisma-classes/position';
import { Role } from '@/global/prisma-classes/role';
import { User } from '@/global/prisma-classes/user';
import { PartialType } from '@nestjs/swagger';

export class UserCreate {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  description?: string;
  phone?: string;
  avatar?: string;
  address?: string;
  roleId?: string;
  departmentId?: string;
  positionId?: string;
  company?: string;
  jobTitle?: string;
}

export class UserUpdate extends PartialType(UserCreate) {}

export class UserWithRelations extends User {
  Role?: Role;
  Department?: Department;
  Position?: Position;
}
