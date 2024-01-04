import { PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  start?: string;

  @IsOptional()
  @IsDateString()
  end?: string;

  @IsOptional()
  @IsBoolean()
  allDay?: boolean = false;

  @IsString()
  calendarId: string;

  // check if string follows the rgba format (#RRGGBBAA)
  @IsOptional()
  @IsString()
  @Matches(/^#([0-9A-F]{3}){1,2}$/i, {
    message: 'invalid hex format',
  })
  backgroundColor?: string;

  // check if string follows the rgba format
  @IsOptional()
  @IsString()
  @Matches(/^#([0-9A-F]{3}){1,2}$/i, {
    message: 'invalid rgba format',
  })
  textColor?: string;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
