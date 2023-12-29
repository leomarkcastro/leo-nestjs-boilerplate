import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({ enum: ['JWT', '2FA_Email'] })
  type: 'JWT' | '2FA_Email';
  jwt?: {
    accessToken: string;
  };
  twoFactorEmail?: {
    token: string;
  };
}
