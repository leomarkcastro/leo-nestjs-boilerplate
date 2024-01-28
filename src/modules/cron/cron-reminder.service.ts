import { CONFIG } from '@/config/env';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { User } from '@prisma/client';
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

    const batchEmailData: SibApiV3Sdk.SendSmtpEmailMessageVersions = {
      to: [],
      params: null,
    };

    let totalSent = 0;
    let totalEvents = 0;

    // loop through each event reminder
    for (const reminder of eventReminder) {
      // send email to each user
      for (const user of reminder.Event.Calendar.CalendarOnUser) {
        if (!user.User.email) continue;
        batchEmailData.to.push({
          email: user.User.email,
          name: this.nameProcessor(user.User),
        });
        totalSent++;
        if (!batchEmailData.params) {
          const eventInfo = reminder.Event;
          batchEmailData.params = {
            // @ts-expect-error Should be ok
            name: eventInfo.title,
            // @ts-expect-error Should be ok
            description: eventInfo.description,
            start: eventInfo.start,
            end: eventInfo.end,
            // @ts-expect-error Should be ok
            allDay: eventInfo.allDay,
            members: reminder.Event.Calendar.CalendarOnUser.map((user) => ({
              name: this.nameProcessor(user.User),
              email: user.User.email,
            })),
          };
        }
      }

      totalEvents++;

      await this.mail.sendBatchEmailByBrevoTemplate(
        [batchEmailData],
        'Event Reminder',
        'BDB Portal Event Reminder',
        CONFIG.BREVO_TEMPLATE_EVENT_REMINDER,
      );

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

    this.logger.debug(`Sent ${totalSent} emails for ${totalEvents} events`);
  }
}
