import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskList } from '../models/task-list.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {
  private apiUrl = `${environment.apiUrl}/api/groups`;

  constructor(private http: HttpClient) {}

  createTaskList(groupId: number, taskList: { name: string }): Observable<TaskList> {
    return this.http.post<TaskList>(`${this.apiUrl}/${groupId}/lists`, taskList);
  }
} 