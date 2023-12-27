import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FileOnTask {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: String })
  type?: string;

  @ApiProperty({ type: String })
  fileId: string;

  @ApiProperty({ type: String })
  taskId: string;
}
