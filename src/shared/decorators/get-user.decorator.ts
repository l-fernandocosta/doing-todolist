import { IJWTPayload } from '@auth/strategies';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (data: keyof IJWTPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    console.log(request.user);
    console.log(data);
    return request.user[data];
    ``;
  },
);
