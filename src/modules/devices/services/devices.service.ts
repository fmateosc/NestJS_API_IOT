// src/modules/devices/services/devices.service.ts

import { Injectable } from '@nestjs/common';
import { DevicesEntity } from '../entities/devices.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceDto } from '../dtos/devices.dto';
import { IUserInfo } from 'src/modules/auth/intefaces/auth.interface';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(DevicesEntity)
    private readonly deviceRepository: Repository<DevicesEntity>,
  ) {}

  public async createNewDevice(
    newDeviceData: DeviceDto,
    userInfo: IUserInfo,
  ): Promise<{ message: string; device: DevicesEntity }> {
    // Crear entidad inicial | Create initial entity
    const deviceEntity = this.deviceRepository.create({
      ...newDeviceData,
      createUserId: userInfo.userId ? { id: userInfo.userId } : undefined,
    });

    // Guardar dispositivo | Save device
    const savedDevice = await this.deviceRepository.save(deviceEntity);

    const deviceWithUser = await this.deviceRepository.findOne({
      where: { id: savedDevice.id },
      relations: { createUserId: true },
    });

    return {
      message: `Device "${savedDevice.deviceName}" with serial "${savedDevice.deviceSerial}" was created successfully`,
      device: deviceWithUser || savedDevice,
    };
  }
}
