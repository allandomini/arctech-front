import { Instituicao } from './instituicao.model';

export interface Conta {
  id?: number;
  data: Date;
  descricao: string;
  valor: number;
  tipo: TipoConta;
  instituicao: Instituicao;
  dataCriacao?: Date;
  dataModificacao?: Date;
  criadoPor?: string;
  modificadoPor?: string;
}

export enum TipoConta {
  RECEITA = 'RECEITA',
  DESPESA = 'DESPESA',
  TRANSFERENCIA = 'TRANSFERENCIA'
} 