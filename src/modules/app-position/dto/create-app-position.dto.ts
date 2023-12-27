import { IsString } from 'class-validator';

export class CreateAppPositionDto {
  @IsString()
  name: string;
}

export class ManageMembersDto {
  @IsString({ each: true })
  members: string[];
}
