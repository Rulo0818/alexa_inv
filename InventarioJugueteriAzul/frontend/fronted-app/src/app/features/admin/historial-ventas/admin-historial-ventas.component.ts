import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

interface VentaItem {
  id: number;
  total: number;
  metodo_pago: 'efectivo' | 'transferencia';
  fecha: string;
  hora: string;
  nombre_empleado: string;
  apellido_empleado: string;
  cancelada?: boolean;
  productos: { nombre: string; cantidad: number; precio_unitario: number; subtotal: number }[];
}

interface EmpleadoItem {
  id: number;
  nombre: string;
  apellido: string;
}

interface Stats {
  total_ventas: number;
  ventas_realizadas: number;
  promedio_venta: number;
  ventas_efectivo: number;
  ventas_transferencia: number;
  porcentaje_efectivo: number;
  porcentaje_transferencia: number;
}

@Component({
  selector: 'app-admin-historial-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-historial-ventas.component.html',
  styleUrl: './admin-historial-ventas.component.css',
})
export class AdminHistorialVentasComponent implements OnInit {
  ventas = signal<VentaItem[]>([]);
  empleados = signal<EmpleadoItem[]>([]);
  stats = signal<Stats | null>(null);
  loading = signal(true);
  fechaInicio = signal('');
  fechaFin = signal('');
  empleadoFiltro = signal<string>('');
  metodoFiltro = signal<string>('');
  searchText = signal('');
  detalleVenta = signal<VentaItem | null>(null);

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.setFechasPorDefecto();
    this.cargarEmpleados();
    this.aplicarFiltros();
  }

  private setFechasPorDefecto(): void {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.fechaInicio.set(inicioMes.toISOString().slice(0, 10));
    this.fechaFin.set(hoy.toISOString().slice(0, 10));
  }

  private cargarEmpleados(): void {
    this.api.get<{ empleados: EmpleadoItem[] }>('/api/empleados').subscribe({
      next: (res: any) => {
        const list = res?.empleados ?? [];
        this.empleados.set(list);
      },
      error: () => {},
    });
  }

  aplicarFiltros(): void {
    this.loading.set(true);
    const params: Record<string, string> = {
      fecha_inicio: this.fechaInicio(),
      fecha_fin: this.fechaFin(),
      cancelada: 'false',
    };
    if (this.empleadoFiltro()) params['id_empleado'] = this.empleadoFiltro();
    if (this.metodoFiltro()) params['metodo_pago'] = this.metodoFiltro();

    this.api.get<{ ventas: VentaItem[] }>('/api/ventas', params).subscribe({
      next: (res) => {
        this.ventas.set(res.ventas ?? []);
      },
      error: () => this.ventas.set([]),
    });

    this.api
      .get<{ estadisticas: Stats }>('/api/ventas/estadisticas/resumen', params)
      .subscribe({
        next: (res) => this.stats.set(res.estadisticas ?? null),
        error: () => {},
      });

    setTimeout(() => this.loading.set(false), 300);
  }

  ventasFiltradas = computed(() => {
    const list = this.ventas().filter((v) => !v.cancelada);
    const search = this.searchText().toLowerCase().trim();
    if (!search) return list;
    return list.filter(
      (v) =>
        String(v.id).includes(search) ||
        `${v.nombre_empleado} ${v.apellido_empleado}`.toLowerCase().includes(search) ||
        v.productos?.some((p) => p.nombre?.toLowerCase().includes(search))
    );
  });

  productosTexto(prod: VentaItem['productos']): string {
    if (!prod?.length) return '—';
    return prod.map((p) => `${p.cantidad}x ${p.nombre}`).join(', ');
  }

  formatFecha(fecha: string | Date, hora?: string): string {
    if (!fecha) return '—';
    const fStr = String(fecha).trim();
    let datePart = fStr;
    if (fStr.includes('T')) datePart = fStr.split('T')[0];
    else if (fStr.includes(' ')) datePart = fStr.split(' ')[0];
    const horaPart = hora ? String(hora).trim().split('.')[0] : '00:00:00';
    const toParse = `${datePart}T${horaPart}`;
    const d = new Date(toParse);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatId(id: number): string {
    return String(id).padStart(4, '0');
  }

  formatMoney(n: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
  }

  verDetalle(v: VentaItem): void {
    this.detalleVenta.set(v);
  }

  cerrarDetalle(): void {
    this.detalleVenta.set(null);
  }

  rangoTexto(): string {
    const i = this.fechaInicio();
    const f = this.fechaFin();
    if (!i || !f) return '';
    const di = new Date(i);
    const df = new Date(f);
    return `Del ${di.getDate()}/${String(di.getMonth() + 1).padStart(2, '0')} al ${df.getDate()}/${String(df.getMonth() + 1).padStart(2, '0')}`;
  }
}
