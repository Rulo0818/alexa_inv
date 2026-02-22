import productosRepository from '../repositories/productos.repository';
import categoriasRepository from '../repositories/categorias.repository';
import authRepository from '../repositories/auth.repository';
import {
  CrearProductoRequest,
  EditarProductoRequest,
  ListarProductosQuery,
  ProductoConCategoria,
  EstadisticasInventario
} from '../types/producto.types';

export class ProductosService {

  // Listar productos
  async listar(filtros: ListarProductosQuery): Promise<{
    success: boolean;
    productos: ProductoConCategoria[];
  }> {
    const productos = await productosRepository.listar(filtros);

    return {
      success: true,
      productos
    };
  }

  // Buscar por ID
  async buscarPorId(id: number): Promise<{
    success: boolean;
    producto?: ProductoConCategoria;
    message?: string;
  }> {
    const producto = await productosRepository.buscarPorId(id);

    if (!producto) {
      return {
        success: false,
        message: 'Producto no encontrado'
      };
    }

    return {
      success: true,
      producto
    };
  }

  // Buscar por código
  async buscarPorCodigo(codigo: string): Promise<{
    success: boolean;
    producto?: ProductoConCategoria;
    message?: string;
  }> {
    const producto = await productosRepository.buscarPorCodigo(codigo);

    if (!producto) {
      return {
        success: false,
        message: 'Producto no encontrado'
      };
    }

    return {
      success: true,
      producto
    };
  }

  // Crear producto
  async crear(
    datos: CrearProductoRequest,
    id_usuario: number,
    direccion_ip: string,
    navegador: string
  ): Promise<{
    success: boolean;
    message: string;
    producto_id?: number;
    codigo?: string;
  }> {

    // Validaciones
    if (!datos.nombre || datos.nombre.trim().length === 0) {
      return {
        success: false,
        message: 'El nombre del producto es requerido'
      };
    }

    if (datos.precio_de_venta <= datos.precio_de_compra) {
      return {
        success: false,
        message: 'El precio de venta debe ser mayor al precio de compra'
      };
    }

    const stock = Math.floor(Number(datos.stock)) || 0;
    if (stock < 1) {
      return {
        success: false,
        message: 'El stock inicial debe ser al menos 1'
      };
    }

    if (datos.descuento_porcentaje && (datos.descuento_porcentaje < 0 || datos.descuento_porcentaje > 100)) {
      return {
        success: false,
        message: 'El descuento debe estar entre 0 y 100'
      };
    }

    // Verificar que la categoría existe
    const categoria = await categoriasRepository.buscarPorId(datos.id_categoria);
    if (!categoria) {
      return {
        success: false,
        message: 'La categoría seleccionada no existe'
      };
    }

    // Generar código automático
    const codigo = await productosRepository.generarCodigo();

    // Crear producto
    const producto_id = await productosRepository.crear(datos, codigo);

    // Registrar en historial
    await authRepository.registrarAccion(
      id_usuario,
      'producto_crear',
      `Creó el producto "${datos.nombre}" (${codigo})`,
      direccion_ip,
      navegador
    );

    return {
      success: true,
      message: 'Producto creado correctamente',
      producto_id,
      codigo
    };
  }

  // Editar producto
  async editar(
    id: number,
    datos: EditarProductoRequest,
    id_usuario: number,
    direccion_ip: string,
    navegador: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {

    // Verificar que existe
    const producto = await productosRepository.buscarPorId(id);
    if (!producto) {
      return {
        success: false,
        message: 'Producto no encontrado'
      };
    }

    // Validaciones
    if (datos.precio_de_venta !== undefined && datos.precio_de_compra !== undefined) {
      if (datos.precio_de_venta <= datos.precio_de_compra) {
        return {
          success: false,
          message: 'El precio de venta debe ser mayor al precio de compra'
        };
      }
    } else if (datos.precio_de_venta !== undefined && datos.precio_de_venta <= producto.precio_de_compra) {
      return {
        success: false,
        message: 'El precio de venta debe ser mayor al precio de compra'
      };
    } else if (datos.precio_de_compra !== undefined && producto.precio_de_venta <= datos.precio_de_compra) {
      return {
        success: false,
        message: 'El precio de venta debe ser mayor al precio de compra'
      };
    }

    if (datos.stock !== undefined && datos.stock < 0) {
      return {
        success: false,
        message: 'El stock no puede ser negativo'
      };
    }

    if (datos.descuento_porcentaje !== undefined && 
        (datos.descuento_porcentaje < 0 || datos.descuento_porcentaje > 100)) {
      return {
        success: false,
        message: 'El descuento debe estar entre 0 y 100'
      };
    }

    // Verificar categoría si se está cambiando
    if (datos.id_categoria) {
      const categoria = await categoriasRepository.buscarPorId(datos.id_categoria);
      if (!categoria) {
        return {
          success: false,
          message: 'La categoría seleccionada no existe'
        };
      }
    }

    // Editar producto
    await productosRepository.editar(id, datos);

    // Registrar en historial
    const cambios = Object.keys(datos).join(', ');
    await authRepository.registrarAccion(
      id_usuario,
      'producto_editar',
      `Editó el producto "${producto.nombre}". Campos: ${cambios}`,
      direccion_ip,
      navegador
    );

    return {
      success: true,
      message: 'Producto actualizado correctamente'
    };
  }

  // Eliminar producto
  async eliminar(
    id: number,
    id_usuario: number,
    direccion_ip: string,
    navegador: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {

    // Verificar que existe
    const producto = await productosRepository.buscarPorId(id);
    if (!producto) {
      return {
        success: false,
        message: 'Producto no encontrado'
      };
    }

    // Eliminar (soft delete)
    await productosRepository.eliminar(id);

    // Registrar en historial
    await authRepository.registrarAccion(
      id_usuario,
      'producto_eliminar',
      `Eliminó el producto "${producto.nombre}" (${producto.codigo})`,
      direccion_ip,
      navegador
    );

    return {
      success: true,
      message: 'Producto eliminado correctamente'
    };
  }

  // Obtener estadísticas
  async obtenerEstadisticas(): Promise<{
    success: boolean;
    estadisticas: EstadisticasInventario;
  }> {
    const estadisticas = await productosRepository.obtenerEstadisticas();

    return {
      success: true,
      estadisticas
    };
  }
}

export default new ProductosService();