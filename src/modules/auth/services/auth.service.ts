// auth.service.ts

import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UsersEntity } from 'src/modules/users/entities/users.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/modules/users/interfaces/user.interface';
import { AuthResponse, PayloadToken } from '../intefaces/auth.interface';
import * as jwt from 'jsonwebtoken';
import { ACL_ACTION, ACL_PERMISSION } from 'src/constants/acl';
import { AclEntity } from '../entities/acl.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @InjectRepository(AclEntity)
    private readonly aclRepository: Repository<AclEntity>,
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

  // ACL rules
  public async createNewAclRule(user: UsersEntity): Promise<void> {
    const topics = [
      `/${user.username}/#`, // /emqx6/# allowed
      `+/#`, // deny
    ];

    const permissions: { action: ACL_ACTION; permission: ACL_PERMISSION }[] = [
      { action: ACL_ACTION.ALL, permission: ACL_PERMISSION.ALLOW },
      { action: ACL_ACTION.ALL, permission: ACL_PERMISSION.DENY },
    ];

    const aclPromises = topics.map((topic, index) =>
      this.createAndSaveAcl(
        user.username,
        permissions[index].action,
        permissions[index].permission,
        topic,
        user.id,
      ),
    );
  }

  private async createAndSaveAcl(
    username: string,
    action: ACL_ACTION,
    permission: ACL_PERMISSION,
    topic: string,
    createUserId: string,
  ): Promise<AclEntity> {
    const newAcl = this.aclRepository.create({
      username,
      action,
      permission,
      topic,
      qos: 0,
      retain: 0,
      createUserId: { id: createUserId },
    });

    return this.aclRepository.save(newAcl);
  }
}
