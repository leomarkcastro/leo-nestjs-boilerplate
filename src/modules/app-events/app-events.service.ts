import { Calendar } from '@/global/prisma-classes/calendar';
import { Event } from '@/global/prisma-classes/event';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IUserJwt } from '../auth/types/UserJWT.dto';
import { PrismaService } from '../db-prisma/db-prisma.service';
import {
  CalendarAccess,
  DeleteMembersRequest,
  ManageMembersRequest,
} from './dto/CalendarAccess.dto';
import { CalendarWithUsers } from './dto/CalendarWithUser.dto';
import { CreateCalendarDto, QueryCalendarDto } from './dto/CreateCalendar.dto';
import { CreateEventDto, UpdateEventDto } from './dto/CreateEvent.dto';
import { EventWithTasks } from './dto/EventObject.dto';

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
    data: Partial<CreateCalendarDto>,
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
      await this.db.calendarOnUser.update({
        where: {
          calendarId_userId: {
            calendarId: id,
            userId: member.userId,
          },
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
            userId: user.id,
          },
        },
      },
    });
  }

  // ===================================== events

  // create
  async create(createEvent: CreateEventDto): Promise<Event> {
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
      },
    });
  }

  // get events on a calendar
  async getEventsOnCalendar(data: QueryCalendarDto): Promise<EventWithTasks[]> {
    if (!data.start) {
      data.start = new Date().toISOString();
    }
    if (!data.end) {
      // move 1 month forward
      const date = new Date(data.start);
      date.setMonth(date.getMonth() + 1);
      data.end = date.toISOString();
    }

    const query: Prisma.EventFindManyArgs = {
      where: {
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
      },
    };

    query.where = {
      ...query.where,
      calendarId: {
        in: data.ids ?? ['nul'],
      },
    };

    let events = await this.db.event.findMany({
      ...query,
      include: {
        Calendar: true,
        TaskOnEvent: {
          include: {
            Task: true,
          },
        },
      },
    });

    // Either use events custom color or calendar color
    events = events.map((event) => {
      return {
        ...event,
        backgroundColor:
          event.backgroundColor ?? event.Calendar.backgroundColor,
        textColor: event.textColor ?? event.Calendar.textColor,
      };
    });

    return events as EventWithTasks[];
  }

  // update details
  async updateDetails(
    id: string,
    data: Partial<UpdateEventDto>,
  ): Promise<Event> {
    return await this.db.event.update({
      where: {
        id,
      },
      data,
    });
  }

  // delete
  async delete(eventId: string): Promise<Event> {
    return await this.db.event.delete({
      where: {
        id: eventId,
      },
    });
  }
}
