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

  @ApiPropertyOptional({ type: String })
  twofa?: string;

  @ApiPropertyOptional({ type: Date })
  lastTwoFaRequest?: Date;

  @ApiPropertyOptional({ type: Number })
  remainingLoginAttempts?: number;

  @ApiPropertyOptional({ type: Date })
  lastSuccessLogin?: Date;

  @ApiProperty({ type: String })
  password: string;
}
