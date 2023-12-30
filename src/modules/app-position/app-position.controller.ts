import { ApiPaginatedResponse } from '@/global/decorators/ApiPaginatedResponse.decorator';
import { Auth } from '@/global/decorators/Auth.decorator';
import { WithPermission } from '@/global/decorators/Permissions.decorator';
import { Position } from '@/global/prisma-classes/position';
import { IPagination } from '@/global/types/Pagination.dto';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PERMISSIONS } from '../permit/permissions.types';
import { AppPositionService } from './app-position.service';
import { PositionWithUsers } from './dto/PositionWithUsers.dto';
import {
  CreateAppPositionDto,
  ManageMembersDto,
} from './dto/create-app-position.dto';
import { UpdateAppPositionDto } from './dto/update-app-position.dto';

@Controller('position')
@ApiTags('position')
export class AppPositionController {
  constructor(private readonly service: AppPositionService) {}

  @Post('create')
  @WithPermission([PERMISSIONS.POSITIONS.CREATE])
  @Auth()
  position_create(@Body() createAppDepartmentDto: CreateAppPositionDto) {
    return this.service.create(createAppDepartmentDto);
  }

  @Post('update/:id')
  @WithPermission([PERMISSIONS.POSITIONS.UPDATE])
  @Auth()
  position_update(
    @Param('id') id: string,
    @Body() updateAppDepartmentDto: UpdateAppPositionDto,
  ) {
    return this.service.update(id, updateAppDepartmentDto);
  }

  @Post('members/add/:id')
  @WithPermission([PERMISSIONS.POSITIONS.UPDATE])
  @Auth()
  position_membersAdd(
    @Param('id') id: string,
    @Body() manageMembers: ManageMembersDto,
  ) {
    return this.service.addMembers(id, manageMembers);
  }

  @Post('members/remove/:id')
  @WithPermission([PERMISSIONS.POSITIONS.UPDATE])
  @Auth()
  position_membersRemove(
    @Param('id') id: string,
    @Body() manageMembers: ManageMembersDto,
  ) {
    return this.service.removeMembers(id, manageMembers);
  }

  @Post('delete/:id')
  @WithPermission([PERMISSIONS.POSITIONS.DELETE])
  @Auth()
  position_remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get('detailed')
  @WithPermission([PERMISSIONS.POSITIONS.GET])
  @Auth()
  @ApiPaginatedResponse(PositionWithUsers)
  position_findAllDetailed(@Query() pagination: IPagination) {
    return this.service.listAllMembers(pagination);
  }

  @Get('')
  @WithPermission([PERMISSIONS.POSITIONS.GET])
  @Auth()
  @ApiPaginatedResponse(Position)
  position_findAll(@Query() pagination: IPagination) {
    return this.service.getPositions(pagination);
  }
}
