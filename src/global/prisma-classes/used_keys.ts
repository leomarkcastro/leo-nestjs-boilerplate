import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UsedKeys {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  key: string;

  @ApiPropertyOptional({ type: String })
  type?: string;
}
