import { Module } from '@nestjs/common';
import { MessagesService } from './services/messages.service';
import { MessagesController } from './controllers/messages.controller';
import { DevicesModule } from '../devices/devices.module';

@Module({
  imports: [DevicesModule],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
