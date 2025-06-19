import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskStatus } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/api/lists`;

  constructor(private http: HttpClient) {}

  createTask(listId: number, task: {
    title: string;
    description?: string;
    dueDate?: Date;
  }): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/${listId}/tasks`, task);
  }

  getTasksFromList(listId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/${listId}/tasks`);
  }

  updateTask(listId: number, taskId: number, update: {
    status?: TaskStatus;
    favorited?: boolean;
  }): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${listId}/tasks/${taskId}`, update);
  }
} 