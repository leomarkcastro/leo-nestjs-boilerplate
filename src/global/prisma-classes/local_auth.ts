import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LocalAuth {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  userId: string;

  @ApiPropertyOptional({ type: Boolean })
  twofaEmail?: boolean;

  @ApiPropertyOptional({ type: String })
  twofaEmailSecret?: string;

  @ApiPropertyOptional({ type: Date })
  twofaEmailLastSent?: Date;

  @ApiProperty({ type: String })
  password: string;
}
