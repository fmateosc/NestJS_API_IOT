// src/modules/devices/services/devices.service.ts

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DevicesEntity } from '../entities/devices.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceDto } from '../dtos/devices.dto';
import { IUserInfo } from 'src/modules/auth/intefaces/auth.interface';
import { ACCESS_LEVEL } from 'src/constants';

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

  // Buscar un dispositivo por el Id | Search for a device by ID
  public async findDeviceById(
    deviceId: string,
    userInfo: IUserInfo,
  ): Promise<DevicesEntity> {
    const { userId, userAccess } = userInfo;

    const queryBuilder = this.deviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.createUserId', 'createUserId')
      .where({ id: deviceId });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (userAccess === ACCESS_LEVEL.ADMIN) {
      queryBuilder.andWhere('device.createUserId = :createUserId', {
        createUserId: userId,
      });
    }

    const deviceResult = await queryBuilder.getOne();

    if (!deviceResult) {
      throw new HttpException(
        `Device with Id "${deviceId}" not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return deviceResult;
  }
}
