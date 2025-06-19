import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContaService } from '../../services/conta.service';
import { ExtratoService } from '../../services/extrato.service';
import { Conta, TipoConta } from '../../models/conta.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule]
})
export class DashboardComponent implements OnInit {
  saldoAtual: number = 0;
  contasRecentes: Conta[] = [];
  totalReceitas: number = 0;
  totalDespesas: number = 0;
  loading: boolean = true;

  constructor(
    private contaService: ContaService,
    private extratoService: ExtratoService
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    forkJoin({
      saldo: this.contaService.getSaldo(),
      contas: this.contaService.findAll()
    }).subscribe({
      next: (result) => {
        this.saldoAtual = result.saldo;
        this.contasRecentes = result.contas.slice(0, 5); // Últimas 5 transações
        this.calcularTotais(result.contas);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
        this.loading = false;
      }
    });
  }

  calcularTotais(contas: Conta[]): void {
    this.totalReceitas = contas
      .filter(c => c.tipo === TipoConta.RECEITA)
      .reduce((sum, c) => sum + c.valor, 0);
    
    this.totalDespesas = contas
      .filter(c => c.tipo === TipoConta.DESPESA)
      .reduce((sum, c) => sum + c.valor, 0);
  }

  getClasseTipo(tipo: TipoConta): string {
    switch(tipo) {
      case TipoConta.RECEITA:
        return 'text-green-600';
      case TipoConta.DESPESA:
        return 'text-red-600';
      case TipoConta.TRANSFERENCIA:
        return 'text-blue-600';
      default:
        return '';
    }
  }
} 