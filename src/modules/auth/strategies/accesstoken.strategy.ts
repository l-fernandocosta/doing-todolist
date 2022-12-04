import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface IJWTPayload {
  sub: string;
  email: string;
  refresh_token: string;
}

@Injectable()
export class AccessTokenJWT extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'at-secret',
    });
  }

  async validate(payload: IJWTPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
