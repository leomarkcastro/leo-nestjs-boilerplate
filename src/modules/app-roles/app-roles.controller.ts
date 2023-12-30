import { Auth } from '@/global/decorators/Auth.decorator';
import { CurrentUser } from '@/global/decorators/CurrentUser.decorator';
import { WithPermission } from '@/global/decorators/Permissions.decorator';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IUserJwt } from '../auth/types/UserJWT.dto';
import { PERMISSIONS } from '../permit/permissions.types';
import { AppRolesService } from './app-roles.service';
import { CreateRole, PermissionToCheck } from './dto/RoleObjects.dto';

@Controller('roles')
@ApiTags('roles')
export class AppRolesController {
  constructor(private readonly service: AppRolesService) {}

  // ===================================== ROLES

  // get list
  @Get('roles/list')
  @WithPermission([PERMISSIONS.ROLES.GET])
  @Auth()
  async roles_getList() {
    return await this.service.getRolesList();
  }

  // get with permissions
  @Get('roles/info')
  @WithPermission([PERMISSIONS.ROLES.GET])
  @Auth()
  async roles_getDetailedList() {
    return await this.service.getRolesInfo();
  }

  // create
  @Post('roles/create')
  @WithPermission([PERMISSIONS.ROLES.CREATE])
  @Auth()
  async roles_create(@Body() data: CreateRole) {
    return await this.service.createRole(data);
  }

  // update
  @Post('roles/update/:id')
  @WithPermission([PERMISSIONS.ROLES.UPDATE])
  @Auth()
  async roles_update(@Param('id') id: string, @Body() data: CreateRole) {
    return await this.service.updateRole(id, data);
  }

  // delete
  @Post('roles/delete/:id')
  @WithPermission([PERMISSIONS.ROLES.DELETE])
  @Auth()
  async roles_delete(@Param('id') id: string) {
    return await this.service.deleteRole(id);
  }

  // ===================================== PERMISSIONS

  // get
  @Get('permissions')
  @WithPermission([PERMISSIONS.PERMISSIONS.GET])
  @Auth()
  async roles_permissions_get() {
    return await this.service.getPermissions();
  }

  // apply
  @Post('permissions/apply/:roleId')
  @WithPermission([PERMISSIONS.PERMISSIONS.MODIFY])
  @Auth()
  async roles_permissions_applyPermission(
    @Param('roleId') roleId: string,
    @Body() permissionIds: string[],
  ) {
    return await this.service.applyPermissionsToRole(roleId, permissionIds);
  }

  // remove
  @Post('permissions/remove/:roleId')
  @WithPermission([PERMISSIONS.PERMISSIONS.MODIFY])
  @Auth()
  async roles_permissions_removePermission(
    @Param('roleId') roleId: string,
    @Body() permissionIds: string[],
  ) {
    return await this.service.removePermissionsFromRole(roleId, permissionIds);
  }

  // ===================================== ROLES ON USER

  // get roles on user
  @Get('my-role')
  @Auth()
  async roles_permissions_me_roles(@CurrentUser() user: IUserJwt) {
    return await this.service.checkRole(user);
  }

  // get my permissions
  @Post('check-permissions')
  @Auth()
  async roles_permissions_me_permissionCHeck(
    @CurrentUser() user: IUserJwt,
    @Body() body: PermissionToCheck,
  ) {
    return await this.service.hasPermissions(user, body.permissions);
  }
}
