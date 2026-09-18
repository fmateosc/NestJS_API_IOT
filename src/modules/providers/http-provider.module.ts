// src/modules/providers/http-provider.module.ts

import { Global, Module } from '@nestjs/common';
import { EmqxApiService } from './http/emqx-api.service';
import { HttpModule } from '@nestjs/axios';
import { SettingsModule } from '../settings/settings.module';
import { MqttProviderModule } from './mqtt-provider.module';
import { MqttService } from './mqtt/mqtt.service';

@Global()
@Module({
  imports: [HttpModule, SettingsModule, MqttProviderModule],
  providers: [EmqxApiService, MqttService],
  exports: [HttpModule, EmqxApiService],
})
export class HttpProviderModule {}
