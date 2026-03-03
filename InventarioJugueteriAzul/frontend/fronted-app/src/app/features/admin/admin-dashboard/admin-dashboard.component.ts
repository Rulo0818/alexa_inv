import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';

interface EstadisticasVentas {
  total_ventas: number;
  top_productos: { nombre: string; cantidad_vendida: number; total_vendido?: number }[];
  ventas_por_empleado: { nombre: string; apellido: string; cantidad_ventas: number; total_vendido: number }[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  statsVentas = signal<EstadisticasVentas | null>(null);
  statsInventario = signal<{ valor_inventario: number } | null>(null);
  loading = signal(true);
  error = signal('');

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.loading.set(true);
    this.error.set('');
    const d = new Date();
    const hoy = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    forkJoin({
      ventas: this.api.get<{ estadisticas: EstadisticasVentas }>(
        '/api/ventas/estadisticas/resumen',
        { fecha_inicio: hoy, fecha_fin: hoy }
      ),
      inventario: this.api.get<{ estadisticas: { valor_inventario: number } }>(
        '/api/productos/estadisticas/inventario'
      ),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ ventas, inventario }) => {
          this.statsVentas.set(ventas?.estadisticas ?? null);
          this.statsInventario.set({ valor_inventario: inventario?.estadisticas?.valor_inventario ?? 0 });
        },
        error: () => this.error.set('No se pudieron cargar las estadísticas.'),
      });
  }

  get inversionTotal(): number {
    return this.statsInventario()?.valor_inventario ?? 0;
  }
  get ventasDelDia(): number {
    return this.statsVentas()?.total_ventas ?? 0;
  }
  get gananciaDelDia(): number {
    return this.ventasDelDia;
  }
  get margen(): number {
    const v = this.ventasDelDia;
    return v <= 0 ? 0 : Math.round((this.gananciaDelDia / v) * 1000) / 10;
  }
  get topProductos(): { nombre: string; cantidad_vendida: number; total_vendido: number }[] {
    return this.statsVentas()?.top_productos?.map((p) => ({
      nombre: p.nombre,
      cantidad_vendida: p.cantidad_vendida,
      total_vendido: p.total_vendido ?? 0,
    })) ?? [];
  }
  get ventasPorEmpleado(): { nombre: string; cantidad_ventas: number; total_vendido: number }[] {
    return this.statsVentas()?.ventas_por_empleado?.map((e) => ({
      nombre: `${e.nombre} ${e.apellido}`.trim(),
      cantidad_ventas: e.cantidad_ventas,
      total_vendido: e.total_vendido,
    })) ?? [];
  }
  formatMoney(n: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
  }
}
