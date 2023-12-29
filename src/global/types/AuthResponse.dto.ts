import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseJWT {
  @ApiProperty()
  accessToken: string;
}

export class AuthResponse2FAEmail {
  @ApiProperty()
  token: string;
}

export class AuthResponse {
  @ApiProperty({ enum: ['JWT', '2FA_Email'] })
  type: 'JWT' | '2FA_Email';
  jwt?: AuthResponseJWT;
  twoFactorEmail?: AuthResponse2FAEmail;
}
