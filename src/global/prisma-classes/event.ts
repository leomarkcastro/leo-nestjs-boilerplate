import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Event {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  title: string;

  @ApiPropertyOptional({ type: String })
  description?: string;

  @ApiPropertyOptional({ type: String })
  backgroundColor?: string;

  @ApiPropertyOptional({ type: String })
  textColor?: string;

  @ApiPropertyOptional({ type: Date })
  start?: Date;

  @ApiPropertyOptional({ type: Date })
  end?: Date;

  @ApiProperty({ type: Boolean })
  allDay: boolean;

  @ApiProperty({ type: String })
  calendarId: string;

  @ApiPropertyOptional({ type: String })
  statusBoardId?: string;

  @ApiPropertyOptional({ type: Number })
  statusBoardIndex?: number;
}
