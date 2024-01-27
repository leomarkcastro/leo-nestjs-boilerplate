import { Calendar } from '@/global/prisma-classes/calendar';
import { Event } from '@/global/prisma-classes/event';
import { SitutationBoard } from '@/global/prisma-classes/situtation_board';
import { StatusBoard } from '@/global/prisma-classes/status_board';
import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IUserJwt } from '../auth/types/UserJWT.dto';
import { PrismaService } from '../db-prisma/db-prisma.service';
import {
  CalendarAccess,
  DeleteMembersRequest,
  ManageMembersRequest,
  ManagePublicMembersRequest,
} from './dto/CalendarAccess.dto';
import { CalendarWithUsers } from './dto/CalendarWithUser.dto';
import {
  CreateCalendarDto,
  QueryCalendarDto,
  UpdateCalendarDto,
} from './dto/CreateCalendar.dto';
import {
  CreateEventDto,
  UpdateEventDto,
  UpdateEventsDto,
} from './dto/CreateEvent.dto';
import {
  CreateEventReminderDto,
  UpdateEventReminderDto,
} from './dto/CreateEventReminder.dto';
import {
  CreateSituationBoardDto,
  UpdateSituationBoardDto,
} from './dto/CreateSituationBoard.dto';
import {
  CreateStatusBoardDto,
  UpdateStatusBoardDto,
} from './dto/CreateStatusBoard.dto';
import { EventWithTasksAndStatus } from './dto/EventObject.dto';

@Injectable()
export class AppEventsService {
  constructor(private readonly db: PrismaService) {}

  // ===================================== calendar

  // create
  async createCalendar(
    user: IUserJwt,
    data: CreateCalendarDto,
  ): Promise<Calendar> {
    return await this.db.calendar.create({
      data: {
        title: data.title,
        description: data.description,
        backgroundColor: data.backgroundColor,
        textColor: data.textColor,
        CalendarOnUser: {
          create: {
            type: CalendarAccess.ADMIN,
            userId: user.id,
          },
        },
      },
    });
  }

  // update
  async updateCalendar(
    id: string,
    data: Partial<UpdateCalendarDto>,
  ): Promise<Calendar> {
    return await this.db.calendar.update({
      where: {
        id,
      },
      data,
    });
  }

  // add members
  async addMembersToCalendar(
    id: string,
    data: ManageMembersRequest[],
  ): Promise<CalendarWithUsers> {
    for (const member of data) {
      await this.db.calendarOnUser.create({
        data: {
          type: member.type ?? CalendarAccess.VIEW,
          userId: member.userId,
          calendarId: id,
        },
      });
    }
    return await this.db.calendar.findUnique({
      where: {
        id,
      },
      include: {
        CalendarOnUser: {
          include: {
            User: true,
          },
        },
      },
    });
  }

  // update members
  async updateMembersOnCalendar(
    id: string,
    data: ManageMembersRequest[],
  ): Promise<CalendarWithUsers> {
    for (const member of data) {
      await this.db.calendarOnUser.updateMany({
        where: {
          calendarId: id,
          userId: member.userId,
        },
        data: {
          type: member.type,
        },
      });
    }

    return await this.db.calendar.findUnique({
      where: {
        id,
      },
      include: {
        CalendarOnUser: {
          include: {
            User: true,
          },
        },
      },
    });
  }

  // delete members
  async deleteMembersFromCalendar(
    id: string,
    data: DeleteMembersRequest[],
  ): Promise<CalendarWithUsers> {
    await this.db.calendarOnUser.deleteMany({
      where: {
        AND: [
          {
            calendarId: id,
          },
          {
            userId: {
              in: data.map((member) => member.userId),
            },
          },
        ],
      },
    });

    return await this.db.calendar.findUnique({
      where: {
        id,
      },
      include: {
        CalendarOnUser: {
          include: {
            User: true,
          },
        },
      },
    });
  }

  // add public access
  async addPublicAccessToCalendar(
    id: string,
    data: ManagePublicMembersRequest,
  ): Promise<CalendarWithUsers> {
    await this.db.calendarOnUser.create({
      data: {
        type: data.type ?? CalendarAccess.VIEW,
        IsPublic: true,
        calendarId: id,
      },
    });

    return await this.db.calendar.findUnique({
      where: {
        id,
      },
      include: {
        CalendarOnUser: {
          include: {
            User: true,
          },
        },
      },
    });
  }

  // update public access
  async updatePublicAccessOnCalendar(
    id: string,
    data: ManagePublicMembersRequest,
  ): Promise<CalendarWithUsers> {
    await this.db.calendarOnUser.updateMany({
      where: {
        calendarId: id,
        IsPublic: true,
      },
      data: {
        type: data.type,
      },
    });

    return await this.db.calendar.findUnique({
      where: {
        id,
      },
      include: {
        CalendarOnUser: {
          include: {
            User: true,
          },
        },
      },
    });
  }

