import { CONFIG } from '@/config/env';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserJwt } from '../types/UserJWT.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
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
    return {
      type: 'auth',
      id: payload.id,
      email: payload.email,
    };
  }
}
