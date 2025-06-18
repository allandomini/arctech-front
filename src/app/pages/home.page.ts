import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px;">
      <h1>Bem-vindo à página inicial!</h1>
      <p>Você está autenticado com Keycloak.</p>
    </div>
  `
})
export class HomePage {} 