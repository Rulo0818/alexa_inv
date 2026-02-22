import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

interface Categoria {
  id: number;
  nombre: string;
  emoji?: string;
}

@Component({
  selector: 'app-admin-agregar-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-agregar-producto.component.html',
  styleUrl: './admin-agregar-producto.component.css',
})
export class AdminAgregarProductoComponent implements OnInit {
  categorias = signal<Categoria[]>([]);
  nombre = signal('');
  idCategoria = signal<number | null>(null);
  precioCompra = signal<number>(0);
  precioVenta = signal<number>(0);
  stock = signal<number>(10);
  stockMinimo = signal<number>(5);
  estado = signal<'bueno' | 'malo'>('bueno');
  descuento = signal<number>(0);
  guardando = signal(false);
  mensaje = signal<{ tipo: 'ok' | 'error'; text: string } | null>(null);

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarCategorias();
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

  margen = computed(() => {
    const compra = this.precioCompra() || 0;
    const venta = this.precioVenta() || 0;
    if (compra <= 0) return { monto: 0, porcentaje: 0 };
    const monto = venta - compra;
    const porcentaje = venta > 0 ? (monto / venta) * 100 : 0;
    return { monto, porcentaje };
  });

  onStockChange(val: string | number): void {
    const n = +val || 1;
    this.stock.set(Math.max(1, n));
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
    if (stockVal < 1) {
      this.mensaje.set({ tipo: 'error', text: 'El stock inicial debe ser al menos 1' });
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

    this.api.post<{ success?: boolean; message?: string; codigo?: string }>('/api/productos', body).subscribe({
      next: (res) => {
        this.guardando.set(false);
        if (res.success !== false) {
          this.mensaje.set({ tipo: 'ok', text: `Producto creado correctamente. Código: ${res.codigo ?? '—'}` });
          this.resetearFormulario();
        } else {
          this.mensaje.set({ tipo: 'error', text: res.message ?? 'Error al crear' });
        }
      },
      error: (e: any) => {
        this.guardando.set(false);
        this.mensaje.set({ tipo: 'error', text: e?.error?.message ?? 'Error al guardar' });
      },
    });
  }

  private resetearFormulario(): void {
    this.nombre.set('');
    this.idCategoria.set(null);
    this.precioCompra.set(0);
    this.precioVenta.set(0);
    this.stock.set(10);
    this.stockMinimo.set(5);
    this.estado.set('bueno');
    this.descuento.set(0);
  }
}
