import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export const CalendarAccess = {
  VIEW: 'VIEW',
  EDIT: 'EDIT',
  ADMIN: 'ADMIN',
};

export type BoardAccessType =
  (typeof CalendarAccess)[keyof typeof CalendarAccess];

export class ManageMembersListRequest {
  members: ManageMembersRequest[];
}

export class ManageMembersRequest {
  @IsString()
  @ApiProperty({ enum: Object.values(CalendarAccess) })
  type?: BoardAccessType = CalendarAccess.VIEW;

  @IsString()
  userId: string;
}

export class DeleteMembersRequest {
  userId: string;
}
