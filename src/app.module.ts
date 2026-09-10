import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DevicesModule } from './modules/devices/devices.module';
import { SettingsModule } from './modules/settings/settings.module';
import { HttpProviderModule } from './modules/providers/http-provider.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<TypeOrmModuleOptions>('typeorm');
        if (!config) {
          throw new Error('Missing TypeORM configuration');
        }
        return config;
      },
    }),
    UsersModule,
    AuthModule,
    DevicesModule,
    SettingsModule,
    HttpProviderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
