// src/modules/devices/devices.module.ts

import { forwardRef, Module } from '@nestjs/common';
import { DevicesService } from './services/devices.service';
import { DevicesController } from './controllers/devices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesEntity } from './entities/devices.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DevicesEntity]),
    forwardRef(() => UsersModule),
  ],
  providers: [DevicesService],
  controllers: [DevicesController],
  exports: [DevicesModule, DevicesService, TypeOrmModule],
})
export class DevicesModule {}
