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
  type?: BoardAccessType = BoardAccess.VIEW;
  userId: string;
}

export class DeleteMembersRequest {
  userId: string;
}
