import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private keycloak = inject(Keycloak);

  canActivate(): boolean {
    if (this.keycloak.authenticated) {
      return true;
    } else {
      this.keycloak.login();
      return false;
    }
  }
} 