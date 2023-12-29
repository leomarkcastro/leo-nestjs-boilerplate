import { Auth } from '@/global/decorators/Auth.decorator';
import { BasicOwnershipType } from '@/global/types/BasicOwnership.dto';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CalendarAccess } from '../app-events/dto/CalendarAccess.dto';
import { FileOwnershipType } from '../app-file/dto/FileOwnership.dto';
import { BoardAccess } from '../app-task/dto/BoardAccess.dto';

@Controller('enums')
@ApiTags('enums')
export class AppEnumsController {
  @Get('basic-access')
  @Auth()
  async getBasicAccess(): Promise<string[]> {
    return Object.values(BasicOwnershipType);
  }

  @Get('calendar-access')
  @Auth()
  async getCalendarAccess(): Promise<string[]> {
    return Object.values(CalendarAccess);
  }

  @Get('file-ownership')
  @Auth()
  async getFileAccess(): Promise<string[]> {
    return Object.values(FileOwnershipType);
  }

  @Get('board-access')
  @Auth()
  async getBoardAccess(): Promise<string[]> {
    return Object.values(BoardAccess);
  }
}
