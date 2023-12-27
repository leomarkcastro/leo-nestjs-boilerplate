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
  position: string;
  department: string;
}
