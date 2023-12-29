import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export const BoardAccess = {
  VIEW: 'VIEW',
  EDIT: 'EDIT',
  ADMIN: 'ADMIN',
};

export type BoardAccessType = (typeof BoardAccess)[keyof typeof BoardAccess];

export class ManageMembersListRequest {
  members: ManageMembersRequest[];
}

export class ManageMembersRequest {
  @IsString()
  @ApiProperty({ enum: Object.values(BoardAccess) })
  type?: BoardAccessType = BoardAccess.VIEW;
  userId: string;
}

export class DeleteMembersRequest {
  userId: string;
}
