import { JwtService } from '@nestjs/jwt';

interface IGetTokensResponse {
  access_token: string;
  refresh_token: string;
}

interface IGetTokensDTO {
  user_id: number;
  email: string;
  jwt_service: JwtService;
}

async function getTokens({
  email,
  user_id,
  jwt_service,
}: IGetTokensDTO): Promise<IGetTokensResponse> {
  const [access_token, refresh_token] = await Promise.all([
    jwt_service.signAsync(
      {
        sub: user_id,
        email,
      },
      {
        secret: 'at-secret',
        expiresIn: 60 * 15, // 15 minutes,
      },
    ),
    jwt_service.signAsync(
      {
        sub: user_id,
        email,
      },
      {
        secret: 'rt-secret',
        expiresIn: 60 * 60 * 24 * 7, // seven days
      },
    ),
  ]);

  return {
    access_token,
    refresh_token,
  };
}

export { getTokens };
