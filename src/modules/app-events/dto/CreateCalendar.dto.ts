import { PartialType } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Matches } from 'class-validator';

export class CreateCalendarDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  // check if string follows the rgba format
  @IsString()
  @Matches(/^#([0-9A-F]{3}){1,2}$/i, {
    message: 'invalid rgba format',
  })
  backgroundColor: string;

  // check if string follows the rgba format
  @IsString()
  @Matches(/^#([0-9A-F]{3}){1,2}$/i, {
    message: 'invalid rgba format',
  })
  textColor: string;
}

export class UpdateCalendarDto extends PartialType(CreateCalendarDto) {}

export class QueryCalendarDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsDateString()
  start?: string;

  @IsOptional()
  @IsDateString()
  end?: string;
}
