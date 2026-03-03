import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

interface EmpleadoItem {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  edad?: number;
  telefono?: string;
  domicilio?: string;
  nombre_rol: string;
  activo: boolean;
  foto_url?: string | null;
  ventas_hoy?: number;
  ventas_totales?: number;
}

interface Resumen {
  total: number;
  activos: number;
  ventas_hoy: number;
  jefes: number;
}

@Component({
  selector: 'app-admin-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-gestion-usuarios.component.html',
  styleUrl: './admin-gestion-usuarios.component.css',
})
export class AdminGestionUsuariosComponent implements OnInit {
  empleados = signal<EmpleadoItem[]>([]);
  resumen = signal<Resumen | null>(null);
  loading = signal(true);
  searchText = signal('');
  rolFiltro = signal('');
  estadoFiltro = signal('');
  empleadoResetear = signal<EmpleadoItem | null>(null);
  resetPassword = signal('');
  resetError = signal('');

  constructor(private api: ApiService, private router: Router) {}

  editar(e: EmpleadoItem): void {
    this.router.navigate(['/admin/gestion-usuarios/editar-usuario', e.id], {
      state: { empleado: e }
    });
  }

  ngOnInit(): void {
    this.cargarResumen();
    this.cargarEmpleados();
  }

  cargarResumen(): void {
    this.api.get<{ resumen: Resumen }>('/api/empleados/estadisticas/resumen').subscribe({
      next: (res: any) => this.resumen.set(res?.resumen ?? null),
      error: () => {},
    });
  }

  cargarEmpleados(): void {
    this.loading.set(true);
    const params: Record<string, string> = {};
    if (this.searchText().trim()) params['search'] = this.searchText().trim();
    if (this.rolFiltro()) params['rol'] = this.rolFiltro();
    if (this.estadoFiltro() === 'activo') params['activo'] = 'true';
    if (this.estadoFiltro() === 'inactivo') params['activo'] = 'false';

    this.api.get<{ empleados: EmpleadoItem[] }>('/api/empleados', params).subscribe({
      next: (res: any) => {
        this.empleados.set(res?.empleados ?? []);
      },
      error: () => this.empleados.set([]),
      complete: () => this.loading.set(false),
    });
    this.cargarResumen();
  }

  buscar(): void {
    this.cargarEmpleados();
  }

  fotoUrl(e: EmpleadoItem): string | null {
    return e.foto_url ? `${environment.apiUrl}/uploads/${e.foto_url}` : null;
  }

  iniciales(nombre: string, apellido: string): string {
    const n = (nombre || '').charAt(0);
    const a = (apellido || '').charAt(0);
    return (n + a).toUpperCase() || '?';
  }

  ventasTexto(e: EmpleadoItem): string {
    const total = e.ventas_totales ?? e.ventas_hoy ?? 0;
    return String(total);
  }

  desactivar(e: EmpleadoItem): void {
    if (!confirm('Desactivar a ' + e.nombre + ' ' + e.apellido + '?')) return;
    this.api.put('/api/empleados/' + e.id, { activo: false }).subscribe({
      next: () => this.cargarEmpleados(),
      error: () => alert('Error al desactivar'),
    });
  }

  eliminar(e: EmpleadoItem): void {
    const msg = '¿Desea eliminar completamente a ' + e.nombre + ' ' + e.apellido + '?\n\nEsta acción no se puede deshacer y eliminará permanentemente el usuario.';
    if (!confirm(msg)) return;
    this.api.delete('/api/empleados/' + e.id).subscribe({
      next: () => this.cargarEmpleados(),
      error: (err) => alert(err?.error?.message ?? 'Error al eliminar'),
    });
  }

  abrirResetear(e: EmpleadoItem): void {
    this.empleadoResetear.set(e);
    this.resetPassword.set('');
    this.resetError.set('');
  }

  cerrarResetear(): void {
    this.empleadoResetear.set(null);
  }

  ejecutarResetear(): void {
    const emp = this.empleadoResetear();
    const pass = this.resetPassword().trim();
    if (!emp) return;
    if (!pass || pass.length < 6) {
      this.resetError.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    this.api
      .post('/api/empleados/' + emp.id + '/resetear-contrasena', { contrasena_temporal: pass })
      .subscribe({
        next: () => {
          this.cerrarResetear();
          this.cargarEmpleados();
        },
        error: (err) => this.resetError.set(err?.error?.message ?? 'Error al resetear'),
      });
  }
}
