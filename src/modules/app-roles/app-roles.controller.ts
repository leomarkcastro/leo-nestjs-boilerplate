import { Auth } from '@/global/decorators/Auth.decorator';
import { CurrentUser } from '@/global/decorators/CurrentUser.decorator';
import { WithPermission } from '@/global/decorators/Permissions.decorator';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IUserJwt } from '../auth/types/UserJWT.dto';
import { PrismaService } from '../db-prisma/db-prisma.service';
import { PERMISSIONS } from '../permit/permissions.types';
import { PermitService } from '../permit/permit.service';
import { AppRolesService } from './app-roles.service';
import { CreateRole, PermissionToCheck } from './dto/RoleObjects.dto';

@Controller('app-roles')
@ApiTags('roles')
export class AppRolesController {
  constructor(
    private readonly db: PrismaService,
    private readonly permit: PermitService,
    private readonly service: AppRolesService,
  ) {}

  // ===================================== ROLES

  // get list
  @Get('roles/list')
  @WithPermission([PERMISSIONS.ROLES.GET])
  @Auth()
  async getRolesList() {
    return await this.service.getRolesList();
  }

  // get with permissions
  @Get('roles/info')
  @WithPermission([PERMISSIONS.ROLES.GET])
  @Auth()
  async getRoles() {
    return await this.service.getRolesInfo();
  }

  // create
  @Post('roles/create')
  @WithPermission([PERMISSIONS.ROLES.CREATE])
  @Auth()
  async createRole(@Body() data: CreateRole) {
    return await this.service.createRole(data);
  }

  // update
  @Post('roles/update/:id')
  @WithPermission([PERMISSIONS.ROLES.UPDATE])
  @Auth()
  async updateRole(@Param('id') id: string, @Body() data: CreateRole) {
    return await this.service.updateRole(id, data);
  }

  // delete
  @Post('roles/delete/:id')
  @WithPermission([PERMISSIONS.ROLES.DELETE])
  @Auth()
  async deleteRole(@Param('id') id: string) {
    return await this.service.deleteRole(id);
  }

  // ===================================== PERMISSIONS

  // get
  @Get('permissions')
  @WithPermission([PERMISSIONS.PERMISSIONS.GET])
  @Auth()
  async getPermissions() {
    return await this.service.getPermissions();
  }

  // apply
  @Post('permissions/apply/:roleId')
  @WithPermission([PERMISSIONS.PERMISSIONS.MODIFY])
  @Auth()
  async applyPermissions(
    @Param('roleId') roleId: string,
    @Body() permissionIds: string[],
  ) {
    return await this.service.applyPermissionsToRole(roleId, permissionIds);
  }

  // remove
  @Post('permissions/remove/:roleId')
  @WithPermission([PERMISSIONS.PERMISSIONS.MODIFY])
  @Auth()
  async removePermissions(
    @Param('roleId') roleId: string,
    @Body() permissionIds: string[],
  ) {
    return await this.service.removePermissionsFromRole(roleId, permissionIds);
  }

  // ===================================== ROLES ON USER

  // get roles on user
  @Get('my-role')
  @Auth()
  async getMyRoles(@CurrentUser() user: IUserJwt) {
    return await this.service.checkRole(user);
  }

  // get my permissions
  @Post('check-permissions')
  @Auth()
  async getMyPermissions(
    @CurrentUser() user: IUserJwt,
    @Body() body: PermissionToCheck,
  ) {
    return await this.service.hasPermissions(user, body.permissions);
  }
}
