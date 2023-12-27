import { Module } from '@nestjs/common';
import { AppTaskController } from './app-task.controller';
import { AppTaskService } from './app-task.service';

@Module({
  providers: [AppTaskService],
  controllers: [AppTaskController],
})
export class AppTaskModule {}
