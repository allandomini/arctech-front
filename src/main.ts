import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import Keycloak, { KeycloakInstance } from 'keycloak-js';
import { AuthGuard } from './app/guards/auth.guard';
import { StatsService } from './app/services/stats.service';

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
    return next(
      token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req
    );
  },
]);

// ——— Bootstrap só depois do login ———
keycloak
  .init({ onLoad: 'login-required', checkLoginIframe: false })
  .then(async () => {
    await bootstrapApplication(App, {
      providers: [
        provideHttpClient(tokenInterceptor),
        provideRouter([
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./app/pages/dashboard.page').then(m => m.DashboardPage),
            canActivate: [AuthGuard]
          },
          // highlight-start
          // Add the missing 'about' route configuration
          {
            path: 'about',
            loadComponent: () =>
              import('./app/pages/about/about').then(m => m.About)
          }
          // highlight-end
        ]),
        { provide: Keycloak, useValue: keycloak }, // injetável nos serviços/guards
        StatsService, // Provider para o StatsService
      ],
    });
  });