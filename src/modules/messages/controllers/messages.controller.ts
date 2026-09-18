//src/modules/messages/controllers/messages.controller.ts

import { Body, Controller, Logger, Post } from '@nestjs/common';
import { MessagesService } from '../services/messages.service';
import type { IMqttMessage } from '../interfaces/mqtt.interface';

@Controller('messages')
export class MessagesController {
  private readonly logger = new Logger(MessagesController.name);

  constructor(private readonly messageService: MessagesService) {}

  @Post('register')
  public async createNewDevice(@Body() newMessageData: IMqttMessage) {
    // verificar que status este presente en topic
    if (/\/status$/.test(newMessageData.topic)) {
      this.messageService.updateDeviceConnection(newMessageData);
    }
    this.logger.debug('Message received from MQTT');
    this.logger.debug(newMessageData);
    return true;
  }
}
