// src/modules/devices/entities/devices.entity.ts

import { BaseEntity } from 'src/config/base.entity';
import { DEVICE_TYPES } from 'src/constants';
import { UsersEntity } from 'src/modules/users/entities/users.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'devices' })
export class DevicesEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: DEVICE_TYPES,
    default: 'ESP32',
  })
  deviceType: DEVICE_TYPES;

  @Column('text', { nullable: false })
  deviceName: string;

  @Column('text', { nullable: false, unique: true })
  deviceSerial: string;

  @Column('text', { nullable: true })
  deviceDescription: string;

  @Column('jsonb', { nullable: true })
  deviceLocation: { longitude: number; latitude: number };

  @Column('text', { nullable: true })
  bridgeRuleId: string;

  @Column('bool', { default: false })
  deviceOnline: boolean;

  @Column('bool', { default: true })
  deviceStatus: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  deviceLastseen: Date;

  @ManyToOne(() => UsersEntity, (user) => user.userDevices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'device_user_id' })
  createUserId: UsersEntity;
}
