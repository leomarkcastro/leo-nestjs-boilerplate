import { PartialType } from '@nestjs/swagger';
import { CreateAppDepartmentDto } from './create-app-department.dto';

export class UpdateAppDepartmentDto extends PartialType(
  CreateAppDepartmentDto,
) {}
