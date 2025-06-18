import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected title = 'artech-front';
  protected isLoggedIn = false;
  protected username = '';

  constructor(private keycloak: Keycloak) {}

  ngOnInit() {
    this.isLoggedIn = this.keycloak.authenticated || false;
    if (this.isLoggedIn) {
      this.username = this.keycloak.tokenParsed?.['preferred_username'] || '';
      console.log('Logado!');
    }
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout();
  }
}
