import { CONFIG } from '@/config/env';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { User } from '@prisma/client';
import moment from 'moment-timezone';
import * as SibApiV3Sdk from 'sib-api-v3-typescript';
import { PrismaService } from '../db-prisma/db-prisma.service';
import { MailBrevoService } from '../mail-brevo/mail-brevo.service';

@Injectable()
export class CronReminderService {
  constructor(
    private readonly database: PrismaService,
    private readonly mail: MailBrevoService,
  ) {
    console.log('CronReminderService', CronReminderService.name);
  }

  private readonly logger = new Logger(CronReminderService.name);

  nameProcessor(user: User) {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.name) {
      return user.name;
    }
    return user.email;
  }

  @Cron(CONFIG.EVENT_REMINDER_CRON_FREQUENCY)
  async sendReminderEmails() {
    this.logger.debug('Running Cron Reminder Emails');

    // get all event reminder events past due current time and is not done
    const eventReminder = await this.database.eventReminder.findMany({
      where: {
        done: false,
        remindAt: {
          lte: new Date(),
        },
      },
      include: {
        Event: {
          include: {
            Calendar: {
              include: {
                CalendarOnUser: {
                  include: {
                    User: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const allUsersQuery = await this.database.user.findMany();
    const allUsersObject = allUsersQuery.map((user) => {
      return {
        email: user.email,
        name: this.nameProcessor(user),
      };
    });

    const batchEmailData: SibApiV3Sdk.SendSmtpEmailMessageVersions[] = [];

    let totalSent = 0;
    let totalEvents = 0;

    // loop through each event reminder
    for (const reminder of eventReminder) {
      // check if calendar is public
      const isPublic =
        reminder.Event.Calendar.CalendarOnUser.filter(
          (user) => user.IsPublic === true,
        ).length === 0;

      let to = [];
      if (isPublic) {
        to = allUsersObject;
      } else {
        to = reminder.Event.Calendar.CalendarOnUser.filter(
          (user) => user.User?.email,
        ).map((user) => {
          return {
            email: user.User.email,
            name: this.nameProcessor(user.User),
          };
        });
      }

      totalSent += to.length;

      const eventInfo = reminder.Event;

      let dateObject = '';

      if (eventInfo.allDay) {
        // format: March 1, 2021 12:45 AM UTC
        dateObject = moment(eventInfo.start)
          .tz('Asia/Singapore')
          .format('MMMM D, YYYY h:mm A');
      } else {
        // format: March 1, 2021 12:45 AM - 1:45 AM UTC
        dateObject = `${moment(eventInfo.start)
          .tz('Asia/Singapore')
          .format('MMMM D, YYYY h:mm A')} - ${moment(eventInfo.end)
          .tz('Asia/Singapore')
          .format('MMMM D, YYYY h:mm A')}`;
      }

      const params = {
        name: eventInfo.title,
        description: eventInfo.description,
        date: dateObject,
        members: to,
      };

      totalEvents++;
      batchEmailData.push({
        to,
        // @ts-expect-error ignore
        params,
      });

      // update reminder as done
      await this.database.eventReminder.update({
        where: {
          id: reminder.id,
        },
        data: {
          done: true,
        },
      });
    }

    await this.mail.sendBatchEmailByBrevoTemplate(
      batchEmailData,
      'Event Reminder',
      'BDB Portal Event Reminder',
      CONFIG.BREVO_TEMPLATE_EVENT_REMINDER,
    );

    this.logger.debug(`Sent ${totalSent} emails for ${totalEvents} events`);
  }
}
