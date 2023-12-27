import { List } from '@/global/prisma-classes/list';
import { Task } from '@/global/prisma-classes/task';

export class ListWithTasks extends List {
  Tasks: Task[];
}
