import { CONFIG } from '@/config/env';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Event } from '@prisma/client';
import { PrismaService } from '../db-prisma/db-prisma.service';
import { MailBrevoService } from '../mail-brevo/mail-brevo.service';

@Injectable()
export class CronReminderService {
  constructor(
    private readonly database: PrismaService,
    private readonly mail: MailBrevoService,
  ) {}

  private readonly logger = new Logger(CronReminderService.name);

  @Cron(CronExpression.EVERY_30_MINUTES)
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

    // loop through each event reminder
    for (const reminder of eventReminder) {
      // send email to each user
      for (const user of reminder.Event.Calendar.CalendarOnUser) {
        if (!user.User.email) continue;
        await this.sendEmailRoutine(user.User.email, reminder.Event);
      }

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
  }

  async sendEmailRoutine(email: string, eventInfo: Event) {
    // send email to user
    await this.mail.sendEmailByBrevoTemplate(
      email,
      'Event Reminder',
      CONFIG.BREVO_TEMPLATE_EVENT_REMINDER,
      {
        username: email,
        name: eventInfo.title,
        description: eventInfo.description,
        start: eventInfo.start,
        end: eventInfo.end,
        allDay: eventInfo.allDay,
      },
    );
  }
}
