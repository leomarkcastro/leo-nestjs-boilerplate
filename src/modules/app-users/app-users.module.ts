import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AppUsersController } from './app-users.controller';
import { AppUsersService } from './app-users.service';

@Module({
  imports: [AuthModule],
  providers: [AppUsersService],
  controllers: [AppUsersController],
})
export class AppUsersModule {}
