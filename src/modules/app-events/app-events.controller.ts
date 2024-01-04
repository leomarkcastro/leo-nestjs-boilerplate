import { Auth } from '@/global/decorators/Auth.decorator';
import { CurrentUser } from '@/global/decorators/CurrentUser.decorator';
import { WithPermission } from '@/global/decorators/Permissions.decorator';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IUserJwt } from '../auth/types/UserJWT.dto';
import { PrismaService } from '../db-prisma/db-prisma.service';
import {
  IF_RESOURCE_EXIST,
  THROW_ON_RESOURCE_NOT_FOUND,
} from '../permit/guard/permit.constants';
import { PERMISSIONS } from '../permit/permissions.types';
import { PermitService } from '../permit/permit.service';
import { AppEventsService } from './app-events.service';
import {
  CalendarAccess,
  ManageMembersListRequest,
} from './dto/CalendarAccess.dto';
import {
  CreateCalendarDto,
  QueryCalendarDto,
  UpdateCalendarDto,
} from './dto/CreateCalendar.dto';
import { CreateEventDto, UpdateEventDto } from './dto/CreateEvent.dto';

@Controller('events')
@ApiTags('events')
export class AppEventsController {
  constructor(
    private readonly db: PrismaService,
    private readonly permit: PermitService,
    private readonly service: AppEventsService,
  ) {}

  // ===================================== calendar
  // create
  @Post('calendar/create')
  @WithPermission([PERMISSIONS.EVENTS.CALENDAR.CREATE])
  @Auth()
  async calendar_create(
    @CurrentUser() user: IUserJwt,
    @Body() data: CreateCalendarDto,
  ) {
    return await this.service.createCalendar(user, data);
  }

  async checkCalendarAdmin(user: IUserJwt, id: string) {
    return await this.permit.checkPermit(
      user,
      await (() => {
        return this.db.calendarOnUser.findUnique({
          where: {
            calendarId_userId_type: {
              calendarId: id,
              userId: user.id,
              type: CalendarAccess.ADMIN,
            },
          },
        });
      })(),
      IF_RESOURCE_EXIST,
      THROW_ON_RESOURCE_NOT_FOUND,
    );
  }

  // update
  @Post('calendar/update/:id')
  @WithPermission([PERMISSIONS.EVENTS.CALENDAR.UPDATE])
  @Auth()
  async calendar_update(
    @CurrentUser() user: IUserJwt,
    @Param('id') id: string,
    @Body() data: UpdateCalendarDto,
  ) {
    await this.checkCalendarAdmin(user, id);
    return await this.service.updateCalendar(id, data);
  }

  // add members
  @Post('calendar/add-members/:id')
  @WithPermission([PERMISSIONS.EVENTS.CALENDAR.ADD_MEMBERS])
  @Auth()
  async calendar_addMembers(
    @CurrentUser() user: IUserJwt,
    @Param('id') id: string,
    @Body() data: ManageMembersListRequest,
  ) {
    await this.checkCalendarAdmin(user, id);
    return await this.service.addMembersToCalendar(id, data.members);
  }

  // remove members
  @Post('calendar/remove-members/:id')
  @WithPermission([PERMISSIONS.EVENTS.CALENDAR.ADD_MEMBERS])
  @Auth()
  async calendar_removeMembers(
    @CurrentUser() user: IUserJwt,
    @Param('id') id: string,
    @Body() data: ManageMembersListRequest,
  ) {
    await this.checkCalendarAdmin(user, id);
    return await this.service.deleteMembersFromCalendar(id, data.members);
  }

  // update members
  @Post('calendar/update-members/:id')
  @WithPermission([PERMISSIONS.EVENTS.CALENDAR.ADD_MEMBERS])
  @Auth()
  async calendar_updateMembers(
    @CurrentUser() user: IUserJwt,
    @Param('id') id: string,
    @Body() data: ManageMembersListRequest,
  ) {
    await this.checkCalendarAdmin(user, id);
    return await this.service.updateMembersOnCalendar(id, data.members);
  }

