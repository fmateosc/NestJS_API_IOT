//src/modules/messages/controllers/messages.controller.ts

import { Body, Controller, Post } from '@nestjs/common';

@Controller('messages')
export class MessagesController {
  @Post('register')
  public async createNewDataMessage(@Body() newMessageData) {
    console.log('New Message Data:', newMessageData);
    return newMessageData;
  }
}
