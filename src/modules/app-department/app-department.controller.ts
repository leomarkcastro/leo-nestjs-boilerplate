import { ApiPaginatedResponse } from '@/global/decorators/ApiPaginatedResponse.decorator';
import { Auth } from '@/global/decorators/Auth.decorator';
import { WithPermission } from '@/global/decorators/Permissions.decorator';
import { Department } from '@/global/prisma-classes/department';
import { IPagination } from '@/global/types/Pagination.dto';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PERMISSIONS } from '../permit/permissions.types';
import { AppDepartmentService } from './app-department.service';
import { DepartmentWithUsers } from './dto/DepartmentWithUsers.dto';
import {
  CreateAppDepartmentDto,
  ManageMembersDto,
} from './dto/create-app-department.dto';
import { UpdateAppDepartmentDto } from './dto/update-app-department.dto';

@Controller('department')
@ApiTags('department')
export class AppDepartmentController {
  constructor(private readonly appDepartmentService: AppDepartmentService) {}

  @Post('create')
  @WithPermission([PERMISSIONS.DEPARTMENTS.CREATE])
  @Auth()
  department_create(
    @Body() createAppDepartmentDto: CreateAppDepartmentDto,
  ): Promise<Department> {
    return this.appDepartmentService.create(createAppDepartmentDto);
  }

  @Post('update/:id')
  @WithPermission([PERMISSIONS.DEPARTMENTS.UPDATE])
  @Auth()
  department_update(
    @Param('id') id: string,
    @Body() updateAppDepartmentDto: UpdateAppDepartmentDto,
  ): Promise<Department> {
    return this.appDepartmentService.update(id, updateAppDepartmentDto);
  }

  @Post('members/add/:id')
  @WithPermission([PERMISSIONS.DEPARTMENTS.UPDATE])
  @Auth()
  department_membersAdd(
    @Param('id') id: string,
    @Body() manageMembers: ManageMembersDto,
  ): Promise<DepartmentWithUsers> {
    return this.appDepartmentService.addMembers(id, manageMembers);
  }

  @Post('members/remove/:id')
  @WithPermission([PERMISSIONS.DEPARTMENTS.UPDATE])
  @Auth()
  department_membersRemove(
    @Param('id') id: string,
    @Body() manageMembers: ManageMembersDto,
  ): Promise<DepartmentWithUsers> {
    return this.appDepartmentService.removeMembers(id, manageMembers);
  }

  @Post('delete/:id')
  @WithPermission([PERMISSIONS.DEPARTMENTS.DELETE])
  @Auth()
  department_remove(@Param('id') id: string): Promise<Department> {
    return this.appDepartmentService.remove(id);
  }

  @Get('detailed')
  @WithPermission([PERMISSIONS.DEPARTMENTS.GET])
  @Auth()
  @ApiPaginatedResponse(DepartmentWithUsers)
  department_findAllDetailed(@Query() pagination: IPagination) {
    return this.appDepartmentService.listAllMembers(pagination);
  }

  @Get()
  @WithPermission([PERMISSIONS.DEPARTMENTS.GET])
  @Auth()
  @ApiPaginatedResponse(Department)
  department_findAll(@Query() pagination: IPagination) {
    return this.appDepartmentService.getDepartments(pagination);
  }
}
