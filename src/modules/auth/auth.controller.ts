import {
  Body,
  Post,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
} from '@nestjs/common';

import { AuthDTO } from './dtos';
import { Token } from './types';

import { RefreshTokenGuard } from '@guards';
import { AuthService } from '@auth/auth.service';
import { GetCurrentUser, GetUserId, IsPublic } from '@decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @IsPublic()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() auth_dto: AuthDTO): Promise<Token> {
    return this.authService.signupLocal(auth_dto);
  }

  @IsPublic()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(
    @Body()
    auth_dto: AuthDTO,
  ): Promise<Token> {
    return this.authService.signinLocal(auth_dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetUserId()
    user: any,
  ) {
    console.log(user);
    return this.authService.logout(user.userId);
  }

  @IsPublic()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  refreshTokens(
    @GetUserId() user: any,
    @GetCurrentUser('refresh_token') refresh_token: string,
  ) {
    console.log(user, 'REFRESH TOKEN -<');
    return this.authService.refreshTokens(user.sub, refresh_token);
  }
}
