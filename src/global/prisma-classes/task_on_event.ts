import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TaskOnEvent {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: String })
  type?: string;

  @ApiProperty({ type: String })
  taskId: string;

  @ApiProperty({ type: String })
  eventId: string;
}
