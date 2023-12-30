import { Auth } from '@/global/decorators/Auth.decorator';
import { CurrentUser } from '@/global/decorators/CurrentUser.decorator';
import { WithPermission } from '@/global/decorators/Permissions.decorator';
import { IPagination } from '@/global/types/Pagination.dto';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IUserJwt } from '../auth/types/UserJWT.dto';
import { PERMISSIONS } from '../permit/permissions.types';
import { AppNotificationsService } from './app-notifications.service';
import {
  CreateBroadcastNotificationDto,
  NotificationDeleteDto,
} from './dto/BroadcastNotification.dto';
import { NotificationClass } from './dto/Notification.dto';

@Controller('notifications')
@ApiTags('notifications')
export class AppNotificationsController {
  constructor(private readonly service: AppNotificationsService) {}

  @Get()
  @WithPermission([PERMISSIONS.NOTIF.READ])
  @Auth()
  async nofitications_get(
    @CurrentUser() user: IUserJwt,
    @Query() pagination: IPagination,
  ): Promise<NotificationClass[]> {
    return await this.service.getList(user, pagination);
  }

  @Post('broadcast')
  @WithPermission([PERMISSIONS.NOTIF.CREATE])
  @Auth()
  async nofitications_broadcast(
    @CurrentUser() user: IUserJwt,
    @Body() body: CreateBroadcastNotificationDto,
  ): Promise<NotificationClass> {
    const { receivers, ...content } = body;
    return await this.service.broadcast(user, content, receivers);
  }

  @Post('delete')
  @WithPermission([PERMISSIONS.NOTIF.DELETE])
  @Auth()
  @ApiResponse({ status: 200 })
  async nofitications_delete(
    @CurrentUser() user: IUserJwt,
    @Body() toDelete: NotificationDeleteDto,
  ) {
    await this.service.delete(user, toDelete.ids);
    return 'OK';
  }
}
