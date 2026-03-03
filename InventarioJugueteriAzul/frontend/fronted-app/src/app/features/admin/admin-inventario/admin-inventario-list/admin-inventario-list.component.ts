import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  id_categoria: number;
  precio_de_compra: number;
  precio_de_venta: number;
  stock: number;
  stock_minimo: number;
  estado: 'bueno' | 'malo';
  descuento_porcentaje: number;
  nombre_categoria: string;
  emoji_categoria?: string;
}

interface Categoria {
  id: number;
  nombre: string;
  emoji?: string;
}

@Component({
  selector: 'app-admin-inventario-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-inventario-list.component.html',
  styleUrl: './admin-inventario-list.component.css',
})
export class AdminInventarioListComponent implements OnInit {
  productos = signal<Producto[]>([]);
  categorias = signal<Categoria[]>([]);
  searchText = signal('');
  categoriaFiltro = signal<number | null>(null);
  loading = signal(true);
  mensaje = signal<{ tipo: 'ok' | 'error'; text: string } | null>(null);

  constructor(private api: ApiService, private router: Router) {}

  editar(p: Producto): void {
    this.router.navigate(['/admin/inventario/editar-inventario', p.id], {
      state: { producto: p }
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos();
  }

  private cargarCategorias(): void {
    this.api.get<{ categorias: Categoria[] }>('/api/categorias').subscribe({
      next: (res: any) => {
        const cats = Array.isArray(res) ? res : (res.categorias ?? []);
        this.categorias.set(cats);
      },
      error: () => {},
    });
  }

  cargarProductos(): void {
    this.loading.set(true);
    const params: Record<string, string> = { activo: 'true' };
    const cat = this.categoriaFiltro();
    const search = this.searchText();
    if (cat != null) params['categoria'] = String(cat);
    if (search?.trim()) params['search'] = search.trim();

    this.api.get<{ productos: Producto[] }>('/api/productos', params).subscribe({
      next: (res: any) => {
        const prods = Array.isArray(res) ? res : (res.productos ?? []);
        this.productos.set(prods);
      },
      error: () => this.productos.set([]),
    });
    setTimeout(() => this.loading.set(false), 200);
  }

  onSearch(): void {
    this.cargarProductos();
  }

  onCategoriaChange(id: string): void {
    this.categoriaFiltro.set(id === '' ? null : parseInt(id, 10));
    this.cargarProductos();
  }

  formatMoney(n: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
  }

  eliminar(p: Producto): void {
    if (!confirm(`¿Eliminar "${p.nombre}" del inventario?`)) return;
    this.mensaje.set(null);
    this.api.delete<{ success: boolean; message?: string }>(`/api/productos/${p.id}`).subscribe({
      next: () => {
        this.mensaje.set({ tipo: 'ok', text: 'Producto eliminado' });
        this.cargarProductos();
      },
      error: (e: any) =>
        this.mensaje.set({ tipo: 'error', text: e?.error?.message ?? 'Error al eliminar' }),
    });
  }
}
