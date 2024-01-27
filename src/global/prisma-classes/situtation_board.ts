import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SitutationBoard {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String })
  color?: string;

  @ApiPropertyOptional({ type: String })
  bgColor?: string;

  @ApiProperty({ type: Number })
  index: number;
}
