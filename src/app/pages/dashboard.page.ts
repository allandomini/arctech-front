import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, NgIf } from '@angular/common';
import { StatsService, DashboardMetrics } from '../services/stats.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NgIf],
  template: `
    <section class="cards" *ngIf="data">
      <article class="card primary">
        <h3>Saldo atual</h3>
        <p class="value">{{ data.saldo | currency:'BRL':'symbol':'1.2-2' }}</p>
      </article>

      <article class="card success">
        <h3>Total de transações</h3>
        <p class="value">{{ data.totalContas }}</p>
      </article>

      <article class="card warning">
        <h3>Grupos de tarefa</h3>
        <p class="value">{{ data.totalGroups }}</p>
      </article>
    </section>
  `,
  styles: [`
    .cards     { display:flex; gap:1.5rem; margin:2rem 0; flex-wrap:wrap; }
    .card      { flex:1 1 220px; padding:1.5rem; border-radius:10px;
                 box-shadow:0 2px 10px rgba(0,0,0,0.05); color:#fff; }
    .primary   { background:#007bff }
    .success   { background:#28a745 }
    .warning   { background:#ff9800 }
    .value     { font-size:2rem; font-weight:600; margin:0.5rem 0 0 }
  `]
})
export class DashboardPage implements OnInit {
  data?: DashboardMetrics;
  constructor(private stats: StatsService) {}
  ngOnInit() { this.stats.loadMetrics().subscribe((d: DashboardMetrics) => this.data = d); }
} 