import { ApiProperty } from '@nestjs/swagger';

export class File {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  url: string;

  @ApiProperty({ type: String })
  type: string;

  @ApiProperty({ type: Number })
  size: number;
}
