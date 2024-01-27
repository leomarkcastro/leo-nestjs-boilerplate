import { ApiProperty } from '@nestjs/swagger';

export class GroupOnUser {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  groupId: string;

  @ApiProperty({ type: String })
  userId: string;
}
