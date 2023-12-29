import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TwoFaEmailStrategy extends PassportStrategy(
  Strategy,
  '2fa_email',
) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.verify2FAEmail(username, password);

    // Add additional authentication logic here

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
