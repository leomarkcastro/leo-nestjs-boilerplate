import { IsString } from 'class-validator';

export class StartResetPasswordUser_Request {
  @IsString()
  email: string;
}
