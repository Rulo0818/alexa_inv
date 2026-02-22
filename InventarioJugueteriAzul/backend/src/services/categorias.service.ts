import categoriasRepository from '../repositories/categorias.repository';
import authRepository from '../repositories/auth.repository';
import {
  CrearCategoriaRequest,
  EditarCategoriaRequest,
  ListarCategoriasQuery,
  CategoriaConProductos
} from '../types/categoria.types';

export class CategoriasService {

  // Listar categorías
  async listar(filtros: ListarCategoriasQuery): Promise<{
    success: boolean;
    categorias: CategoriaConProductos[];
  }> {
    const categorias = await categoriasRepository.listar(filtros);

    return {
      success: true,
      categorias
    };
  }

  // Buscar por ID
  async buscarPorId(id: number): Promise<{
    success: boolean;
    categoria?: CategoriaConProductos;
    message?: string;
  }> {
    const categoria = await categoriasRepository.buscarPorId(id);

    if (!categoria) {
      return {
        success: false,
        message: 'Categoría no encontrada'
      };
    }

    const cantidadProductos = await categoriasRepository.contarProductos(id);

    return {
      success: true,
      categoria: {
        ...categoria,
        cantidad_productos: cantidadProductos
      }
    };
  }

  // Crear categoría
  async crear(
    datos: CrearCategoriaRequest,
    id_usuario: number,
    direccion_ip: string,
    navegador: string
  ): Promise<{
    success: boolean;
    message: string;
    categoria_id?: number;
  }> {

    // Validar nombre
    if (!datos.nombre || datos.nombre.trim().length === 0) {
      return {
        success: false,
        message: 'El nombre de la categoría es requerido'
      };
    }

    // Verificar si ya existe
    const existe = await categoriasRepository.existeNombre(datos.nombre);
    if (existe) {
      return {
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      };
    }

    // Crear categoría
    const categoria_id = await categoriasRepository.crear(datos);

    // Registrar en historial
    await authRepository.registrarAccion(
      id_usuario,
      'categoria_crear',
      `Creó la categoría "${datos.nombre}" ${datos.emoji || ''}`,
      direccion_ip,
      navegador
    );

    return {
      success: true,
      message: 'Categoría creada correctamente',
      categoria_id
    };
  }

  // Editar categoría
  async editar(
    id: number,
    datos: EditarCategoriaRequest,
    id_usuario: number,
    direccion_ip: string,
    navegador: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {

    // Verificar que existe
    const categoria = await categoriasRepository.buscarPorId(id);
    if (!categoria) {
      return {
        success: false,
        message: 'Categoría no encontrada'
      };
    }

    // Verificar nombre si se está cambiando
    if (datos.nombre && datos.nombre !== categoria.nombre) {
      const existe = await categoriasRepository.existeNombre(datos.nombre, id);
      if (existe) {
        return {
          success: false,
          message: 'Ya existe una categoría con ese nombre'
        };
      }
    }

    // Editar categoría
    await categoriasRepository.editar(id, datos);

    // Registrar en historial
    const cambios = Object.keys(datos).join(', ');
    await authRepository.registrarAccion(
      id_usuario,
      'categoria_editar',
      `Editó la categoría "${categoria.nombre}". Campos: ${cambios}`,
      direccion_ip,
      navegador
    );

    return {
      success: true,
      message: 'Categoría actualizada correctamente'
    };
  }

  // Eliminar categoría
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
    const categoria = await categoriasRepository.buscarPorId(id);
    if (!categoria) {
      return {
        success: false,
        message: 'Categoría no encontrada'
      };
    }

    // Verificar que no tenga productos
    const cantidadProductos = await categoriasRepository.contarProductos(id);
    if (cantidadProductos > 0) {
      return {
        success: false,
        message: `No se puede eliminar. Esta categoría tiene ${cantidadProductos} producto(s) activo(s)`
      };
    }

    // Eliminar (desactivar)
    await categoriasRepository.eliminar(id);

    // Registrar en historial
    await authRepository.registrarAccion(
      id_usuario,
      'categoria_eliminar',
      `Eliminó la categoría "${categoria.nombre}"`,
      direccion_ip,
      navegador
    );

    return {
      success: true,
      message: 'Categoría eliminada correctamente'
    };
  }
}

export default new CategoriasService();