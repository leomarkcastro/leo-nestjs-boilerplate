import { ApiProperty } from '@nestjs/swagger';

export class PermissionOnRole {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  roleId: string;

  @ApiProperty({ type: String })
  permissionId: string;
}
