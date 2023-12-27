import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class User {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiPropertyOptional({ type: String })
  name?: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: String })
  roleId?: string;

  @ApiPropertyOptional({ type: String })
  firstName?: string;

  @ApiPropertyOptional({ type: String })
  lastName?: string;

  @ApiPropertyOptional({ type: String })
  description?: string;

  @ApiPropertyOptional({ type: String })
  phone?: string;

  @ApiPropertyOptional({ type: String })
  avatar?: string;

  @ApiPropertyOptional({ type: String })
  address?: string;

  @ApiPropertyOptional({ type: String })
  departmentId?: string;

  @ApiPropertyOptional({ type: String })
  positionId?: string;
}
