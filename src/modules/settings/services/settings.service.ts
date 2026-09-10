// src/modules/settings/services/settings.service.ts

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GeneralSettingsEntity } from '../entities/settings.entity';
import { Repository } from 'typeorm';
import { GeneralSettinsDto } from '../dtos/settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(GeneralSettingsEntity)
    private readonly settingsRepository: Repository<GeneralSettingsEntity>,
  ) {}

  // add new settings
  public async createNewSettings(
    newSettingsData: GeneralSettinsDto,
  ): Promise<{ message: string; settings: GeneralSettingsEntity }> {
    const configSave = await this.settingsRepository.count();

    if (configSave) {
      throw new HttpException(
        'Configurations are already available',
        HttpStatus.BAD_REQUEST,
      );
    }

    const savedSettings = await this.settingsRepository.save(newSettingsData);

    return {
      message: 'Configuration created successfully',
      settings: savedSettings,
    };
  }

  // find settings
  public async findGeneralSettings(): Promise<GeneralSettingsEntity | null> {
    const queryBuilder = this.settingsRepository.createQueryBuilder();
    return await queryBuilder.getOne();
  }
}
