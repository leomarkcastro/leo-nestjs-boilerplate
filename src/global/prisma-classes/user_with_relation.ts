import { ApiPropertyOptional } from '@nestjs/swagger';
import { Department } from './department';
import { Position } from './position';
import { Role } from './role';
import { User } from './user';

export class UserWithRelation extends User {
  @ApiPropertyOptional({ type: Department })
  Department?: Department;

  @ApiPropertyOptional({ type: Position })
  Position?: Position;

  @ApiPropertyOptional({ type: Role })
  Role?: Role;
}
