export class AuthResponse {
  type: 'JWT' | '2FA_Email';
  jwt?: {
    accessToken: string;
  };
  twoFactorEmail?: {
    token: string;
  };
}
