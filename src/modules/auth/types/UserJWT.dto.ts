export class IUserJwt {
  type: 'auth' | 'reset-password';
  id: string;
  email: string;
  metadata?: {
    expiresIn?: number;
  };
}
