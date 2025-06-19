import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-extrato',
  templateUrl: './extrato.html',
  styleUrls: ['./extrato.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ExtratoComponent implements OnInit {
  loading: boolean = false;
  extrato: any = null;
  filtroForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    // Inicialização do componente
  }

  initForm(): void {
    this.filtroForm = this.fb.group({
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required]
    });
  }

  gerarExtrato(): void {
    if (this.filtroForm.valid) {
      this.loading = true;
      // Implementar lógica para gerar extrato
      console.log('Gerando extrato...', this.filtroForm.value);
      this.loading = false;
    }
  }

  exportarCSV(): void {
    console.log('Exportando CSV...');
  }

  imprimirExtrato(): void {
    window.print();
  }

  getClasseTipo(tipo: string): string {
    switch(tipo) {
      case 'RECEITA':
        return 'text-green-600';
      case 'DESPESA':
        return 'text-red-600';
      case 'TRANSFERENCIA':
        return 'text-blue-600';
      default:
        return '';
    }
  }

  formatarValor(valor: number, tipo: string): string {
    const sinal = tipo === 'DESPESA' ? '-' : '+';
    return `${sinal} R$ ${valor.toFixed(2).replace('.', ',')}`;
  }
}
