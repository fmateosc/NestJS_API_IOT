// src/modules/settings/controllers/settings.controller.ts

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SettingsService } from '../services/settings.service';
import { Access } from 'src/modules/auth/decorators/access.decorator';
import { GeneralSettinsDto } from '../dtos/settings.dto';
import { AccessLevelGuard } from 'src/modules/auth/guard/access-level.guard';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';

@Controller('settings')
@UseGuards(AuthGuard, AccessLevelGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // add new Settings
  @Access('ROOT')
  @Post('register')
  public async createNewSettings(@Body() newSettingsData: GeneralSettinsDto) {
    return await this.settingsService.createNewSettings(newSettingsData);
  }
}
