import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateCalendarDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hasStatus?: boolean;

  // check if string follows the rgba format
  @IsString()
  @Matches(/^#?([a-f\d]{3,4}|[a-f\d]{6}|[a-f\d]{8})$/i, {
    message: 'invalid rgba format',
  })
  backgroundColor: string;

  // check if string follows the rgba format
  @IsString()
  @Matches(/^#?([a-f\d]{3,4}|[a-f\d]{6}|[a-f\d]{8})$/i, {
    message: 'invalid rgba format',
  })
  textColor: string;
}

export class UpdateCalendarDto extends PartialType(CreateCalendarDto) {}

export class QueryCalendarDto {
  @IsOptional()
  @IsString({
    each: true,
  })
  ids?: string[] = [];

  @IsOptional()
  @IsDateString()
  start?: string;

  @IsOptional()
  @IsDateString()
  end?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  captureAll?: boolean = false;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hasStatusFilter?: boolean = false;
}
