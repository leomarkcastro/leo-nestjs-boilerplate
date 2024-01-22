import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  @Type(() => Boolean)
  allDay?: boolean = false;

  @IsString()
  calendarId: string;

  @IsOptional()
  @IsString()
  statusBoardId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  statusBoardIndex?: number;

  // check if string follows the rgba format (#RRGGBBAA)
  @IsOptional()
  @IsString()
  @Matches(/^#?([a-f\d]{3,4}|[a-f\d]{6}|[a-f\d]{8})$/i, {
    message: 'invalid hex format',
  })
  backgroundColor?: string;

  // check if string follows the rgba format
  @IsOptional()
  @IsString()
  @Matches(/^#?([a-f\d]{3,4}|[a-f\d]{6}|[a-f\d]{8})$/i, {
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
