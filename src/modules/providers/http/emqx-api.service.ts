// src/modules/providers/http/emqx-api.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { HttpService } from 'node_modules/@nestjs/axios/dist/http.service';
import { catchError, firstValueFrom } from 'rxjs';
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

  private async requestWithConfig<T>(
    method: 'get' | 'post' | 'delete' | 'put',
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const settingsStatus = await this.ensureSettingsInitialized();
      if (settingsStatus) {
        // true
        const response = await firstValueFrom(
          this.emqxHttpService
            .request<T>({
              method,
              url,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              data,
              ...config,
              headers: {
                ...config?.headers,
                'User-Agent': 'iot-app/1.0.0',
                Authorization: `Basic ${this.encodeCredentials()}`,
              },
            })
            .pipe(
              catchError((error: AxiosError) => {
                throw new Error(`An error occurred: ${error.message}`);
              }),
            ),
        );
        return response.data;
      }
      // false
      throw new Error('Settings not initialized');
    } catch (error) {
      this.logger.error(error.message);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw new Error(error);
    }
  }

  public async ensureSettingsInitialized(): Promise<boolean> {
    if (!this.dataSettings) {
      await this.initializeSettings();

      if (!this.dataSettings) {
        this.logger.error('No general settings available');
        return false;
      }
    }

    return true;
  }

  private encodeCredentials(): string {
    if (!this.dataSettings) {
      throw new Error(
        'No general settings available for encrypting credentials',
      );
    }

    const credentials = `${this.dataSettings.emqxApiKey}:${this.dataSettings.emqxApiSecretKey}`;

    return Buffer.from(credentials).toString('base64');
  }

  // demo list of topics
  public emqxApiGetTopicList(): Promise<any> {
    const url = `http://${this.dataSettings?.emqxAppHost}:${this.dataSettings?.emqxAppPort}/api/v5/topics`;
    return this.requestWithConfig('get', url);
  }

  // Bridge MQTT (broker) => HTTP (API core)
  public emqxApiPostBridge({ name, user, serialId }): Promise<any> {
    const url = `http://${this.dataSettings?.emqxAppHost}:${this.dataSettings?.emqxAppPort}/api/v5/bridges`;

    const data = {
      name: `http_${this.formatText(name)}`,
      type: 'webhook',
      ssl: { enable: false },
      connect_timeout: '15s',
      pool_size: 4,
      enable: true,
      method: 'post',
      url: `http://localhost:${this.configService.get('HTTP_PORT')}/api/v1/messages/register`,
      max_retries: 3,
      request_timeout: '15s',
      pool_type: 'random',
      resource_opts: {
        worker_pool_size: 1,
        inflight_window: 100,
        health_check_interval: 15000,
        query_mode: 'async',
        max_buffer_bytes: 104857600,
      },
      enable_pipelining: 100,
      local_topic: `/${user}/+/${serialId}/#`, // /emqx1/demo/000000002/data1/equipo01
    };

    return this.requestWithConfig('post', url, data);
  }

  // These are formatted names.
  private formatText(text: string): string {
    return text.split(' ').join('_');
  }
}
