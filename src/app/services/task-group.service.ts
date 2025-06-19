import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskGroup } from '../models/task-group.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskGroupService {
  private apiUrl = `${environment.apiUrl}/api/groups`;

  constructor(private http: HttpClient) {}

  createGroup(group: { name: string }): Observable<TaskGroup> {
    return this.http.post<TaskGroup>(this.apiUrl, group);
  }

  getMyGroups(): Observable<TaskGroup[]> {
    return this.http.get<TaskGroup[]>(this.apiUrl);
  }
} 