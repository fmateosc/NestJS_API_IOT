// src/modules/devices/services/devices.service.ts

import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { DevicesEntity } from '../entities/devices.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceDto } from '../dtos/devices.dto';
import { IUserInfo } from 'src/modules/auth/intefaces/auth.interface';
import { ACCESS_LEVEL } from 'src/constants';
import { UpdateDeviceDto } from '../dtos/update.device.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EmqxApiService } from 'src/modules/providers/http/emqx-api.service';
import { IEmqxBannedResponseData } from 'src/common/interfaces/emqx.interface';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(DevicesEntity)
    private readonly deviceRepository: Repository<DevicesEntity>,
    @Inject(forwardRef(() => EmqxApiService))
    private readonly httpEmqxApiService: EmqxApiService,
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

    // Emqx API
    if (
      savedDevice &&
      (await this.httpEmqxApiService.ensureSettingsInitialized())
    ) {
      const [respEmqxBridge, bannedList] = await Promise.all([
        this.httpEmqxApiService.emqxApiPostBridge({
          name: deviceWithUser?.deviceName || savedDevice.deviceName,
          user: deviceWithUser?.createUserId?.username || 'emqx',
          serialId: savedDevice?.deviceSerial || savedDevice.deviceSerial,
        }),

        this.httpEmqxApiService.emqxApiGetBannedList(),
      ]);

      //update device
      await this.updateDeviceById(
        {
          bridgeRuleId: `Device "${deviceWithUser?.deviceName}" with serial "${deviceWithUser?.deviceSerial}" was created successfully`,
        },
        savedDevice.id,
        userInfo,
      );
      // Remove device from banned list if it exists
      await this.checkWhoParameter(bannedList, newDeviceData.deviceSerial);
    }

    return {
      message: `Device "${savedDevice.deviceName}" with serial "${savedDevice.deviceSerial}" was created successfully`,
      device: deviceWithUser || savedDevice,
    };
  }

  // Eliminar de la lista de baneados si existe | Remove from the banned list if it exists
  private async checkWhoParameter(
    response: IEmqxBannedResponseData,
    whoParam: string,
  ): Promise<void> {
    const bannedSet = new Set(response.data.map((item) => item.who));

    if (bannedSet.has(whoParam)) {
      await this.httpEmqxApiService.emqxApiDeleteBanned({
        as: 'clientid',
        who: whoParam,
      });
    }
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

  // Actualizar un dispositivo por el Id | Update a device by ID
  public async updateDeviceById(
    updateDeviceData: UpdateDeviceDto,
    deviceId: string,
    userInfo: IUserInfo,
  ): Promise<{ status: boolean; device: DevicesEntity }> {
    const existingDevice = await this.findDeviceById(deviceId, userInfo);

    await this.deviceRepository.update(deviceId, updateDeviceData);

    return {
      status: true,
      device: { ...existingDevice, ...updateDeviceData },
    };
  }

  // Eliminar un dispositivo por el Id | Delete a device by ID
  public async deleteDeviceById(
    deviceId: string,
    userInfo: IUserInfo,
  ): Promise<{ status: boolean; device: DevicesEntity }> {
    const existingDevice = await this.findDeviceById(deviceId, userInfo);

    await this.deviceRepository.delete(deviceId);

    return {
      status: true,
      device: existingDevice,
    };
  }

  // Buscar todos los dispositivos | Find all devices
  public async findAllDevices(
    paginationDto: PaginationDto,
    userInfo: IUserInfo,
  ): Promise<{
    limit: number;
    offset: number;
    count: number;
    devices: DevicesEntity[];
  }> {
    const { userAccess, userId } = userInfo;
    const limit = paginationDto.limit || Number(process.env.LIMIT) || 1000;
    const offset = paginationDto.offset || Number(process.env.OFFSET) || 0;

    const queryBuilder = this.deviceRepository
      .createQueryBuilder('devices')
      .leftJoinAndSelect('devices.createUserId', 'createUserId')
      .take(limit)
      .skip(offset);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (userAccess === ACCESS_LEVEL.ADMIN) {
      queryBuilder.andWhere('devices.createUserId = :userId', { userId });
    }

    if (paginationDto.type) {
      queryBuilder.andWhere('devices.deviceType = :type', {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        type: paginationDto.type,
      });
    }

    const [devices, count] = await queryBuilder.getManyAndCount();

    return {
      limit,
      offset,
      count,
      devices,
    };
  }

  // EMQX DEMO
  public async testEmqxApi() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.httpEmqxApiService.emqxApiGetTopicList();
  }
}
