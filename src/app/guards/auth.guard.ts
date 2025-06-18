import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private keycloak: Keycloak) {}

  canActivate(): boolean {
    if (this.keycloak.authenticated) {
      return true;
    } else {
      this.keycloak.login();
      return false;
    }
  }
} 