import { Module } from '@nestjs/common';
import { AppDepartmentController } from './app-department.controller';
import { AppDepartmentService } from './app-department.service';

@Module({
  controllers: [AppDepartmentController],
  providers: [AppDepartmentService],
})
export class AppDepartmentModule {}
