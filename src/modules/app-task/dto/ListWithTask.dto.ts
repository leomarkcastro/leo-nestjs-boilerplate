import { Event } from '@/global/prisma-classes/event';
import { File } from '@/global/prisma-classes/file';
import { FileOnTask } from '@/global/prisma-classes/file_on_task';
import { List } from '@/global/prisma-classes/list';
import { Task } from '@/global/prisma-classes/task';
import { TaskOnEvent } from '@/global/prisma-classes/task_on_event';
import { ApiProperty } from '@nestjs/swagger';

export class TaskOnEventWithEvent extends TaskOnEvent {
  @ApiProperty({ type: () => Event })
  Event: Event;
}

export class FileOnTaskWithFile extends FileOnTask {
  @ApiProperty({ type: () => File })
  File: File;
}

export class TaskWithEvent extends Task {
  @ApiProperty({ isArray: true, type: () => TaskOnEventWithEvent })
  TaskOnEvent: TaskOnEventWithEvent[];

  @ApiProperty({ isArray: true, type: () => FileOnTaskWithFile })
  FileOnTask: FileOnTaskWithFile[];
}

export class ListWithTasks extends List {
  Tasks: TaskWithEvent[];
}
