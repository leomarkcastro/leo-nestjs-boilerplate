import { PartialType } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class UpdatableUser {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  // check if avatar is a url that ends with .jpg, .png, .jpeg
  @IsUrl()
  avatar: string;

  @IsString()
  description: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;
}

export class PartialUpdatableUser extends PartialType(UpdatableUser) {}

export class IUserMe extends UpdatableUser {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  role: string;
  roleId: string;
  position: string;
  positionId: string;
  department: string;
  departmentId: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar: string;
  address: string;
  description: string;
  phone: string;
}
