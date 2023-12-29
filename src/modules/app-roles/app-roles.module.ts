import { Module } from '@nestjs/common';
import { AppRolesController } from './app-roles.controller';
import { AppRolesService } from './app-roles.service';

@Module({
  providers: [AppRolesService],
  controllers: [AppRolesController],
})
export class AppRolesModule {}
