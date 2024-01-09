import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Calendar {
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

  @ApiProperty({ type: Boolean })
  hasStatus: boolean;

  @ApiProperty({ type: String })
  backgroundColor: string;

  @ApiProperty({ type: String })
  textColor: string;
}
