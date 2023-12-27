import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserOnBoard {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: String })
  type?: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  boardId: string;
}
