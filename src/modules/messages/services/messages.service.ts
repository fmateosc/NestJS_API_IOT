// src/modules/messages/services/messages.service.ts

import { Injectable } from '@nestjs/common';
import { DevicesService } from 'src/modules/devices/services/devices.service';
import { IMqttMessage } from '../interfaces/mqtt.interface';

@Injectable()
export class MessagesService {
  constructor(private readonly deviceService: DevicesService) {}

  public async updateDeviceConnection(
    newMessageData: IMqttMessage,
  ): Promise<void> {
    const status: { connected: boolean } = JSON.parse(newMessageData.payload);

    await this.deviceService.updateDeviceConnection(
      newMessageData.clientid,
      status.connected,
    );
  }
}
