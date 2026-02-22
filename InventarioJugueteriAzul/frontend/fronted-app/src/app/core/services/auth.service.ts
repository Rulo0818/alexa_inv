import { Injectable, signal, computed, PLATFORM_ID, inject, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  username: string;
  contrasena: string;
}

export interface UsuarioToken {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  id_rol: number;
  nombre_rol: string;
  requiere_cambio_contrasena: boolean;
  foto_url?: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  usuario?: UsuarioToken;
  requiere_cambio_contrasena?: boolean;
}

const TOKEN_KEY = 'jugueteria_token';
const USER_KEY = 'jugueteria_usuario';
const REMEMBER_KEY = 'jugueteria_remember';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private token = signal<string | null>(null);
  private usuario = signal<UsuarioToken | null>(null);

  readonly isLoggedIn = computed(() => !!this.token());
  readonly currentUser = computed(() => this.usuario());
  readonly isJefe = computed(() => (this.usuario()?.nombre_rol ?? '').toLowerCase() === 'jefe');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.hydrateFromStorage();
    }
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.hydrateFromStorage();
      }
    });
  }

  private hydrateFromStorage(): void {
    const t = this.getStoredToken();
    const u = this.getStoredUsuario();
    this.token.set(t);
    this.usuario.set(u);
  }

  private getStoredToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  }

  private getStoredUsuario(): UsuarioToken | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UsuarioToken;
    } catch {
      return null;
    }
  }

  login(body: LoginRequest, recordar: boolean): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, body)
      .pipe(
        tap((res) => {
          if (res.success && res.token && res.usuario) {
            const storage = recordar ? localStorage : sessionStorage;
            storage.setItem(TOKEN_KEY, res.token!);
            storage.setItem(USER_KEY, JSON.stringify(res.usuario));
            if (recordar) localStorage.setItem(REMEMBER_KEY, '1');
            else sessionStorage.setItem(REMEMBER_KEY, '1');
            this.token.set(res.token);
            this.usuario.set(res.usuario);
          }
        }),
        catchError(() => of({ success: false, message: 'Error de conexión' }))
      );
  }

  logout(): void {
    this.token.set(null);
    this.usuario.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(REMEMBER_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.token();
  }
}
