// auth.module.ts

import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AclEntity } from './entities/acl.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // ACL entity
      AclEntity,
    ]),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, TypeOrmModule],
})
export class AuthModule {}
