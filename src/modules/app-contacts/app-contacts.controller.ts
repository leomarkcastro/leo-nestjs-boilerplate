import { Auth } from '@/global/decorators/Auth.decorator';
import { WithPermission } from '@/global/decorators/Permissions.decorator';
import { IPagination } from '@/global/types/Pagination.dto';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PERMISSIONS } from '../permit/permissions.types';
import { AppContactsService } from './app-contacts.service';
import { CreateAppContactDto } from './dto/create-app-contact.dto';
import { UpdateAppContactDto } from './dto/update-app-contact.dto';
import { ViewAppContactDto } from './dto/view-app-contact.dto';

@Controller('contacts')
@ApiTags('contacts')
export class AppContactsController {
  constructor(private readonly service: AppContactsService) {}

  @Post('create')
  @WithPermission([PERMISSIONS.CONTACTS.CREATE])
  @Auth()
  contacts_create(
    @Body() createAppContactDto: CreateAppContactDto,
  ): Promise<ViewAppContactDto> {
    return this.service.create(createAppContactDto);
  }

  @Get()
  @WithPermission([PERMISSIONS.CONTACTS.GET])
  @Auth()
  contacts_findAll(
    @Query() pagination: IPagination,
  ): Promise<ViewAppContactDto[]> {
    return this.service.findAll(pagination);
  }

  @Post('update/:id')
  @WithPermission([PERMISSIONS.CONTACTS.UPDATE])
  @Auth()
  contacts_update(
    @Param('id') id: string,
    @Body() updateAppContactDto: UpdateAppContactDto,
  ): Promise<ViewAppContactDto> {
    return this.service.update(id, updateAppContactDto);
  }

  @Post('delete/:id')
  @WithPermission([PERMISSIONS.CONTACTS.DELETE])
  @Auth()
  contacts_remove(@Param('id') id: string): Promise<ViewAppContactDto> {
    return this.service.remove(id);
  }
}
