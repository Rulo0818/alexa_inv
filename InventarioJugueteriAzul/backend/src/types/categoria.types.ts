export interface Categoria {
  id: number;
  nombre: string;
  emoji: string;
  activo: boolean;
  fecha_creacion: Date;
}

export interface CrearCategoriaRequest {
  nombre: string;
  emoji?: string;
}

export interface EditarCategoriaRequest {
  nombre?: string;
  emoji?: string;
}

export interface ListarCategoriasQuery {
  activo?: boolean;
  search?: string;
}

export interface CategoriaConProductos extends Categoria {
  cantidad_productos: number;
}