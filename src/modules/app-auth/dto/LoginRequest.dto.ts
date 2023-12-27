import { IsString } from 'class-validator';

export class LoginUser_Request {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
