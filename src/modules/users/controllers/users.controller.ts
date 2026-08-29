import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDto } from '../dtos/user.dto';
import { USER_ORIGIN } from 'src/constants';
import { UsersEntity } from '../entities/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  public async createNewUser(@Body() newUserData: UserDto): Promise<{
    status: boolean;
    message: string;
    user: UsersEntity;
  }> {
    return await this.usersService.createNewUser(newUserData, USER_ORIGIN.WEB);
  }
}
