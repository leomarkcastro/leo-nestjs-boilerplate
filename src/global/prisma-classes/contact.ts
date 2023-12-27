import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Contact {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  firstName: string;

  @ApiPropertyOptional({ type: String })
  lastName?: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiPropertyOptional({ type: String })
  phone?: string;

  @ApiPropertyOptional({ type: String })
  address?: string;

  @ApiPropertyOptional({ type: String })
  company?: string;

  @ApiPropertyOptional({ type: String })
  jobTitle?: string;

  @ApiPropertyOptional({ type: String })
  note?: string;

  @ApiPropertyOptional({ type: String })
  avatar?: string;
}
