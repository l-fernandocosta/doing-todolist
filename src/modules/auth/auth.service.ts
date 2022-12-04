import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { getTokens, hashData } from '@helpers';

import { AuthDTO } from './dtos';
import { Token } from './types';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AUTH_ERRORS } from '@errors/error-sign-up';
import { PrismaService } from '@db/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt_service: JwtService) {}

  async updateRefreshTokenHash(userid: number, refresh_token: string) {
    const hash = await hashData(refresh_token);

    await this.prisma.user.update({
      where: {
        id: userid,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async signupLocal({ email, password }: AuthDTO): Promise<Token> {
    const hashedPassword = await hashData(password);
    const user_exist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user_exist)
      throw new HttpException(AUTH_ERRORS.EMAIL, HttpStatus.CONFLICT);

    const user = await this.prisma.user.create({
      data: {
        email,
        hash: hashedPassword,
      },
    });

    const tokens = await getTokens({
      email: user.email,
      user_id: user.id,
      jwt_service: this.jwt_service,
    });
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async signinLocal({ email, password }: AuthDTO): Promise<Token> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new ForbiddenException(AUTH_ERRORS.ACCESS_DENIED);

    const password_matches = await bcrypt.compare(password, user.hash);
    if (!password_matches)
      throw new ForbiddenException(AUTH_ERRORS.ACCESS_DENIED);

    const tokens = await getTokens({
      user_id: user.id,
      email: user.email,
      jwt_service: this.jwt_service,
    });

    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(user_id: number) {
    console.log(user_id, 'aqui <<');
    await this.prisma.user.updateMany({
      where: {
        id: user_id,
        hashedRt: {
          not: null,
        },
      },

      data: {
        hashedRt: null,
      },
    });
  }

  async refreshTokens(user_id: number, refresh_token: string): Promise<Token> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    console.log('user', user);

    if (!user || !user.hashedRt)
      throw new ForbiddenException(AUTH_ERRORS.REFRESH_TOKEN);

    const rtMatches = await bcrypt.compare(refresh_token, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException(AUTH_ERRORS.REFRESH_TOKEN);

    const tokens = await getTokens({
      email: user.email,
      user_id: user.id,
      jwt_service: this.jwt_service,
    });
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }
}
