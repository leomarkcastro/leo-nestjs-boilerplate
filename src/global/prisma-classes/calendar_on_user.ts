import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CalendarOnUser {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: String })
  type?: string;

  @ApiProperty({ type: String })
  calendarId: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiPropertyOptional({ type: Boolean })
  IsPublic?: boolean;
}
