export class IUserJwt {
  type: 'auth' | 'reset-password';
  id: string;
  email: string;
  metadata?: {
    resetExpiresIn?: number;
  };
  iat?: number;
  exp?: number;
}
