import { Group } from '@/global/prisma-classes/group';
import { GroupOnUser } from '@/global/prisma-classes/group_on_user';
import { User } from '@/global/prisma-classes/user';
import { PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ManageMembersDto {
  @IsString({ each: true })
  members: string[];
}

export class CreateAppGroupDto {
  @IsString()
  name: string;
}

export class UpdateAppGroupDto extends PartialType(CreateAppGroupDto) {}

export class GroupOnUserWithUsers extends GroupOnUser {
  User: User;
}

export class GroupWithUsers extends Group {
  GroupOnUser: GroupOnUserWithUsers[];
}
