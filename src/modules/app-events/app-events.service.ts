import { Calendar } from '@/global/prisma-classes/calendar';
import { Event } from '@/global/prisma-classes/event';
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

    const filterOnlyHasStatus = data.hasStatusFilter ?? false;

    query.where = {
      ...query.where,
      calendarId: {
        in: data.ids ?? ['nul'],
      },
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
          event.backgroundColor ?? event.Calendar.backgroundColor,
        textColor: event.textColor ?? event.Calendar.textColor,
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

    return await this.db.event.update({
      where: {
        id,
      },
      data: {
        ...data,
        statusBoardIndex,
      },
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

  // update batch
  async updateDetailsBatch(events: UpdateEventsDto): Promise<Event[]> {
    const promises = events.events.map((event) => {
      return this.db.event.update({
        where: {
          id: event.id,
        },
        data: event.data,
      });
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
}
