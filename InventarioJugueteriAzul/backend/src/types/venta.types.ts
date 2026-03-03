export interface Venta {
  id: number;
  id_empleado: number;
  total: number;
  metodo_pago: 'efectivo' | 'transferencia';
  fecha: Date;
  hora: string;
  cancelada: boolean;
  motivo_cancelacion?: string;
  cancelada_por?: number;
  fecha_cancelacion?: Date;
  fecha_creacion: Date;
}

export interface DetalleVenta {
  id: number;
  id_venta: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface ProductoVenta {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
}

export interface RegistrarVentaRequest {
  productos: ProductoVenta[];
  metodo_pago: 'efectivo' | 'transferencia';
}

export interface VentaCompleta extends Venta {
  nombre_empleado: string;
  apellido_empleado: string;
  productos: {
    nombre: string;
    codigo: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
  }[];
}

export interface CancelarVentaRequest {
  motivo: string;
}

export interface ListarVentasQuery {
  fecha_inicio?: string;
  fecha_fin?: string;
  id_empleado?: number;
  metodo_pago?: 'efectivo' | 'transferencia';
  cancelada?: boolean;
}

export interface EstadisticasVentas {
  total_ventas: number;
  ventas_realizadas: number;
  promedio_venta: number;
  ventas_efectivo: number;
  ventas_transferencia: number;
  porcentaje_efectivo: number;
  porcentaje_transferencia: number;
  top_productos: {
    nombre: string;
    codigo: string;
    cantidad_vendida: number;
    total_vendido: number;
  }[];
  ventas_por_empleado: {
    nombre: string;
    apellido: string;
    cantidad_ventas: number;
    total_vendido: number;
  }[];
}