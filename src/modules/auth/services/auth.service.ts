// auth.service.ts

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersEntity } from 'src/modules/users/entities/users.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  // validate username and password
  public async validateUser(
    username: string,
    password: string,
  ): Promise<UsersEntity | null> {
    const userByUsername = await this.usersService.findBy({
      key: 'username',
      value: username,
    });

    if (
      userByUsername &&
      (await bcrypt.compare(password, userByUsername.password))
    ) {
      return userByUsername;
    }
    return null;
  }
}