  // delete
  @Post('calendar/delete/:id')
  @WithPermission([PERMISSIONS.EVENTS.CALENDAR.DELETE])
  @Auth()
  async calendar_delete(
    @CurrentUser() user: IUserJwt,
    @Param('id') id: string,
  ) {
    await this.checkCalendarAdmin(user, id);
    return await this.service.deleteCalendar(id);
  }

  // get
  @Get('calendar')
  @WithPermission([PERMISSIONS.EVENTS.CALENDAR.GET])
  @Auth()
  async calendar_getCalendarList(@CurrentUser() user: IUserJwt) {
    return await this.service.getCalendars(user);
  }

  // ===================================== events

  async checkListMemberByCalendar(
    user: IUserJwt,
    calendarId: string,
    includeView = false,
  ) {
    return await this.permit.checkPermit(
      user,
      await (async () => {
        const fetch = await this.db.calendarOnUser.findUnique({
          where: {
            calendarId_userId: {
              calendarId: calendarId,
              userId: user.id,
            },
          },
        });
        if (!fetch) return null;
        if (fetch.type === CalendarAccess.ADMIN) return fetch;
        if (fetch.type === CalendarAccess.EDIT) return fetch;

        return includeView ? fetch : null;
      })(),
      IF_RESOURCE_EXIST,
      THROW_ON_RESOURCE_NOT_FOUND,
    );
  }

  async checkListMemberByEvent(user: IUserJwt, eventId) {
    return await this.permit.checkPermit(
      user,
      await (async () => {
        const eventObj = await this.db.event.findUnique({
          where: {
            id: eventId,
          },
          include: {
            Calendar: true,
          },
        });
        if (!eventObj) return null;
        const fetch = await this.db.calendarOnUser.findUnique({
          where: {
            calendarId_userId: {
              calendarId: eventObj.Calendar.id,
              userId: user.id,
            },
          },
        });
        if (!fetch) return null;
        if (fetch.type === CalendarAccess.ADMIN) return fetch;
        if (fetch.type === CalendarAccess.EDIT) return fetch;

        return null;
      })(),
      IF_RESOURCE_EXIST,
      THROW_ON_RESOURCE_NOT_FOUND,
    );
  }

  // get
  @Get()
  @WithPermission([PERMISSIONS.EVENTS.EVENT.GET])
  @Auth()
  async calendar_getEventsList(
    @CurrentUser() user: IUserJwt,
    @Query() data: QueryCalendarDto,
  ) {
    // if data.ids is a string, covnert it to array
    if (typeof data.ids === 'string') {
      data.ids = [data.ids];
    }
    // for (const calendarId of data.ids) {
    //   await this.checkListMemberByCalendar(user, calendarId, true);
    // }
    // this is a hack to make sure that the user has access to at least one calendar
    return await this.service.getEventsOnCalendar(user, data);
  }

  // create
  @Post('create')
  @WithPermission([PERMISSIONS.EVENTS.EVENT.CREATE])
  @Auth()
  async calendar_createEvent(
    @CurrentUser() user: IUserJwt,
    @Body() data: CreateEventDto,
  ) {
    await this.checkListMemberByCalendar(user, data.calendarId);
    return await this.service.create(data);
  }

  // update details
  @Post('update/:id')
  @WithPermission([PERMISSIONS.EVENTS.EVENT.UPDATE])
  @Auth()
  async calendar_updateEvent(
    @CurrentUser() user: IUserJwt,
    @Param('id') id: string,
    @Body() data: UpdateEventDto,
  ) {
    await this.checkListMemberByEvent(user, id);
    return await this.service.updateDetails(id, data);
  }
  // delete
  @Post('delete/:id')
  @WithPermission([PERMISSIONS.EVENTS.EVENT.DELETE])
  @Auth()
  async calendar_deleteEvent(
    @CurrentUser() user: IUserJwt,
    @Param('id') id: string,
  ) {
    await this.checkListMemberByEvent(user, id);
    return await this.service.delete(id);
  }
}
