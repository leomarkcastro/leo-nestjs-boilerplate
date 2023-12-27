import { Module } from '@nestjs/common';
import { AppNotificationsService } from './app-notifications.service';
import { AppNotificationsController } from './app-notifications.controller';

@Module({
  providers: [AppNotificationsService],
  controllers: [AppNotificationsController],
})
export class AppNotificationsModule {}
