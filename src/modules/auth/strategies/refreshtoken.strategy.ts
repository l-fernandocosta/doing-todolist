import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { IJWTPayload } from './accesstoken.strategy';
import { AUTH_ERRORS } from '@/shared/utils/errors/error-sign-up';

@Injectable()
export class RefreshTokenJWT extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: 'rt-secret',
    });
  }

  validate(req: Request, payload: IJWTPayload) {
    const refresh_token = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    if (!refresh_token) throw new ForbiddenException(AUTH_ERRORS.REFRESH_TOKEN);

    return {
      ...payload,
      refresh_token,
    };
  }
}
