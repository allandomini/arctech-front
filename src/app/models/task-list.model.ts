import { Task } from './task.model';

export interface TaskList {
  id?: number;
  name: string;
  tasks?: Task[];
} 