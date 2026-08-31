// auth.interface.ts

import { IUser } from 'src/modules/users/interfaces/user.interface';

export interface AuthBody {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: IUser;
}
