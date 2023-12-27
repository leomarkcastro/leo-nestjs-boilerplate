import { Module } from '@nestjs/common';
import { AppEventsController } from './app-events.controller';
import { AppEventsService } from './app-events.service';

@Module({
  providers: [AppEventsService],
  controllers: [AppEventsController],
})
export class AppEventsModule {}
