import { BasicOwnershipType } from '@/global/types/BasicOwnership.dto';
import { IPagination } from '@/global/types/Pagination.dto';
import { Injectable } from '@nestjs/common';
import { IUserJwt } from '../auth/types/UserJWT.dto';
import { PrismaService } from '../db-prisma/db-prisma.service';
import { BroadcastNotificationDto } from './dto/BroadcastNotification.dto';
import { NotificationClass } from './dto/Notification.dto';

@Injectable()
export class AppNotificationsService {
  constructor(private readonly db: PrismaService) {}

  // get list
  async getList(
    user: IUserJwt,
    pagination: IPagination,
  ): Promise<NotificationClass[]> {
    return await this.db.notification.findMany({
      where: {
        NotificationOnUser: {
          some: {
            userId: user.id,
          },
        },
      },
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
      orderBy: {
        [pagination.sortBy]: pagination.sortDesc ? 'desc' : 'asc',
      },
    });
  }

  // broadcast
  async broadcast(
    user: IUserJwt,
    content: BroadcastNotificationDto,
    receivers: string[],
  ): Promise<NotificationClass> {
    const notification = await this.db.notification.create({
      data: {
        title: content.title,
        type: content.type,
        content: content.content,
      },
    });
    for (const receiver of receivers) {
      await this.db.notificationOnUser.create({
        data: {
          type: BasicOwnershipType.VIEW,
          userId: receiver,
          notificationId: notification.id,
        },
      });
    }
    await this.db.notificationOnUser.create({
      data: {
        type: BasicOwnershipType.OWNER,
        userId: user.id,
        notificationId: notification.id,
      },
    });
    return notification;
  }

  // set to read
  async setToRead(user: IUserJwt, notificationIds: string[]) {
    await this.db.notificationOnUser.updateMany({
      where: {
        userId: user.id,
        notificationId: {
          in: notificationIds,
        },
      },
      data: {
        hasRead: true,
      },
    });
  }

  // delete (only owner)
  async delete(user: IUserJwt, notificationIds: string[]) {
    await this.db.notification.deleteMany({
      where: {
        id: {
          in: notificationIds,
        },
        NotificationOnUser: {
          some: {
            userId: user.id,
            type: BasicOwnershipType.OWNER,
          },
        },
      },
    });
  }
}
