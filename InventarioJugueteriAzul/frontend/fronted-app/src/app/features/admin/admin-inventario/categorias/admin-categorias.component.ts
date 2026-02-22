import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

interface Categoria {
  id: number;
  nombre: string;
  emoji?: string;
}

const EMOJIS = ['🎀', '🚗', '⚽', '📦', '🎨', '🧩', '🪀', '🦷', '🎭', '🚂', '👶', '🎮', '📚', '✏️', '🎪'];

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-categorias.component.html',
  styleUrl: './admin-categorias.component.css',
})
export class AdminCategoriasComponent implements OnInit {
  categorias = signal<Categoria[]>([]);
  emojiSeleccionado = signal('📦');
  nombreCategoria = signal('');
  loading = signal(true);
  guardando = signal(false);
  mensaje = signal<{ tipo: 'ok' | 'error'; text: string } | null>(null);
  editandoId = signal<number | null>(null);
  emojis = EMOJIS;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.loading.set(true);
    this.api.get<{ categorias: Categoria[] }>('/api/categorias').subscribe({
      next: (res: any) => {
        const cats = Array.isArray(res) ? res : (res.categorias ?? []);
        this.categorias.set(cats);
      },
      error: () => this.categorias.set([]),
    });
    setTimeout(() => this.loading.set(false), 200);
  }

  seleccionarEmoji(emoji: string): void {
    this.emojiSeleccionado.set(emoji);
  }

  agregar(): void {
    const nombre = this.nombreCategoria().trim();
    if (!nombre) {
      this.mensaje.set({ tipo: 'error', text: 'Escribe el nombre de la categoría' });
      return;
    }
    this.mensaje.set(null);
    this.guardando.set(true);
    const id = this.editandoId();
    if (id != null) {
      this.api
        .put<{ success: boolean; message?: string }>(`/api/categorias/${id}`, {
          nombre,
          emoji: this.emojiSeleccionado(),
        })
        .subscribe({
          next: (res) => {
            this.guardando.set(false);
            if (res.success) {
              this.mensaje.set({ tipo: 'ok', text: 'Categoría actualizada' });
              this.editandoId.set(null);
              this.nombreCategoria.set('');
              this.cargarCategorias();
            } else {
              this.mensaje.set({ tipo: 'error', text: res.message ?? 'Error' });
            }
          },
          error: (e: any) => {
            this.guardando.set(false);
            this.mensaje.set({ tipo: 'error', text: e?.error?.message ?? 'Error al guardar' });
          },
        });
    } else {
      this.api
        .post<{ success: boolean; message?: string }>('/api/categorias', {
          nombre,
          emoji: this.emojiSeleccionado(),
        })
        .subscribe({
          next: (res) => {
            this.guardando.set(false);
            if (res.success) {
              this.mensaje.set({ tipo: 'ok', text: 'Categoría agregada' });
              this.nombreCategoria.set('');
              this.cargarCategorias();
            } else {
              this.mensaje.set({ tipo: 'error', text: res.message ?? 'Error' });
            }
          },
          error: (e: any) => {
            this.guardando.set(false);
            this.mensaje.set({ tipo: 'error', text: e?.error?.message ?? 'Error al guardar' });
          },
        });
    }
  }

  editar(c: Categoria): void {
    this.editandoId.set(c.id);
    this.nombreCategoria.set(c.nombre);
    this.emojiSeleccionado.set(c.emoji || '📦');
  }

  cancelarEdicion(): void {
    this.editandoId.set(null);
    this.nombreCategoria.set('');
  }

  eliminar(c: Categoria): void {
    if (!confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return;
    this.mensaje.set(null);
    this.api.delete<{ success: boolean; message?: string }>(`/api/categorias/${c.id}`).subscribe({
      next: (res) => {
        if (res.success !== false) {
          this.mensaje.set({ tipo: 'ok', text: 'Categoría eliminada' });
          this.cargarCategorias();
          if (this.editandoId() === c.id) this.cancelarEdicion();
        } else {
          this.mensaje.set({ tipo: 'error', text: res.message ?? 'Error' });
        }
      },
      error: (e: any) =>
        this.mensaje.set({ tipo: 'error', text: e?.error?.message ?? 'Error al eliminar' }),
    });
  }
}
