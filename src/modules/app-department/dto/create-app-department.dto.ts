import { IsString } from 'class-validator';

export class CreateAppDepartmentDto {
  @IsString()
  name: string;
}

export class ManageMembersDto {
  @IsString({ each: true })
  members: string[];
}
