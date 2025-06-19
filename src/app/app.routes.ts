import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'contas',
    loadComponent: () => import('./components/contas/contas').then(m => m.ContasComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'extrato',
    loadComponent: () => import('./components/extrato/extrato').then(m => m.ExtratoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'tarefas',
    loadComponent: () => import('./components/task-groups/task-groups').then(m => m.TaskGroupsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'tarefas/grupos/:id',
    loadComponent: () => import('./components/task-group-detail/task-group-detail').then(m => m.TaskGroupDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/configuracoes',
    loadComponent: () => import('./components/admin-config/admin-config').then(m => m.AdminConfigComponent),
    canActivate: [AuthGuard]
    // Adicione um guard específico para admin se necessário
  }
];
