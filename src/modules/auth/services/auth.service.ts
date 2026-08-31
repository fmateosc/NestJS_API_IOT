// auth.service.ts

import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UsersEntity } from 'src/modules/users/entities/users.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/modules/users/interfaces/user.interface';
import { AuthResponse, PayloadToken } from '../intefaces/auth.interface';
import * as jwt from 'jsonwebtoken';

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

  // generate JWT token
  public async generateJWT(user: IUser): Promise<AuthResponse> {
    const getUser = await this.usersService.findBy({
      key: 'id',
      value: user.id,
    });

    if (!getUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const payload: PayloadToken = {
      access: getUser.userAccess,
      userId: getUser.id,
    };
    return {
      accessToken: this.singJWT({
        payload,
        secret: process.env.JWT_SECRET || 'eSTEesmisecertcode2025*',
        expires: '24h',
      }),
      user,
    };
  }

  // sign JWT token
  private singJWT({
    payload,
    secret,
    expires,
  }: {
    payload: jwt.JwtPayload;
    secret: string;
    expires: number | string;
  }): string {
    return jwt.sign(payload, secret, {
      expiresIn: expires as jwt.SignOptions['expiresIn'],
    });
  }
}
