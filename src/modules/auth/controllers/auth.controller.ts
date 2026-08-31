// auth.controller.ts

import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dtos/auth.dto';
import { AuthResponse } from '../intefaces/auth.interface';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  // Login endpoint
  @Post('login')
  async login(@Body() { username, password }: AuthDto): Promise<AuthResponse> {
    
  }
}
