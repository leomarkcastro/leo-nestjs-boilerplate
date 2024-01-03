import { CONFIG } from '@/config/env';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import { IUserJwt } from '../types/UserJWT.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: CONFIG.SECRET,
    });
  }

  async validate(payload: IUserJwt): Promise<IUserJwt> {
    if (payload.type !== 'auth') {
      return null;
    }
    const isLoggedOut = await this.authService.checkLoggedOut(payload);
    if (isLoggedOut) {
      return null;
    }
    return {
      type: 'auth',
      id: payload.id,
      email: payload.email,
    };
  }
}
