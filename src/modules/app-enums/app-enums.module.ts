import { Module } from '@nestjs/common';
import { AppEnumsController } from './app-enums.controller';

@Module({
  controllers: [AppEnumsController],
})
export class AppEnumsModule {}
