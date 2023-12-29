import { Module } from '@nestjs/common';
import { AppUsersService } from './app-users.service';
import { AppUsersController } from './app-users.controller';

@Module({
  providers: [AppUsersService],
  controllers: [AppUsersController],
})
export class AppUsersModule {}
