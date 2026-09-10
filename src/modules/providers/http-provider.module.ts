// src/modules/providers/http-provider.module.ts

import { Global, Module } from '@nestjs/common';
import { EmqxApiService } from './http/emqx-api.service';
import { HttpModule } from '@nestjs/axios';
import { SettingsModule } from '../settings/settings.module';

@Global()
@Module({
  imports: [HttpModule, SettingsModule],
  providers: [EmqxApiService],
  exports: [HttpModule, EmqxApiService],
})
export class HttpProviderModule {}
