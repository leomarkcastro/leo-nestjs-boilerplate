import { IsString, Matches, MinLength } from 'class-validator';

export class RegisterUser_Request {
  @IsString()
  @MinLength(3)
  email: string;

  // class validator, min 8 letters with lower case, upper case, number, special character
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Include special character, number, upper and lower case letter',
  })
  password: string;
}
