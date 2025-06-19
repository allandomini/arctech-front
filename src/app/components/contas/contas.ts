import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ContaService } from '../../services/conta.service';
import { InstituicaoService } from '../../services/instituicao.service';
import { Conta, TipoConta } from '../../models/conta.model';
import { Instituicao } from '../../models/instituicao.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contas',
  templateUrl: './contas.html',
  styleUrls: ['./contas.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ContasComponent implements OnInit {
  contas: Conta[] = [];
  instituicoes: Instituicao[] = [];
  loading: boolean = true;
  showModal: boolean = false;
  contaForm!: FormGroup;
  editingId: number | null = null;
  tiposConta = Object.values(TipoConta);

  constructor(
    private contaService: ContaService,
    private instituicaoService: InstituicaoService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  initForm(): void {
    this.contaForm = this.fb.group({
      data: [new Date(), Validators.required],
      descricao: ['', Validators.required],
      valor: [0, [Validators.required, Validators.min(0.01)]],
      tipo: [TipoConta.DESPESA, Validators.required],
      instituicao: [null, Validators.required]
    });
  }

  carregarDados(): void {
    this.loading = true;
    Promise.all([
      this.contaService.findAll().toPromise(),
      this.instituicaoService.findAll().toPromise()
    ]).then(([contas, instituicoes]) => {
      this.contas = contas || [];
      this.instituicoes = instituicoes || [];
      this.loading = false;
    }).catch(error => {
      console.error('Erro ao carregar dados:', error);
      this.loading = false;
    });
  }

  abrirModal(conta?: Conta): void {
    if (conta) {
      this.editingId = conta.id!;
      this.contaForm.patchValue({
        data: new Date(conta.data),
        descricao: conta.descricao,
        valor: conta.valor,
        tipo: conta.tipo,
        instituicao: conta.instituicao.id
      });
    } else {
      this.editingId = null;
      this.contaForm.reset({
        data: new Date(),
        tipo: TipoConta.DESPESA
      });
    }
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
    this.editingId = null;
    this.contaForm.reset();
  }

  salvarConta(): void {
    if (this.contaForm.valid) {
      const formValue = this.contaForm.value;
      const dataFormatada = formValue.data instanceof Date
        ? formValue.data.toISOString().split('T')[0]
        : formValue.data; // já é string do input
      const conta: Conta = {
        ...formValue,
        data: dataFormatada,
        valor: Number(formValue.valor),
        instituicao: { id: Number(formValue.instituicao) }
      };
  
      console.log('Form value:', formValue);
      console.log('Payload enviado:', JSON.stringify(conta, null, 2));
  
      const operation = this.editingId
        ? this.contaService.update(this.editingId, conta)
        : this.contaService.create(conta);
  
      operation.subscribe({
        next: (response) => {
          console.log('Success response:', response);
          this.carregarDados();
          this.fecharModal();
        },
        error: (error) => {
          console.error('Erro ao salvar conta:', error);
          console.error('Error details:', error.error);
          alert('Erro ao salvar conta. Tente novamente.');
        }
      });
    } else {
      console.log('Form is invalid:', this.contaForm.errors);
      console.log('Form value:', this.contaForm.value);
    }
  }
  excluirConta(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.contaService.delete(id).subscribe({
        next: () => {
          this.carregarDados();
        },
        error: (error) => {
          console.error('Erro ao excluir conta:', error);
          alert('Erro ao excluir conta. Tente novamente.');
        }
      });
    }
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

  formatarValor(valor: number, tipo: TipoConta): string {
    const sinal = tipo === TipoConta.DESPESA ? '-' : '+';
    return `${sinal} R$ ${valor.toFixed(2).replace('.', ',')}`;
  }
}
