import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
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
  nombre_categoria?: string;
  emoji_categoria?: string;
}

interface Categoria {
  id: number;
  nombre: string;
  emoji?: string;
}

@Component({
  selector: 'app-admin-editar-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-editar-producto.component.html',
  styleUrl: './admin-editar-producto.component.css',
})
export class AdminEditarProductoComponent implements OnInit {
  id: number | null = null;
  categorias = signal<Categoria[]>([]);
  nombre = signal('');
  idCategoria = signal<number | null>(null);
  precioCompra = signal<number>(0);
  precioVenta = signal<number>(0);
  stock = signal<number>(0);
  stockMinimo = signal<number>(0);
  estado = signal<'bueno' | 'malo'>('bueno');
  descuento = signal<number>(0);
  codigo = signal('');
  loadingData = signal(true);
  guardando = signal(false);
  mensaje = signal<{ tipo: 'ok' | 'error'; text: string } | null>(null);
  notFound = signal(false);

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? parseInt(idParam, 10) : null;
    if (!this.id || isNaN(this.id)) {
      this.mensaje.set({ tipo: 'error', text: 'ID inválido' });
      this.notFound.set(true);
      this.loadingData.set(false);
      return;
    }
    this.cargarCategorias();
    const state = history.state?.producto as Producto | undefined;
    if (state && state.id === this.id) {
      this.aplicarProducto(state);
      this.loadingData.set(false);
    }
    this.cargarProducto();
  }

  private aplicarProducto(p: Producto): void {
    this.nombre.set(p.nombre ?? '');
    this.idCategoria.set(p.id_categoria ?? null);
    this.precioCompra.set(p.precio_de_compra ?? 0);
    this.precioVenta.set(p.precio_de_venta ?? 0);
    this.stock.set(p.stock ?? 0);
    this.stockMinimo.set(p.stock_minimo ?? 0);
    this.estado.set((p.estado as 'bueno' | 'malo') ?? 'bueno');
    this.descuento.set(p.descuento_porcentaje ?? 0);
    this.codigo.set(p.codigo ?? '');
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

  private cargarProducto(): void {
    if (!this.id) return;
    this.api.get<{ producto: Producto }>('/api/productos/' + this.id).subscribe({
      next: (res: any) => {
        const p = res?.producto;
        if (p) this.aplicarProducto(p);
      },
      error: () => {
        if (this.loadingData()) {
          this.mensaje.set({ tipo: 'error', text: 'Producto no encontrado' });
          this.notFound.set(true);
        }
      },
      complete: () => this.loadingData.set(false),
    });
  }

  margen = computed(() => {
    const compra = this.precioCompra() || 0;
    const venta = this.precioVenta() || 0;
    if (compra <= 0) return { monto: 0, porcentaje: 0 };
    const monto = venta - compra;
    const porcentaje = venta > 0 ? (monto / venta) * 100 : 0;
    return { monto, porcentaje };
  });

  onStockChange(val: string | number): void {
    const n = +val || 0;
    this.stock.set(Math.max(0, n));
  }

  formatMoney(n: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
  }

  guardar(): void {
    const nombre = this.nombre().trim();
    const idCat = this.idCategoria();
    const compra = this.precioCompra();
    const venta = this.precioVenta();
    const stockVal = this.stock();

    this.mensaje.set(null);

    if (!nombre) {
      this.mensaje.set({ tipo: 'error', text: 'El nombre del producto es requerido' });
      return;
    }
    if (idCat == null) {
      this.mensaje.set({ tipo: 'error', text: 'Selecciona una categoría' });
      return;
    }
    if (venta <= compra) {
      this.mensaje.set({ tipo: 'error', text: 'El precio de venta debe ser mayor al de compra' });
      return;
    }
    if (stockVal < 0) {
      this.mensaje.set({ tipo: 'error', text: 'El stock no puede ser negativo' });
      return;
    }
    const desc = this.descuento();
    if (desc < 0 || desc > 100) {
      this.mensaje.set({ tipo: 'error', text: 'El descuento debe estar entre 0 y 100' });
      return;
    }

    this.guardando.set(true);

    const body = {
      nombre,
      id_categoria: idCat,
      precio_de_compra: compra,
      precio_de_venta: venta,
      stock: stockVal,
      stock_minimo: this.stockMinimo(),
      estado: this.estado(),
      descuento_porcentaje: desc,
    };

    this.api.put<{ success?: boolean; message?: string }>('/api/productos/' + this.id, body).subscribe({
      next: (res) => {
        this.guardando.set(false);
        if (res?.success !== false) {
          this.router.navigate(['/admin/inventario']);
        } else {
          this.mensaje.set({ tipo: 'error', text: res?.message ?? 'Error al actualizar' });
        }
      },
      error: (e: any) => {
        this.guardando.set(false);
        this.mensaje.set({ tipo: 'error', text: e?.error?.message ?? 'Error al guardar' });
      },
    });
  }
}
