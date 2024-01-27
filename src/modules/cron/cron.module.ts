import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MailBrevoModule } from '../mail-brevo/mail-brevo.module';
import { CronReminderService } from './cron-reminder.service';

@Module({
  imports: [ScheduleModule.forRoot(), MailBrevoModule],
  providers: [CronReminderService],
})
export class CronModule {}
