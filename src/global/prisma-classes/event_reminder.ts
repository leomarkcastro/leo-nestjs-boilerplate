import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EventReminder {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: String })
  name?: string;

  @ApiProperty({ type: Number })
  remindDuration: number;

  @ApiProperty({ type: Date })
  remindAt: Date;

  @ApiProperty({ type: Boolean })
  done: boolean;

  @ApiProperty({ type: String })
  eventId: string;
}
