import { Board } from '@/global/prisma-classes/board';
import { User } from '@/global/prisma-classes/user';
import { PartialType } from '@nestjs/swagger';

export class CreateBoardDto {
  name: string;
}

export class UpdateBoardDto extends PartialType(CreateBoardDto) {}

export class BoardWithUsers extends Board {
  UserOnBoard: UserOnBoardWithUser[];
}

export class UserOnBoardWithUser {
  type: string;
  userId: string;
  User: User;
}
