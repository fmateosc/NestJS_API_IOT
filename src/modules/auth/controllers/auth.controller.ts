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

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  // Login endpoint
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

    const { password: _, ...userWithoutPassword } = userValidate; // Exclude password from the user object
    const jwt = await this.authService.generateJWT(userWithoutPassword);

    return jwt;
  }
}
