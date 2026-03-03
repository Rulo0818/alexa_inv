import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page">
      <h1>¿Olvidaste tu contraseña?</h1>
      <p>Esta función estará disponible próximamente. Contacta al administrador.</p>
      <a routerLink="/login">Volver al inicio de sesión</a>
    </div>
  `,
  styles: [
    `
      :host { display: block; height: 100%; overflow: hidden; }
      .page {
        height: 100%;
        min-height: 100vh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        font-family: 'Segoe UI', system-ui, sans-serif;
      }
      h1 { margin-bottom: 0.5rem; }
      p { color: #666; margin-bottom: 1rem; }
      a { color: #2563eb; }
    `,
  ],
})
export class RecuperarComponent {}
