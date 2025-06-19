import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { App } from './app/app';
import Keycloak, { KeycloakInstance } from 'keycloak-js';
import { AuthGuard } from './app/guards/auth.guard';
import { StatsService } from './app/services/stats.service';
import { routes } from './app/app.routes';

// ——— Keycloak singleton ———
export const keycloak: KeycloakInstance = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'arctech-realm',
  clientId: 'angular-app',
});

// ——— HTTP interceptor (forma funcional) ———
const tokenInterceptor = withInterceptors([
  (req, next) => {
    const token = keycloak.token;
    console.log('=== DEBUG INTERCEPTOR ===');
    console.log('Request URL:', req.url);
    console.log('Token exists:', !!token);
    console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'null');
    
    if (token) {
      const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      console.log('Authorization header added:', cloned.headers.get('Authorization')?.substring(0, 30) + '...');
      return next(cloned);
    } else {
      console.warn('No token available for request:', req.url);
      return next(req);
    }
  },
]);

// ——— Bootstrap só depois do login ———
keycloak
  .init({ onLoad: 'login-required', checkLoginIframe: false })
  .then(async () => {
    await bootstrapApplication(App, {
      providers: [
        provideHttpClient(tokenInterceptor),
        provideRouter(routes),
        importProvidersFrom(ReactiveFormsModule),
        { provide: Keycloak, useValue: keycloak }, // injetável nos serviços/guards
        StatsService, // Provider para o StatsService
      ],
    });
  });