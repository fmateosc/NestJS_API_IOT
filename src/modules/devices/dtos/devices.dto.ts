// src/modules/devices/dtos/devices.dto.ts

import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { DEVICE_TYPES } from 'src/constants';

export class DeviceDto {
  @IsOptional()
  @IsEnum(DEVICE_TYPES)
  deviceType?: DEVICE_TYPES;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  deviceName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  deviceSerial: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  deviceDescription?: string;

  @IsOptional()
  deviceLocation?: { longitude: number; latitude: number };

  @IsOptional()
  @IsString()
  @MaxLength(50)
  bridgeRuleId?: string;

  @IsOptional()
  @IsBoolean()
  deviceOnline?: boolean;

  @IsOptional()
  @IsBoolean()
  deviceStatus?: boolean;

  @IsOptional()
  @IsDate()
  deviceLastseen?: Date;

  @IsOptional()
  settingsData?: any;
}
