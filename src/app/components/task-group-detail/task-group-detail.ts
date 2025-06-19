import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TaskGroupService } from '../../services/task-group.service';
import { TaskListService } from '../../services/task-list.service';
import { TaskService } from '../../services/task.service';
import { TaskGroup } from '../../models/task-group.model';
import { TaskList } from '../../models/task-list.model';
import { Task, TaskStatus } from '../../models/task.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-task-group-detail',
  templateUrl: './task-group-detail.html',
  styleUrls: ['./task-group-detail.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TaskGroupDetailComponent implements OnInit {
  groupId!: number;
  group: TaskGroup | null = null;
  loading: boolean = true;
  showListModal: boolean = false;
  showTaskModal: boolean = false;
  selectedListId: number | null = null;
  listForm!: FormGroup;
  taskForm!: FormGroup;
  TaskStatus = TaskStatus;

  constructor(
    private route: ActivatedRoute,
    private taskGroupService: TaskGroupService,
    private taskListService: TaskListService,
    private taskService: TaskService,
    private fb: FormBuilder
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarDados();
  }

  initForms(): void {
    this.listForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['']
    });
  }

  carregarDados(): void {
    this.loading = true;
    this.taskGroupService.getMyGroups().subscribe({
      next: (groups) => {
        this.group = groups.find(g => g.id === this.groupId) || null;
        if (this.group && this.group.taskLists) {
          // Carregar tarefas para cada lista
          const taskRequests = this.group.taskLists.map(list => 
            this.taskService.getTasksFromList(list.id!)
          );
          
          if (taskRequests.length > 0) {
            forkJoin(taskRequests).subscribe({
              next: (tasksArrays) => {
                this.group!.taskLists!.forEach((list, index) => {
                  list.tasks = tasksArrays[index];
                });
                this.loading = false;
              }
            });
          } else {
            this.loading = false;
          }
        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar grupo:', error);
        this.loading = false;
      }
    });
  }

  abrirModalLista(): void {
    this.listForm.reset();
    this.showListModal = true;
  }

  fecharModalLista(): void {
    this.showListModal = false;
    this.listForm.reset();
  }

  criarLista(): void {
    if (this.listForm.valid) {
      const listData = this.listForm.value;
      
      this.taskListService.createTaskList(this.groupId, listData).subscribe({
        next: () => {
          this.carregarDados();
          this.fecharModalLista();
        },
        error: (error) => {
          console.error('Erro ao criar lista:', error);
          alert('Erro ao criar lista. Tente novamente.');
        }
      });
    }
  }

  abrirModalTarefa(listId: number): void {
    this.selectedListId = listId;
    this.taskForm.reset();
    this.showTaskModal = true;
  }

  fecharModalTarefa(): void {
    this.showTaskModal = false;
    this.selectedListId = null;
    this.taskForm.reset();
  }

  criarTarefa(): void {
    if (this.taskForm.valid && this.selectedListId) {
      const taskData = this.taskForm.value;
      
      this.taskService.createTask(this.selectedListId, taskData).subscribe({
        next: () => {
          this.carregarDados();
          this.fecharModalTarefa();
        },
        error: (error) => {
          console.error('Erro ao criar tarefa:', error);
          alert('Erro ao criar tarefa. Tente novamente.');
        }
      });
    }
  }

  toggleTaskStatus(listId: number, task: Task): void {
    const newStatus = task.status === TaskStatus.PENDING ? TaskStatus.DONE : TaskStatus.PENDING;
    
    this.taskService.updateTask(listId, task.id!, { status: newStatus }).subscribe({
      next: () => {
        task.status = newStatus;
      },
      error: (error) => {
        console.error('Erro ao atualizar status:', error);
      }
    });
  }

  toggleTaskFavorite(listId: number, task: Task): void {
    this.taskService.updateTask(listId, task.id!, { favorited: !task.favorited }).subscribe({
      next: () => {
        task.favorited = !task.favorited;
        this.carregarDados(); // Recarregar para reordenar
      },
      error: (error) => {
        console.error('Erro ao favoritar tarefa:', error);
      }
    });
  }

  getTasksCount(list: TaskList, status?: TaskStatus): number {
    if (!list.tasks) return 0;
    if (status === undefined) return list.tasks.length;
    return list.tasks.filter(t => t.status === status).length;
  }
}
