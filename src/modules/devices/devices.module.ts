import { Module } from '@nestjs/common';
import { DevicesService } from './services/devices.service';
import { DevicesController } from './controllers/devices.controller';

@Module({
  providers: [DevicesService],
  controllers: [DevicesController]
})
export class DevicesModule {}
