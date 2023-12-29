import { Position } from '@/global/prisma-classes/position';
import { UserWithRelation } from '@/global/prisma-classes/user_with_relation';

export class PositionWithUsers extends Position {
  User: UserWithRelation[];
}
