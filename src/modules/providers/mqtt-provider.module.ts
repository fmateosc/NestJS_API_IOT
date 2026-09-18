// src/modules/providers/mqtt-provider.module.ts

import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { MqttService } from './mqtt/mqtt.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [forwardRef(() => UsersModule), SettingsModule],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttProviderModule {}
