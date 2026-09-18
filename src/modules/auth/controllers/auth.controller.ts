// auth.controller.ts

import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dtos/auth.dto';
import { AuthResponse } from '../intefaces/auth.interface';
import { AuthGuard } from '../guard/auth.guard';
import { AccessLevelGuard } from '../guard/access-level.guard';
import { PublicAccess } from '../decorators/public.decorator';
import { MqttService } from 'src/modules/providers/mqtt/mqtt.service';
import * as mqtt from 'mqtt';

@Controller('auth')
@UseGuards(AuthGuard, AccessLevelGuard)
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly mqttService: MqttService,
  ) {}

  // Login endpoint
  @PublicAccess()
  @Post('login')
  async login(@Body() { username, password }: AuthDto): Promise<AuthResponse> {
    const userValidate = await this.authService.validateUser(
      username,
      password,
    );
    if (!userValidate) {
      throw new HttpException(
        `Invalid username or password`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    // TODO: MQTT
    const mqttObservable = this.mqttService.doConnectUser(
      userValidate.id,
      username,
      password,
    );

    mqttObservable.subscribe({
      next: (packet: mqtt.IPublishPacket) => {
        // Acceder a las propiedades del paquete MQTT
        this.logger.log(`Message received from topic: ${packet.topic}`);
        this.logger.log(`Payload: ${packet.payload.toString()}`);
        this.logger.log(`QoS: ${packet.qos}`);
        this.logger.log(`Retain flag: ${packet.retain}`);
        this.logger.log(`Duplicate flag: ${packet.dup}`);
      },
      error: (err) => {
        this.logger.error(`MQTT connect error: ${err}`);
      },
    });

    const { password: _, ...userWithoutPassword } = userValidate;
    const jwt = await this.authService.generateJWT(userWithoutPassword);
    return jwt;
  }
}
