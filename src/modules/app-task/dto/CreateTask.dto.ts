import { PartialType } from '@nestjs/swagger';

export class CreateTaskDto {
  listId: string;
  title: string;
  priority: string;
  dueDate: Date;
  content?: string;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}

export class ModifyTaskFileListDto {
  files: ModifyTaskFileDto[];
}

export class ModifyTaskFileDto {
  taskId: string;
  fileId: string;
}
