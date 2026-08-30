import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDto } from '../dtos/user.dto';
import { USER_ORIGIN } from 'src/constants';
import { UsersEntity } from '../entities/users.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdateUserDto } from '../dtos/update.user.dto';
import { PasswordUserDto } from '../dtos/update.password.user.dto';

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

  // find a user by id
  @Get('find/:userId')
  public async findUserById(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UsersEntity> {
    return await this.usersService.findUserById(userId);
  }

  // get all users
  @Get('all')
  public async findAllUsers(@Query() paginationDto: PaginationDto): Promise<{
    limit: number;
    offset: number;
    count: number;
    users: UsersEntity[];
  }> {
    return await this.usersService.findAllUsers(paginationDto);
  }

  // update a user by id
  @Put('update/:userId')
  public async updateUserById(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updatedUserData: UpdateUserDto,
  ): Promise<{ status: boolean; user: UsersEntity }> {
    return await this.usersService.updateUserById(updatedUserData, userId);
  }

  // delete a user by id
  @Delete('delete/:userId')
  public async deleteUserById(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<{ status: boolean; user: UsersEntity }> {
    return await this.usersService.deleteUserById(userId);
  }

  // update user password by id
  @Put('update/password/:userId')
  public async updateUserPasswordById(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() userPasswordData: PasswordUserDto,
  ): Promise<{ status: boolean; user: UsersEntity }> {
    return await this.usersService.updateUserPasswordById(
      userPasswordData,
      userId,
    );
  }
}
