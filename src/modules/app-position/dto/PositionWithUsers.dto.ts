import { Position } from '@/global/prisma-classes/position';
import { User } from '@/global/prisma-classes/user';

export class PositionWithUsers extends Position {
  User: User[];
}
