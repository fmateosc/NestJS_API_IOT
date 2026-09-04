// auth.guard.ts

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from 'src/constants';
import { UsersService } from 'src/modules/users/services/users.service';
import { IUseToken } from '../intefaces/auth.interface';
import { useToken } from 'src/util/use.token';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();

    const token = req.headers['token'];
    if (!token || Array.isArray(token)) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const manageToken: IUseToken | string = useToken(token);
    if (typeof manageToken === 'string') {
      throw new UnauthorizedException(manageToken);
    }

    if (manageToken.isExpired) {
      throw new UnauthorizedException('Token has expired');
    }

    const { userId } = manageToken;
    const user = await this.usersService.findBy({ key: 'id', value: userId });

    if (!user) {
      throw new UnauthorizedException('Invalid User');
    }

    req.userId = user.id;
    req.userAccess = user.userAccess;

    return true;
  }
}
