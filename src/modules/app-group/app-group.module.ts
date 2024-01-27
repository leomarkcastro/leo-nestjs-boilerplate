import { Module } from '@nestjs/common';
import { AppGroupController } from './app-group.controller';
import { AppGroupService } from './app-group.service';

@Module({
  providers: [AppGroupService],
  controllers: [AppGroupController],
})
export class AppGroupModule {}
