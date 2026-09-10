// src/modules/providers/http/emqx-api.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from 'node_modules/@nestjs/axios/dist/http.service';
import { GeneralSettingsEntity } from 'src/modules/settings/entities/settings.entity';
import { SettingsService } from 'src/modules/settings/services/settings.service';

@Injectable()
export class EmqxApiService {
  private readonly logger = new Logger(EmqxApiService.name);
  private dataSettings?: GeneralSettingsEntity | null;

  constructor(
    private readonly emqxHttpService: HttpService,
    private readonly settingsService: SettingsService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.initializeSettings();
  }

  private async initializeSettings(): Promise<void> {
    this.dataSettings = await this.settingsService.findGeneralSettings();
  }
}
