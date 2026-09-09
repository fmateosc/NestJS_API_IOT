// src/modules/settings/entities/settings.entity.ts
import { BaseEntity } from 'src/config/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'general_settings' })
export class GeneralSettingsEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, default: 'Atlantic/Canary' })
  timezone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  emqxApiKey: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  emqxApiSecretKey: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    default: 'localhost',
  })
  emqxAppHost: string;

  @Column({ type: 'int', nullable: true, default: 18083 })
  emqxAppPort: number;

  @Column({ type: 'varchar', length: 100, nullable: true, default: 'emqx' })
  mqttApiUser: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    default: 'User123*+-',
  })
  mqttApiPassword: string;

  @Column({ type: 'int', nullable: true, default: 1883 })
  mqttApiPort: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  telegramBotToken: string;
}
