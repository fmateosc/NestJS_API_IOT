// auth.interface.ts

import { ACCESS_LEVEL } from 'src/constants/roles';
import { IUser } from 'src/modules/users/interfaces/user.interface';

export interface AuthBody {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: IUser;
}

export interface PayloadToken {
  userId: string;
  access: ACCESS_LEVEL;
}

export interface IUseToken {
  role: string;
  userId: string;
  isExpired: boolean;
}

export interface IAuthTokenResult {
  role: string;
  userId: string;
  iat: number;
  exp: number;
}
