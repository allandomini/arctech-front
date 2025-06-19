import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Instituicao } from '../models/instituicao.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstituicaoService {
  private apiUrl = `${environment.apiUrl}/api/instituicoes`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Instituicao[]> {
    return this.http.get<Instituicao[]>(this.apiUrl);
  }

  findById(id: number): Observable<Instituicao> {
    return this.http.get<Instituicao>(`${this.apiUrl}/${id}`);
  }

  create(instituicao: Instituicao): Observable<Instituicao> {
    return this.http.post<Instituicao>(this.apiUrl, instituicao);
  }

  update(id: number, instituicao: Instituicao): Observable<Instituicao> {
    return this.http.put<Instituicao>(`${this.apiUrl}/${id}`, instituicao);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 