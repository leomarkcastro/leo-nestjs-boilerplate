import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserFlags {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String })
  data?: string;

  @ApiProperty({ type: String })
  userId: string;
}
