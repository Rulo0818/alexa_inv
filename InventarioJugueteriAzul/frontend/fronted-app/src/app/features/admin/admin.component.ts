import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  usuario = computed(() => this.auth.currentUser());
  menu_abierto = signal(false);

  constructor(private auth: AuthService) {}

  toggleMenu(): void {
    this.menu_abierto.update(open => !open);
  }

  cerrarMenu(): void {
    this.menu_abierto.set(false);
  }

  fotoUsuario(): string | null {
    const u = this.usuario();
    if (!u?.foto_url) return null;
    return `${environment.apiUrl}/uploads/${u.foto_url}`;
  }

  logout(): void {
    this.auth.logout();
  }

  iniciales(): string {
    const u = this.usuario();
    if (!u) return '?';
    const n = (u.nombre?.trim() || '')[0] || '';
    const a = (u.apellido?.trim() || '')[0] || '';
    return (n + a).toUpperCase() || u.username?.[0]?.toUpperCase() || '?';
  }
}
