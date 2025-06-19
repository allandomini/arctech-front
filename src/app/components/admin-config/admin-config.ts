import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstituicaoService } from '../../services/instituicao.service';
import { Instituicao } from '../../models/instituicao.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-config',
  templateUrl: './admin-config.html',
  styleUrls: ['./admin-config.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AdminConfigComponent implements OnInit {
  instituicoes: Instituicao[] = [];
  loading: boolean = true;
  activeTab: 'instituicoes' | 'categorias' = 'instituicoes';
  
  showInstituicaoModal: boolean = false;
  showCategoriaModal: boolean = false;
  
  instituicaoForm!: FormGroup;
  categoriaForm!: FormGroup;
  
  editingInstituicaoId: number | null = null;
  editingCategoriaId: number | null = null;

  constructor(
    private instituicaoService: InstituicaoService,
    private fb: FormBuilder
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  initForms(): void {
    this.instituicaoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.categoriaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  carregarDados(): void {
    this.loading = true;
    this.instituicaoService.findAll().toPromise().then((instituicoes) => {
      this.instituicoes = instituicoes || [];
      this.loading = false;
    }).catch(error => {
      console.error('Erro ao carregar dados:', error);
      this.loading = false;
    });
  }

  // Métodos para Instituições
  abrirModalInstituicao(instituicao?: Instituicao): void {
    if (instituicao) {
      this.editingInstituicaoId = instituicao.id!;
      this.instituicaoForm.patchValue({ nome: instituicao.nome });
    } else {
      this.editingInstituicaoId = null;
      this.instituicaoForm.reset();
    }
    this.showInstituicaoModal = true;
  }

  fecharModalInstituicao(): void {
    this.showInstituicaoModal = false;
    this.editingInstituicaoId = null;
    this.instituicaoForm.reset();
  }

  salvarInstituicao(): void {
    if (this.instituicaoForm.valid) {
      const instituicao: Instituicao = this.instituicaoForm.value;

      const operation = this.editingInstituicaoId
        ? this.instituicaoService.update(this.editingInstituicaoId, instituicao)
        : this.instituicaoService.create(instituicao);

      operation.subscribe({
        next: () => {
          this.carregarDados();
          this.fecharModalInstituicao();
        },
        error: (error) => {
          console.error('Erro ao salvar instituição:', error);
          alert('Erro ao salvar instituição. Verifique se você tem permissões de administrador.');
        }
      });
    }
  }

  excluirInstituicao(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta instituição?')) {
      this.instituicaoService.delete(id).subscribe({
        next: () => {
          this.carregarDados();
        },
        error: (error) => {
          console.error('Erro ao excluir instituição:', error);
          alert('Erro ao excluir instituição. Pode haver transações vinculadas.');
        }
      });
    }
  }

  // Métodos para Categorias
  abrirModalCategoria(categoria?: Instituicao): void {
    if (categoria) {
      this.editingCategoriaId = categoria.id!;
      this.categoriaForm.patchValue({ nome: categoria.nome });
    } else {
      this.editingCategoriaId = null;
      this.categoriaForm.reset();
    }
    this.showCategoriaModal = true;
  }

  fecharModalCategoria(): void {
    this.showCategoriaModal = false;
    this.editingCategoriaId = null;
    this.categoriaForm.reset();
  }

  salvarCategoria(): void {
    if (this.categoriaForm.valid) {
      const categoria: Instituicao = this.categoriaForm.value;

      const operation = this.editingCategoriaId
        ? this.instituicaoService.update(this.editingCategoriaId, categoria)
        : this.instituicaoService.create(categoria);

      operation.subscribe({
        next: () => {
          this.carregarDados();
          this.fecharModalCategoria();
        },
        error: (error) => {
          console.error('Erro ao salvar categoria:', error);
          alert('Erro ao salvar categoria. Verifique se você tem permissões de administrador.');
        }
      });
    }
  }

  excluirCategoria(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      this.instituicaoService.delete(id).subscribe({
        next: () => {
          this.carregarDados();
        },
        error: (error) => {
          console.error('Erro ao excluir categoria:', error);
          alert('Erro ao excluir categoria. Pode haver transações vinculadas.');
        }
      });
    }
  }
}
