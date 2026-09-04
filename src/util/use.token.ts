// use.token.ts

import {
  IAuthTokenResult,
  IUseToken,
} from 'src/modules/auth/intefaces/auth.interface';
import * as jwt from 'jsonwebtoken';

// This function takes a JWT token as input and decodes it to extract user information.
export const useToken = (token: string): IUseToken | string => {
  try {
    const decode = jwt.decode(token) as IAuthTokenResult;
    const currentDate = new Date();
    const expiredDate = new Date(decode.exp);

    return {
      userId: decode.userId,
      role: decode.role,
      isExpired: +expiredDate <= +currentDate / 1000,
    };
  } catch (error) {
    return 'Invalid token';
  }
};
