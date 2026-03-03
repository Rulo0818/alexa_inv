import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

interface AccionItem {
  id: number;
  id_usuario: number;
  tipo_accion: string;
  descripcion: string;
  direccion_ip: string;
  navegador: string;
  fecha_creacion: string;
  nombre: string;
  apellido: string;
  nombre_rol: string;
  username: string;
}

interface EmpleadoItem {
  id: number;
  nombre: string;
  apellido: string;
}

interface Stats {
  acciones_hoy: number;
  ventas_hoy: number;
  cambios_guardados_hoy: number;
  usuarios_activos_hoy: number;
}

const TIPO_LABEL: Record<string, string> = {
  login: 'Login',
  venta: 'Crear',
  venta_cancelada: 'Cancelar',
  usuario_crear: 'Crear',
  usuario_editar: 'Editar',
  usuario_eliminar: 'Eliminar',
  usuario_resetear_password: 'Resetear',
  producto_crear: 'Agregar',
  producto_editar: 'Editar',
  producto_eliminar: 'Eliminar',
  categoria_crear: 'Agregar',
  categoria_editar: 'Editar',
  categoria_eliminar: 'Eliminar'
};

const TIPO_TITULO: Record<string, string> = {
  login: 'Inicio de Sesión',
  venta: 'Venta Registrada',
  venta_cancelada: 'Venta Cancelada',
  usuario_crear: 'Usuario Creado',
  usuario_editar: 'Usuario Actualizado',
  usuario_eliminar: 'Usuario Eliminado',
  usuario_resetear_password: 'Contraseña Resetada',
  producto_crear: 'Producto Agregado',
  producto_editar: 'Producto Actualizado',
  producto_eliminar: 'Producto Eliminado',
  categoria_crear: 'Categoría Agregada',
  categoria_editar: 'Categoría Actualizada',
  categoria_eliminar: 'Categoría Eliminada'
};

@Component({
  selector: 'app-admin-historial-acciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-historial-acciones.component.html',
  styleUrl: './admin-historial-acciones.component.css',
})
export class AdminHistorialAccionesComponent implements OnInit {
  acciones = signal<AccionItem[]>([]);
  empleados = signal<EmpleadoItem[]>([]);
  stats = signal<Stats | null>(null);
  loading = signal(true);
  fechaInicio = signal('');
  fechaFin = signal('');
  usuarioFiltro = signal<string>('');
  tipoFiltro = signal<string>('');
  searchText = signal('');

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.setFechasPorDefecto();
    this.cargarEmpleados();
    this.cargarEstadisticas();
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
        this.empleados.set(res?.empleados ?? []);
      },
      error: () => {},
    });
  }

  cargarEstadisticas(): void {
    this.api.get<{ data: Stats }>('/api/historial-acciones/estadisticas/hoy').subscribe({
      next: (res: any) => this.stats.set(res?.data ?? null),
      error: () => {},
    });
  }

  aplicarFiltros(): void {
    this.loading.set(true);
    const params: Record<string, string> = {
      fecha_inicio: this.fechaInicio(),
      fecha_fin: this.fechaFin(),
    };
    if (this.usuarioFiltro()) params['id_usuario'] = this.usuarioFiltro();
    if (this.tipoFiltro()) params['tipo_accion'] = this.tipoFiltro();
    if (this.searchText().trim()) params['busqueda'] = this.searchText().trim();

    this.api.get<{ success: boolean; data?: AccionItem[] }>('/api/historial-acciones', params).subscribe({
      next: (res) => {
        this.acciones.set(res?.data ?? []);
      },
      error: () => this.acciones.set([]),
      complete: () => this.loading.set(false),
    });

    this.cargarEstadisticas();
  }

  getLabel(tipo: string): string {
    return TIPO_LABEL[tipo] ?? tipo;
  }

  getTitulo(tipo: string): string {
    return TIPO_TITULO[tipo] ?? tipo;
  }

  getIconClass(tipo: string): string {
    if (tipo === 'venta' || tipo === 'venta_cancelada') return 'icon-venta';
    if (tipo.startsWith('producto_') || tipo.startsWith('categoria_')) return 'icon-producto';
    if (tipo.startsWith('usuario_') || tipo === 'login') return 'icon-usuario';
    return 'icon-default';
  }

  getLabelClass(tipo: string): string {
    if (tipo === 'venta' || tipo === 'producto_crear' || tipo === 'usuario_crear' || tipo === 'categoria_crear') return 'badge-crear';
    if (tipo.includes('editar') || tipo.includes('actualizar')) return 'badge-editar';
    if (tipo === 'login') return 'badge-login';
    return 'badge-default';
  }

  formatFecha(d: string): string {
    if (!d) return '—';
    const date = new Date(d);
    const hoy = new Date();
    const esHoy = date.toDateString() === hoy.toDateString();
    if (esHoy) {
      return 'Hoy ' + date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  rolTexto(rol: string): string {
    return rol?.toLowerCase() === 'jefe' ? 'Jefe' : 'Empleado';
  }
}
