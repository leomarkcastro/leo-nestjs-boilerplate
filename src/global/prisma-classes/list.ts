import { ApiProperty } from '@nestjs/swagger';

export class List {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  boardId: string;
}
