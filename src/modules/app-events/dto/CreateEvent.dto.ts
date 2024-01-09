import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
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

  @IsOptional()
  @IsString()
  statusBoardId?: string;

  @IsOptional()
  @IsNumber()
  statusBoardIndex?: number;

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

export class UpdateEventsCell {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: () => UpdateEventDto })
  data: UpdateEventDto;
}

export class UpdateEventsDto {
  @ApiProperty({ isArray: true, type: () => UpdateEventsCell })
  events: UpdateEventsCell[];
}
