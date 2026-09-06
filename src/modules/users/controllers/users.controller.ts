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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDto } from '../dtos/user.dto';
import { USER_ORIGIN } from 'src/constants';
import { UsersEntity } from '../entities/users.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdateUserDto } from '../dtos/update.user.dto';
import { PasswordUserDto } from '../dtos/update.password.user.dto';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { AccessLevelGuard } from 'src/modules/auth/guard/access-level.guard';
import { PublicAccess } from 'src/modules/auth/decorators/public.decorator';
import { Access } from 'src/modules/auth/decorators/access.decorator';

@Controller('users')
@UseGuards(AuthGuard, AccessLevelGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // create a new user
  @PublicAccess()
  @Post('register')
  public async createNewUser(@Body() newUserData: UserDto): Promise<{
    status: boolean;
    message: string;
    user: UsersEntity;
  }> {
    return await this.usersService.createNewUser(newUserData, USER_ORIGIN.WEB);
  }

  // create a new user by ROOT
  @Access('ROOT')
  @Post('register/root')
  public async createNewUserByRoot(
    @Body() newUserData: UserDto,
  ): Promise<{ status: boolean; message: string; user: UsersEntity }> {
    return await this.usersService.createNewUser(newUserData, USER_ORIGIN.ROOT);
  }

  // find a user by id
  @Access('ADMIN')
  @Get('find/:userId')
  public async findUserById(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UsersEntity> {
    return await this.usersService.findUserById(userId);
  }

  // get all users
  @Access('ROOT')
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
  @Access('ADMIN')
  @Put('update/:userId')
  public async updateUserById(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updatedUserData: UpdateUserDto,
  ): Promise<{ status: boolean; user: UsersEntity }> {
    return await this.usersService.updateUserById(updatedUserData, userId);
  }

  // delete a user by id
  @Access('ADMIN')
  @Delete('delete/:userId')
  public async deleteUserById(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<{ status: boolean; user: UsersEntity }> {
    return await this.usersService.deleteUserById(userId);
  }

  // update user password by id
  @Access('ADMIN')
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
