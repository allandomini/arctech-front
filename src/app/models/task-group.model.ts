import { TaskList } from './task-list.model';

export interface TaskGroup {
  id?: number;
  name: string;
  taskLists?: TaskList[];
} 