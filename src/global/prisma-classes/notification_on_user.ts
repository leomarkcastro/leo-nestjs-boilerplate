import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationOnUser {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: String })
  type?: string;

  @ApiProperty({ type: Boolean })
  hasRead: boolean;

  @ApiProperty({ type: String })
  notificationId: string;

  @ApiProperty({ type: String })
  userId: string;
}
