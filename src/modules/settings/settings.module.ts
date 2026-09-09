import { forwardRef, Module } from '@nestjs/common';
import { SettingsService } from './services/settings.service';
import { SettingsController } from './controllers/settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneralSettingsEntity } from './entities/settings.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GeneralSettingsEntity]),
    forwardRef(() => UsersModule),
  ],
  providers: [SettingsService],
  controllers: [SettingsController],
  exports: [SettingsModule, SettingsService, TypeOrmModule],
})
export class SettingsModule {}
