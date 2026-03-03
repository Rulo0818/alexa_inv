export interface Producto {
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
  activo: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export interface ProductoConCategoria extends Producto {
  nombre_categoria: string;
  emoji_categoria: string;
}

export interface CrearProductoRequest {
  nombre: string;
  id_categoria: number;
  precio_de_compra: number;
  precio_de_venta: number;
  stock: number;
  stock_minimo?: number;
  estado?: 'bueno' | 'malo';
  descuento_porcentaje?: number;
}

export interface EditarProductoRequest {
  nombre?: string;
  id_categoria?: number;
  precio_de_compra?: number;
  precio_de_venta?: number;
  stock?: number;
  stock_minimo?: number;
  estado?: 'bueno' | 'malo';
  descuento_porcentaje?: number;
}

export interface ListarProductosQuery {
  categoria?: number;
  activo?: boolean;
  estado?: 'bueno' | 'malo';
  stock_bajo?: boolean;
  search?: string;
}

export interface EstadisticasInventario {
  total_productos: number;
  valor_inventario: number;
  stock_bajo: number;
  agotados: number;
  por_categoria: {
    id_categoria: number;
    nombre_categoria: string;
    cantidad: number;
    valor: number;
  }[];
}