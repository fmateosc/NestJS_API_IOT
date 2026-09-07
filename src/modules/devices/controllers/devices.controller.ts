// src/modules/devices/controllers/devices.controller.ts

import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { DevicesService } from '../services/devices.service';
import { Access } from 'src/modules/auth/decorators/access.decorator';
import { GetUserInfo } from 'src/modules/auth/decorators/user.info.decorator';
import * as authInterface from 'src/modules/auth/intefaces/auth.interface';
import { DeviceDto } from '../dtos/devices.dto';
import { AccessLevelGuard } from 'src/modules/auth/guard/access-level.guard';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';

@Controller('devices')
@UseGuards(AuthGuard, AccessLevelGuard)
export class DevicesController {
  constructor(private readonly deviceService: DevicesService) {}

  // Crear nuevo dispositivo | Create new device
  @Access('ADMIN')
  @Post('register')
  public async createNewDevice(
    @Body() newDeviceData: DeviceDto,
    @GetUserInfo() userInfo: authInterface.IUserInfo,
  ) {
    return await this.deviceService.createNewDevice(newDeviceData, userInfo);
  }

  // Buscar un dispositivo por el Id | Search for a device by ID
  @Access('ADMIN')
  @Get('find/:deviceId')
  public async findDeviceById(
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
    @GetUserInfo() userInfo: authInterface.IUserInfo,
  ) {
    return await this.deviceService.findDeviceById(deviceId, userInfo);
  }
}
