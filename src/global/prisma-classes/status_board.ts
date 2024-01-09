import { ApiProperty } from '@nestjs/swagger';

export class StatusBoard {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  color: string;

  @ApiProperty({ type: Number })
  index: number;
}
