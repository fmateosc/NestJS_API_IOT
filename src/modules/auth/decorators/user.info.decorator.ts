// src/modules/auth/decorators/user.info.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserInfo } from '../intefaces/auth.interface';

export const GetUserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext): IUserInfo => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = ctx.switchToHttp().getRequest();
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      userId: req.userId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      userAccess: req.userAccess,
    };
  },
);
