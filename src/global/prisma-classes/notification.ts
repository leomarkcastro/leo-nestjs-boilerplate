import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Notification {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  type: string;

  @ApiProperty({ type: String })
  title: string;

  @ApiPropertyOptional({ type: String })
  content?: string;
}
