import { Module } from '@nestjs/common';
import { AppContactsService } from './app-contacts.service';
import { AppContactsController } from './app-contacts.controller';

@Module({
  controllers: [AppContactsController],
  providers: [AppContactsService],
})
export class AppContactsModule {}
