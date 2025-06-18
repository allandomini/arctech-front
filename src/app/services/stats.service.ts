import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, forkJoin } from 'rxjs';

export interface DashboardMetrics {
  saldo: number;
  totalContas: number;
  totalGroups: number;
}

export class StatsService {
  private http = inject(HttpClient);
  private api = 'http://localhost:8081/api';           // ajuste se preciso

  loadMetrics() {
    return forkJoin({
      saldo: this.http.get<number>(`${this.api}/contas/saldo`),
      contas: this.http.get<any[]>(`${this.api}/contas`),
      groups: this.http.get<any[]>(`${this.api}/groups`)
    }).pipe(
      map(({ saldo, contas, groups }) => ({
        saldo,
        totalContas: contas.length,
        totalGroups: groups.length
      }) as DashboardMetrics)
    );
  }
} 