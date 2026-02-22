export interface CrearEmpleadoRequest {
  nombre: string;
  apellido: string;
  edad?: number;
  telefono?: string;
  domicilio?: string;
  contrasena_temporal: string;
  id_rol: number;
  activo?: boolean;
}

export interface EditarEmpleadoRequest {
  nombre?: string;
  apellido?: string;
  edad?: number;
  telefono?: string;
  domicilio?: string;
  activo?: boolean;
  foto_url?: string;
}

export interface ResetearContrasenaRequest {
  contrasena_temporal: string;
}

export interface ListarEmpleadosQuery {
  rol?: 'jefe' | 'empleado';
  activo?: boolean;
  search?: string;
}

export interface EmpleadoResponse {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  edad?: number;
  telefono?: string;
  domicilio?: string;
  nombre_rol: string;
  activo: boolean;
  fecha_creacion: Date;
  foto_url?: string | null;
  ventas_hoy?: number;
  ventas_totales?: number;
}

export interface EstadisticasEmpleado {
  ventas_hoy: number;
  total_vendido: number;
  total_vendido_historico?: number;
  ultima_venta?: Date | string | null;
}