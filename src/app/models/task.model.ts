export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: TaskStatus;
  favorited: boolean;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  lastModifiedBy?: string;
}

export enum TaskStatus {
  PENDING = 'PENDING',
  DONE = 'DONE'
} 