  // delete public access
  async deletePublicAccessFromCalendar(id: string): Promise<CalendarWithUsers> {
    await this.db.calendarOnUser.deleteMany({
      where: {
        calendarId: id,
        IsPublic: true,
      },
    });

    return await this.db.calendar.findUnique({
      where: {
        id,
      },
      include: {
        CalendarOnUser: {
          include: {
            User: true,
          },
        },
      },
    });
  }

  // delete
  async deleteCalendar(id: string): Promise<Calendar> {
    return await this.db.calendar.delete({
      where: {
        id,
      },
    });
  }

  // get
  async getCalendars(user: IUserJwt): Promise<Calendar[]> {
    return await this.db.calendar.findMany({
      where: {
        CalendarOnUser: {
          some: {
            OR: [
              {
                userId: user.id,
              },
              {
                IsPublic: true,
              },
            ],
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });
  }

  // get with users
  async getCalendarWithUser(id: string): Promise<CalendarWithUsers> {
    return await this.db.calendar.findUnique({
      where: {
        id,
      },
      include: {
        CalendarOnUser: {
          include: {
            User: true,
          },
        },
      },
    });
  }

  // ===================================== events

  // create
  async create(createEvent: CreateEventDto): Promise<Event> {
    // check if allDay is true, else check if start and end is provided
    if (!createEvent.allDay) {
      if (!createEvent.start || !createEvent.end) {
        throw new HttpException('start and end must be provided', 400);
      }
    }

    let statusBoardIndex = createEvent.statusBoardIndex;

    if (createEvent.statusBoardId && !statusBoardIndex) {
      const statusBoardCount = await this.db.event.count({
        where: {
          statusBoardId: createEvent.statusBoardId,
        },
      });

      statusBoardIndex = statusBoardCount;
    }

    return await this.db.event.create({
      data: {
        title: createEvent.title,
        description: createEvent.description,
        calendarId: createEvent.calendarId,
        allDay: createEvent.allDay ?? false,
        start: createEvent.start,
        end: createEvent.end,
        backgroundColor: createEvent.backgroundColor,
        textColor: createEvent.textColor,
        statusBoardId: createEvent.statusBoardId,
        statusBoardIndex: createEvent.statusBoardIndex,
      },
    });
  }

  // get events on a calendar
  async getEventsOnCalendar(
    user: IUserJwt,
    data: QueryCalendarDto,
  ): Promise<EventWithTasksAndStatus[]> {
    if (!data.start) {
      data.start = new Date().toISOString();
    }
    if (!data.end) {
      // move 1 month forward
      const date = new Date(data.start);
      date.setMonth(date.getMonth() + 1);
      data.end = date.toISOString();
    }

    const query: Prisma.EventFindManyArgs = {};

    if (!data.captureAll) {
      query.where = {
        OR: [
          // (loadingTime <= dateRange.start && endTime > dateRange.start) ||
          {
            start: {
              lte: data.start,
            },
            end: {
              gt: data.start,
            },
          },
          // (loadingTime < dateRange.end  && endTime >= dateRange.end ) ||
          {
            start: {
              lt: data.end,
            },
            end: {
              gte: data.end,
            },
          },
          // (loadingTime >= dateRange.start && loadingTime < dateRange.end) ||
          {
            start: {
              gte: data.start,
              lt: data.end,
            },
          },
          // (endTime > dateRange.start && endTime <= dateRange.end)
          {
            end: {
              gt: data.start,
              lte: data.end,
            },
          },
        ],
      };
    }

    const filterOnlyHasStatus = data.hasStatusFilter ?? false;

    query.where = {
      ...query.where,
      Calendar: {
        CalendarOnUser: {
          some: {
            OR: [
              {
                userId: user.id,
              },
              {
                IsPublic: true,
              },
            ],
          },
        },
      },
    };

    if (data.ids && data.ids.length > 0) {
      query.where = {
        ...query.where,
        calendarId: {
          in: data.ids,
        },
      };
    }

    if (filterOnlyHasStatus) {
      query.where.Calendar.hasStatus = true;
    }

    let events = await this.db.event.findMany({
      ...query,
      include: {
        Calendar: true,
        TaskOnEvent: {
          include: {
            Task: true,
          },
        },
        StatusBoard: true,
      },
    });

    // Either use events custom color or calendar color
    events = events.map((event) => {
      return {
        ...event,
        backgroundColor:
          event.backgroundColor ??
          event.StatusBoard?.bgColor ??
          event.Calendar.backgroundColor,
        textColor:
          event.textColor ??
          event.StatusBoard?.color ??
          event.Calendar.textColor,
      };
    });

    return events as EventWithTasksAndStatus[];
  }

  // update details
  async updateDetails(
    id: string,
    data: Partial<UpdateEventDto>,
  ): Promise<Event> {
    let statusBoardIndex;

    if (data.statusBoardId && !statusBoardIndex) {
      const statusBoardCount = await this.db.event.count({
        where: {
          statusBoardId: data.statusBoardId,
        },
      });

      statusBoardIndex = statusBoardCount;
    }

    const updatedEvent = await this.db.event.update({
      where: {
        id,
      },
      data: {
        ...data,
        statusBoardIndex,
      },
    });

    if (data.start) {
      await this.updateReminderTimeOnStartDateChange(id);
    }

    return updatedEvent;
  }

  // delete
  async delete(eventId: string): Promise<Event> {
    return await this.db.event.delete({
      where: {
        id: eventId,
      },
    });
  }

  // update batch
  async updateDetailsBatch(events: UpdateEventsDto): Promise<Event[]> {
    const promises = events.events.map((event) => {
      return this.updateDetails(event.id, event.data);
    });

    return await Promise.all(promises);
  }

  // ===================================== status board
  // get
  async getStatusBoards(): Promise<StatusBoard[]> {
    return await this.db.statusBoard.findMany();
  }

  // create
  async createStatusBoard(data: CreateStatusBoardDto): Promise<StatusBoard> {
    return await this.db.statusBoard.create({
      data,
    });
  }

  // update
  async updateStatusBoard(
    id: string,
    data: Partial<UpdateStatusBoardDto>,
  ): Promise<StatusBoard> {
    return await this.db.statusBoard.update({
      where: {
        id,
      },
      data,
    });
  }

  // delete
  async deleteStatusBoard(id: string): Promise<StatusBoard> {
    return await this.db.statusBoard.delete({
      where: {
        id,
      },
    });
  }

  // sort status board
  async sortStatusBoards(statusBoardIds: string[]): Promise<StatusBoard[]> {
    const promises = statusBoardIds.map((statusBoardId, index) => {
      return this.db.statusBoard.update({
        where: {
          id: statusBoardId,
        },
        data: {
          index,
        },
      });
    });

    return await Promise.all(promises);
  }

  // ===================================== situation board
  // get
  async getSituationBoards(): Promise<SitutationBoard[]> {
    return await this.db.situtationBoard.findMany();
  }

  // create
  async createSituationBoard(
    data: CreateSituationBoardDto,
  ): Promise<SitutationBoard> {
    return await this.db.situtationBoard.create({
      data,
    });
  }

  // update
  async updateSituationBoard(
    id: string,
    data: Partial<UpdateSituationBoardDto>,
  ): Promise<SitutationBoard> {
    return await this.db.situtationBoard.update({
      where: {
        id,
      },
      data,
    });
  }

  // delete
  async deleteSituationBoard(id: string): Promise<SitutationBoard> {
    return await this.db.situtationBoard.delete({
      where: {
        id,
      },
    });
  }

  // sort situation board
  async sortSituationBoards(
    situationBoardIds: string[],
  ): Promise<SitutationBoard[]> {
    const promises = situationBoardIds.map((statusBoardId, index) => {
      return this.db.situtationBoard.update({
        where: {
          id: statusBoardId,
        },
        data: {
          index,
        },
      });
    });

    return await Promise.all(promises);
  }

  // ===================================== notifications

  // create
  async createNotification(createNotif: CreateEventReminderDto) {
    // get the event provided
    const event = await this.db.event.findUnique({
      where: {
        id: createNotif.eventID,
      },
    });

    if (!event) {
      throw new HttpException('Event not found', 404);
    }

    const remindOn = new Date(event.start);
    remindOn.setMinutes(remindOn.getMinutes() - createNotif.remindOn);

    return await this.db.eventReminder.create({
      data: {
        eventId: createNotif.eventID,
        remindDuration: createNotif.remindOn,
        remindAt: remindOn.toISOString(),
      },
    });
  }

  // update
  async updateNotification(id: string, updateNotif: UpdateEventReminderDto) {
    // get the event provided
    const event = await this.db.eventReminder.findUnique({
      where: {
        id: id,
      },
      include: {
        Event: true,
      },
    });

    if (!event) {
      throw new HttpException('Event not found', 404);
    }

    const remindOn = new Date(event.Event.start);
    remindOn.setMinutes(remindOn.getMinutes() - updateNotif.remindOn);

    return await this.db.eventReminder.update({
      where: {
        id: id,
      },
      data: {
        remindDuration: updateNotif.remindOn,
        remindAt: remindOn.toISOString(),
      },
    });
  }

  // delete
  async deleteNotification(id: string) {
    return await this.db.eventReminder.delete({
      where: {
        id,
      },
    });
  }

  // update reminder time on start date change
  async updateReminderTimeOnStartDateChange(eventId: string) {
    const event = await this.db.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      throw new HttpException('Event not found', 404);
    }

    const reminders = await this.db.eventReminder.findMany({
      where: {
        eventId: eventId,
      },
    });

    const promises = reminders.map((reminder) => {
      const remindOn = new Date(event.start);
      remindOn.setMinutes(remindOn.getMinutes() - reminder.remindDuration);

      return this.db.eventReminder.update({
        where: {
          id: reminder.id,
        },
        data: {
          remindAt: remindOn.toISOString(),
        },
      });
    });

    return await Promise.all(promises);
  }
}
