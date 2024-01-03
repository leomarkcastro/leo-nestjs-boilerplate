export class TaskOnEvent {
  taskId: string;
  eventId: string;
}

export class UpdateTaskOnEventDto {
  toBind: TaskOnEvent[];
}
