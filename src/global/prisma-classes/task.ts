import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Task {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  priority: string;

  @ApiProperty({ type: Date })
  dueDate: Date;

  @ApiPropertyOptional({ type: String })
  content?: string;

  @ApiProperty({ type: String })
  listId: string;
}
