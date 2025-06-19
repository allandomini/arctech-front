import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskGroupService } from '../../services/task-group.service';
import { TaskGroup } from '../../models/task-group.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-groups',
  templateUrl: './task-groups.html',
  styleUrls: ['./task-groups.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TaskGroupsComponent implements OnInit {
  groups: TaskGroup[] = [];
  loading: boolean = true;
  showModal: boolean = false;
  groupForm!: FormGroup;

  constructor(
    private taskGroupService: TaskGroupService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.carregarGrupos();
  }

  initForm(): void {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  carregarGrupos(): void {
    this.loading = true;
    this.taskGroupService.getMyGroups().subscribe({
      next: (groups) => {
        this.groups = groups;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar grupos:', error);
        this.loading = false;
      }
    });
  }

  abrirModal(): void {
    this.groupForm.reset();
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
    this.groupForm.reset();
  }

  criarGrupo(): void {
    if (this.groupForm.valid) {
      const groupData = this.groupForm.value;
      
      this.taskGroupService.createGroup(groupData).subscribe({
        next: (newGroup) => {
          this.carregarGrupos();
          this.fecharModal();
        },
        error: (error) => {
          console.error('Erro ao criar grupo:', error);
          alert('Erro ao criar grupo. Tente novamente.');
        }
      });
    }
  }

  abrirGrupo(groupId: number): void {
    this.router.navigate(['/tarefas/grupos', groupId]);
  }

  getNumListas(group: TaskGroup): number {
    return group.taskLists?.length || 0;
  }

  getTotalTarefas(group: TaskGroup): number {
    if (!group.taskLists) return 0;
    return group.taskLists.reduce((sum, list) => sum + (list.tasks?.length || 0), 0);
  }
}
