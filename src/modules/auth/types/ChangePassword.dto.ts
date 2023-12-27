import { IsString, Matches, MinLength } from 'class-validator';

export class IChangePassword {
  @IsString()
  oldPassword: string;

  // class validator, min 8 letters with lower case, upper case, number, special character
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  newPassword: string;
}
