# Keycloak Integration Setup

Este projeto está configurado com autenticação Keycloak usando a nova estrutura funcional do Angular.

## Configuração

### 1. Configuração Principal (`src/main.ts`)
```typescript
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
        provideRouter([...]),
        { provide: Keycloak, useValue: keycloak },
      ],
    });
  });
```

### 2. Auth Guard (`src/app/guards/auth.guard.ts`)
```typescript
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
```

### 3. Componente Principal (`src/app/app.ts`)
```typescript
export class App implements OnInit {
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
```

## Como Usar

### Injeção do Keycloak
```typescript
import Keycloak from 'keycloak-js';

constructor(private keycloak: Keycloak) {}

// Verificar se está logado
if (this.keycloak.authenticated) {
  // Usuário está autenticado
}

// Obter token para requisições
const token = this.keycloak.token;
```

### Proteção de Rotas
```typescript
{
  path: '',
  loadComponent: () => import('./app/pages/home.page').then((m) => m.HomePage),
  canActivate: [AuthGuard],
}
```

### HTTP Interceptor Automático
O interceptor HTTP é configurado automaticamente para incluir o token Bearer em todas as requisições HTTP.

## Configuração do Keycloak Server

Certifique-se de que seu servidor Keycloak está configurado com:

1. **Realm**: `arctech-realm`
2. **Client**: `angular-app`
3. **Client Type**: `public`
4. **Valid Redirect URIs**: `http://localhost:4200/*`
5. **Web Origins**: `http://localhost:4200`

## Executando o Projeto

1. Certifique-se de que o Keycloak está rodando em `http://localhost:8080`
2. Execute `npm start` para iniciar o Angular
3. Acesse `http://localhost:4200`
4. Você será redirecionado para o login do Keycloak
5. Após o login, será redirecionado de volta para a aplicação

## Estrutura de Arquivos

- `src/main.ts` - Configuração principal do Keycloak e bootstrap da aplicação
- `src/app/guards/auth.guard.ts` - Guard para proteção de rotas
- `src/app/pages/home.page.ts` - Página inicial protegida
- `src/app/app.ts` - Componente principal com UI de autenticação
- `src/app/app.html` - Template com router-outlet e UI de autenticação 