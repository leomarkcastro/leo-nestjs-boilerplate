import { Module } from '@nestjs/common';
import { AppPositionService } from './app-position.service';
import { AppPositionController } from './app-position.controller';

@Module({
  controllers: [AppPositionController],
  providers: [AppPositionService],
})
export class AppPositionModule {}
