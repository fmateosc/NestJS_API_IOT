// src/modules/devices/controllers/devices.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DevicesService } from '../services/devices.service';
import { Access } from 'src/modules/auth/decorators/access.decorator';
import { GetUserInfo } from 'src/modules/auth/decorators/user.info.decorator';
import * as authInterface from 'src/modules/auth/intefaces/auth.interface';
import { DeviceDto } from '../dtos/devices.dto';
import { AccessLevelGuard } from 'src/modules/auth/guard/access-level.guard';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { UpdateDeviceDto } from '../dtos/update.device.dto';
import { IUserInfo } from 'src/modules/auth/intefaces/auth.interface';

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

  // Actualizar un dispositivo por el Id | Update a device by ID
  @Access('ADMIN')
  @Put('update/:deviceId')
  public async updateDeviceById(
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
    @Body() updateDeviceData: UpdateDeviceDto,
    @GetUserInfo() userInfo: authInterface.IUserInfo,
  ) {
    return await this.deviceService.updateDeviceById(
      updateDeviceData,
      deviceId,
      userInfo,
    );
  }

  // Eliminar un dispositivo por el Id | Delete a device by ID
  @Access('ADMIN')
  @Delete('delete/:deviceId')
  public async deleteDeviceById(
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
    @GetUserInfo() userInfo: authInterface.IUserInfo,
  ) {
    return await this.deviceService.deleteDeviceById(deviceId, userInfo);
  }
}
