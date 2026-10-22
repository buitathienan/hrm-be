import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Payload } from '../interfaces/payload.interface';

interface RequestWithUser extends Request {
  user: Payload;
}

export const CurrentUser = createParamDecorator(
  (data: keyof Payload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return data ? request.user?.[data] : request.user;
  },
);
