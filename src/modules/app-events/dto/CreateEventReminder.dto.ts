import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateEventReminderDto {
  @IsString()
  eventID: string;

  @IsNumber()
  @Type(() => Number)
  remindOn: number; // in minutes
}

export class UpdateEventReminderDto {
  @IsNumber()
  @Type(() => Number)
  remindOn: number; // in minutes
}
