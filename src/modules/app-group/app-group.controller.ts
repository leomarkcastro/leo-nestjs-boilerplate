import { ApiPaginatedResponse } from '@/global/decorators/ApiPaginatedResponse.decorator';
import { Auth } from '@/global/decorators/Auth.decorator';
import { WithPermission } from '@/global/decorators/Permissions.decorator';
import { Group as CGroup } from '@/global/prisma-classes/group';
import { IPagination } from '@/global/types/Pagination.dto';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Group } from '@prisma/client';
import { PERMISSIONS } from '../permit/permissions.types';
import { AppGroupService } from './app-group.service';
import {
  CreateAppGroupDto,
  GroupWithUsers,
  ManageMembersDto,
  UpdateAppGroupDto,
} from './dto/Group.dto';

@Controller('app-group')
@ApiTags('group')
export class AppGroupController {
  constructor(private readonly appDepartmentService: AppGroupService) {}

  @Post('create')
  @WithPermission([PERMISSIONS.DEPARTMENTS.CREATE])
  @Auth()
  group_create(
    @Body() createAppDepartmentDto: CreateAppGroupDto,
  ): Promise<Group> {
    return this.appDepartmentService.create(createAppDepartmentDto);
  }

  @Post('update/:id')
  @WithPermission([PERMISSIONS.DEPARTMENTS.UPDATE])
  @Auth()
  group_update(
    @Param('id') id: string,
    @Body() updateAppDepartmentDto: UpdateAppGroupDto,
  ): Promise<Group> {
    return this.appDepartmentService.update(id, updateAppDepartmentDto);
  }

  @Post('members/add/:id')
  @WithPermission([PERMISSIONS.DEPARTMENTS.UPDATE])
  @Auth()
  group_membersAdd(
    @Param('id') id: string,
    @Body() manageMembers: ManageMembersDto,
  ): Promise<GroupWithUsers> {
    return this.appDepartmentService.addMembers(id, manageMembers);
  }

  @Post('members/remove/:id')
  @WithPermission([PERMISSIONS.DEPARTMENTS.UPDATE])
  @Auth()
  group_membersRemove(
    @Param('id') id: string,
    @Body() manageMembers: ManageMembersDto,
  ): Promise<GroupWithUsers> {
    return this.appDepartmentService.removeMembers(id, manageMembers);
  }

  @Post('delete/:id')
  @WithPermission([PERMISSIONS.DEPARTMENTS.DELETE])
  @Auth()
  group_remove(@Param('id') id: string): Promise<Group> {
    return this.appDepartmentService.remove(id);
  }

  @Get('detailed')
  @WithPermission([PERMISSIONS.DEPARTMENTS.GET])
  @Auth()
  @ApiPaginatedResponse(GroupWithUsers)
  group_findAllDetailed(@Query() pagination: IPagination) {
    return this.appDepartmentService.listAllMembers(pagination);
  }

  @Get()
  @WithPermission([PERMISSIONS.DEPARTMENTS.GET])
  @Auth()
  @ApiPaginatedResponse(CGroup)
  group_findAll(@Query() pagination: IPagination) {
    return this.appDepartmentService.getGroups(pagination);
  }
}
