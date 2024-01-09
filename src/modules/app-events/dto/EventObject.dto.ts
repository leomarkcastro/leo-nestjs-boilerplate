import { Calendar } from '@/global/prisma-classes/calendar';
import { Event } from '@/global/prisma-classes/event';
import { StatusBoard } from '@/global/prisma-classes/status_board';
import { Task } from '@/global/prisma-classes/task';
import { TaskOnEvent } from '@/global/prisma-classes/task_on_event';
import { ApiProperty } from '@nestjs/swagger';

export class TaskOnEventWithEvent extends TaskOnEvent {
  @ApiProperty({ type: () => Task })
  Task: Task;
}

export class EventWithTasksAndStatus extends Event {
  @ApiProperty({ isArray: true, type: () => TaskOnEventWithEvent })
  TaskOnEvent: TaskOnEventWithEvent[];

  @ApiProperty({ isArray: true, type: () => StatusBoard })
  StatusBoard: StatusBoard;

  @ApiProperty({ type: () => Calendar })
  Calendar: Calendar;
}
