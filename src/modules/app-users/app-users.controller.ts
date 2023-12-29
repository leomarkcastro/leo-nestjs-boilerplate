import { ApiPaginatedResponse } from '@/global/decorators/ApiPaginatedResponse.decorator';
import { Auth } from '@/global/decorators/Auth.decorator';
import { WithPermission } from '@/global/decorators/Permissions.decorator';
import { IPagination } from '@/global/types/Pagination.dto';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/services/auth.service';
import { PERMISSIONS } from '../permit/permissions.types';
import { AppUsersService } from './app-users.service';
import {
  UserCreate,
  UserUpdate,
  UserWithRelations,
} from './dto/UserObject.dto';

@Controller('users')
@ApiTags('users')
export class AppUsersController {
  constructor(
    private readonly service: AppUsersService,
    private readonly authService: AuthService,
  ) {}

  // get
  @Get('id/:id')
  @WithPermission([PERMISSIONS.USERS.GET])
  @Auth()
  getOne(@Param('id') id: string) {
    return this.service.getUser(id);
  }

  // list
  @Get('list')
  @WithPermission([PERMISSIONS.USERS.GET])
  @Auth()
  @ApiPaginatedResponse(UserWithRelations)
  getList(@Query() pagination: IPagination) {
    return this.service.getUsers(pagination);
  }

  // create
  @Post('create')
  @WithPermission([PERMISSIONS.USERS.CREATE])
  @Auth()
  async create(@Body() data: UserCreate) {
    const user = await this.service.createUser(data);
    await this.authService.newAccountResetPassword(user.email);

    return user;
  }

  // update
  @Post('update/:id')
  @WithPermission([PERMISSIONS.USERS.UPDATE])
  @Auth()
  update(@Param('id') id: string, @Body() data: UserUpdate) {
    return this.service.updateUser(id, data);
  }

  // delete
  @Post('delete/:id')
  @WithPermission([PERMISSIONS.USERS.DELETE])
  @Auth()
  delete(@Param('id') id: string) {
    return this.service.deleteUser(id);
  }
}
