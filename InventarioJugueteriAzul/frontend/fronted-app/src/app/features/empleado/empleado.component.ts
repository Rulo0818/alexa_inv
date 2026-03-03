import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { environment } from '../../../environments/environment';

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  precio_de_venta: number;
  stock: number;
  nombre_categoria: string;
  emoji_categoria: string;
}

interface Categoria {
  id: number;
  nombre: string;
  emoji: string;
}

interface ItemCarrito {
  id_producto: number;
  nombre: string;
  codigo: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './empleado.component.html',
  styleUrl: './empleado.component.css',
})
export class EmpleadoComponent implements OnInit {
  usuario = computed(() => this.auth.currentUser());
  categorias = signal<Categoria[]>([]);
  productos = signal<Producto[]>([]);
  carrito = signal<ItemCarrito[]>([]);
  categoriaSeleccionada = signal<number | null>(null);
  searchText = signal('');
  metodoPago = signal<'efectivo' | 'transferencia'>('efectivo');
  loadingProductos = signal(false);
  loadingStats = signal(true);
  ventasHoy = signal(0);
  totalVendido = signal(0);
  totalVendidoHistorico = signal(0);
  ultimaVenta = signal<string | null>(null);
  finalizando = signal(false);
  mensaje = signal<{ tipo: 'ok' | 'error'; text: string } | null>(null);

  constructor(
    private auth: AuthService,
    private api: ApiService
  ) {}

  fotoUsuario(): string | null {
    const u = this.usuario();
    if (!u?.foto_url) return null;
    return `${environment.apiUrl}/uploads/${u.foto_url}`;
  }

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos();
    this.cargarMisEstadisticas();
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

  private cargarProductos(): void {
    this.loadingProductos.set(true);
    const cat = this.categoriaSeleccionada();
    const search = this.searchText();
    const params: Record<string, string> = { activo: 'true' };
    if (cat != null) params['categoria'] = String(cat);
    if (search?.trim()) params['search'] = search.trim();

    this.api.get<{ productos: Producto[] }>('/api/productos', params).subscribe({
      next: (res: any) => {
        const prods = Array.isArray(res) ? res : (res.productos ?? []);
        this.productos.set(prods);
      },
      error: () => this.productos.set([]),
    });
    setTimeout(() => this.loadingProductos.set(false), 300);
  }

  private cargarMisEstadisticas(): void {
    this.loadingStats.set(true);
    this.api
      .get<{
        estadisticas: {
          ventas_hoy: number;
          total_vendido: number;
          total_vendido_historico?: number;
          ultima_venta?: string | null;
        };
      }>('/api/empleados/mi-estadisticas')
      .subscribe({
        next: (res) => {
          const s = res.estadisticas ?? (res as any);
          this.ventasHoy.set(Number(s?.ventas_hoy) ?? 0);
          this.totalVendido.set(Number(s?.total_vendido) ?? 0);
          this.totalVendidoHistorico.set(Number(s?.total_vendido_historico ?? s?.total_vendido) ?? 0);
          this.ultimaVenta.set(s?.ultima_venta ? this.formatearHace(String(s.ultima_venta)) : null);
        },
        error: () => {
          this.ventasHoy.set(0);
          this.totalVendido.set(0);
          this.totalVendidoHistorico.set(0);
          this.ultimaVenta.set(null);
        },
      });
    setTimeout(() => this.loadingStats.set(false), 300);
  }

  /** Formato: solo tiempo transcurrido (ej: "15 min", "1 hora"), nunca hora exacta */
  private formatearHace(fecha: string): string {
    const d = new Date(fecha.replace(' ', 'T'));
    const ts = d.getTime();
    if (isNaN(ts)) return '—';
    const diffMin = (Date.now() - ts) / 60000;
    if (diffMin < 1) return 'Hace un momento';
    if (diffMin < 60) return `Hace ${Math.round(diffMin)} min`;
    const h = Math.floor(diffMin / 60);
    if (h < 24) return h === 1 ? 'Hace 1 hora' : `Hace ${h} horas`;
    const dias = Math.floor(h / 24);
    return dias === 1 ? 'Hace 1 día' : `Hace ${dias} días`;
  }

  seleccionarCategoria(id: number | null): void {
    this.categoriaSeleccionada.set(id);
    this.cargarProductos();
  }

  onSearchChange(value: string): void {
    this.searchText.set(value);
    this.cargarProductos();
  }

  private toNum(v: unknown): number {
    const n = typeof v === 'number' ? v : parseFloat(String(v ?? 0));
    return isNaN(n) ? 0 : n;
  }

  agregarAlCarrito(p: Producto): void {
    if (p.stock < 1) return;
    const precio = this.toNum(p.precio_de_venta);
    const items = [...this.carrito()];
    const idx = items.findIndex((i) => i.id_producto === p.id);
    if (idx >= 0) {
      const cant = items[idx].cantidad + 1;
      if (cant > p.stock) return;
      items[idx] = {
        ...items[idx],
        cantidad: cant,
        subtotal: cant * this.toNum(items[idx].precio_unitario),
      };
    } else {
      items.push({
        id_producto: p.id,
        nombre: p.nombre,
        codigo: p.codigo,
        cantidad: 1,
        precio_unitario: precio,
        subtotal: precio,
      });
    }
    this.carrito.set(items);
  }

  quitarDelCarrito(id: number): void {
    this.carrito.set(this.carrito().filter((i) => i.id_producto !== id));
  }

  ajustarCantidad(id: number, delta: number): void {
    const items = this.carrito().map((i) => {
      if (i.id_producto !== id) return i;
      const nueva = Math.max(0, i.cantidad + delta);
      if (nueva === 0) return null;
      return { ...i, cantidad: nueva, subtotal: nueva * this.toNum(i.precio_unitario) };
    });
    this.carrito.set(items.filter((i): i is ItemCarrito => i !== null));
  }

  subtotal = computed(() =>
    this.carrito().reduce((s, i) => s + this.toNum(i.subtotal), 0)
  );

  formatMoney(n: number): string {
    const val = this.toNum(n);
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);
  }

  finalizarVenta(): void {
    const items = this.carrito();
    if (items.length === 0) {
      this.mensaje.set({ tipo: 'error', text: 'Agrega productos al carrito' });
      return;
    }
    this.finalizando.set(true);
    this.mensaje.set(null);
    const body = {
      productos: items.map((i) => ({
        id_producto: i.id_producto,
        cantidad: i.cantidad,
        precio_unitario: i.precio_unitario,
      })),
      metodo_pago: this.metodoPago(),
    };
    this.api.post<{ success: boolean; message: string }>('/api/ventas', body).subscribe({
      next: (res) => {
        this.finalizando.set(false);
        if (res.success) {
          this.carrito.set([]);
          this.mensaje.set({ tipo: 'ok', text: 'Venta registrada correctamente' });
          this.cargarMisEstadisticas();
        } else {
          this.mensaje.set({ tipo: 'error', text: res.message ?? 'Error al registrar' });
        }
      },
      error: () => {
        this.finalizando.set(false);
        this.mensaje.set({ tipo: 'error', text: 'Error de conexión' });
      },
    });
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
