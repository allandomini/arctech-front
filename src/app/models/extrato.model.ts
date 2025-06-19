import { Conta } from './conta.model';

export interface Extrato {
  dataInicial: Date;
  dataFinal: Date;
  totalReceitasPeriodo: number;
  totalDespesasPeriodo: number;
  saldoPeriodo: number;
  transacoes: Conta[];
} 