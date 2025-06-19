import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Extrato } from '../models/extrato.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExtratoService {
  private apiUrl = `${environment.apiUrl}/api/extratos`;

  constructor(private http: HttpClient) {}

  getExtrato(dataInicio: Date, dataFim: Date): Observable<Extrato> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio.toISOString().split('T')[0])
      .set('dataFim', dataFim.toISOString().split('T')[0]);
    
    return this.http.get<Extrato>(this.apiUrl, { params });
  }
} 