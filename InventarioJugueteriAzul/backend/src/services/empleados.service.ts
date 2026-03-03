import bcrypt from 'bcrypt';
import empleadosRepository from '../repositories/empleados.repository';
import authRepository from '../repositories/auth.repository';
import {
  CrearEmpleadoRequest,
  EditarEmpleadoRequest,
  ResetearContrasenaRequest,
  EmpleadoResponse,
  EstadisticasEmpleado,
  ListarEmpleadosQuery
} from '../types/empleado.types';

export class EmpleadosService {

  // Generar username
  private generarUsername(nombre: string, apellido: string, rol: 'jefe' | 'empleado'): string {
    const nombreLimpio = nombre.trim().toLowerCase().replace(/\s+/g, '_');
    const apellidoLimpio = apellido.trim().toLowerCase().replace(/\s+/g, '_');
    const sufijo = rol === 'jefe' ? 'AJA' : 'EJA';
    return `${nombreLimpio}_${apellidoLimpio}${sufijo}`;
  }

  // Resumen para tarjetas
  async obtenerResumen(): Promise<{
    success: boolean;
    resumen?: { total: number; activos: number; ventas_hoy: number; jefes: number };
    message?: string;
  }> {
    const resumen = await empleadosRepository.obtenerResumen();
    return { success: true, resumen };
  }

  // Listar empleados
  async listar(filtros: ListarEmpleadosQuery): Promise<{
    success: boolean;
    empleados: EmpleadoResponse[];
    total: number;
  }> {
    const empleados = await empleadosRepository.listar(filtros);
    const total = await empleadosRepository.contar(filtros);

    return {
      success: true,
      empleados,
      total
    };
  }

  // Buscar empleado por ID
  async buscarPorId(id: number): Promise<{
    success: boolean;
    empleado?: EmpleadoResponse;
    message?: string;
  }> {
    const empleado = await empleadosRepository.buscarPorId(id);

    if (!empleado) {
      return {
        success: false,
        message: 'Empleado no encontrado'
      };
    }

    return {
      success: true,
      empleado
    };
  }

  // Crear empleado
  async crear(
    datos: CrearEmpleadoRequest,
    id_usuario_creador: number,
    direccion_ip: string,
    navegador: string
  ): Promise<{
    success: boolean;
    message: string;
    empleado_id?: number;
    username?: string;
  }> {

    // Validaciones
    if (!datos.nombre || !datos.apellido) {
      return {
        success: false,
        message: 'Nombre y apellido son requeridos'
      };
    }

    if (!datos.contrasena_temporal || datos.contrasena_temporal.length < 6) {
      return {
        success: false,
        message: 'La contraseña temporal debe tener mínimo 6 caracteres'
      };
    }

    if (datos.id_rol !== 1 && datos.id_rol !== 2) {
      return {
        success: false,
        message: 'Rol inválido'
      };
    }

    // Generar username
    const rol = datos.id_rol === 1 ? 'jefe' : 'empleado';
    const username = this.generarUsername(datos.nombre, datos.apellido, rol);

    // Verificar si username ya existe
    const existeUsername = await empleadosRepository.existeUsername(username);
    if (existeUsername) {
      return {
        success: false,
        message: `El username ${username} ya existe. Intenta con otro nombre o apellido.`
      };
    }

    // Verificar teléfono si se proporciona
    if (datos.telefono) {
      const existeTelefono = await empleadosRepository.existeTelefono(datos.telefono);
      if (existeTelefono) {
        return {
          success: false,
          message: 'El teléfono ya está registrado'
        };
      }
    }

    // Hashear contraseña
    const contrasenaHash = await bcrypt.hash(datos.contrasena_temporal, 10);

    // Crear empleado
    const empleado_id = await empleadosRepository.crear(datos, username, contrasenaHash, undefined);

    // Registrar en historial
    await authRepository.registrarAccion(
      id_usuario_creador,
      'usuario_crear',
      `Creó el usuario ${datos.nombre} ${datos.apellido} (${username})`,
      direccion_ip,
      navegador
    );

    return {
      success: true,
      message: 'Empleado creado correctamente',
      empleado_id,
      username
    };
  }

  // Editar empleado
  async editar(
    id: number,
    datos: EditarEmpleadoRequest,
    id_usuario_editor: number,
    direccion_ip: string,
    navegador: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {

    // Verificar que el empleado existe
    const empleado = await empleadosRepository.buscarPorId(id);
    if (!empleado) {
      return {
        success: false,
        message: 'Empleado no encontrado'
      };
    }

    // Verificar teléfono si se proporciona
    if (datos.telefono) {
      const existeTelefono = await empleadosRepository.existeTelefono(datos.telefono, id);
      if (existeTelefono) {
        return {
          success: false,
          message: 'El teléfono ya está registrado por otro usuario'
        };
      }
    }

    // Editar empleado
    await empleadosRepository.editar(id, datos);

    // Registrar en historial
    const cambios = Object.keys(datos).join(', ');
    await authRepository.registrarAccion(
      id_usuario_editor,
      'usuario_editar',
      `Editó el usuario ${empleado.nombre} ${empleado.apellido}. Campos: ${cambios}`,
      direccion_ip,
      navegador
    );

    return {
      success: true,
      message: 'Empleado actualizado correctamente'
    };
  }

  // Actualizar foto del empleado
  async actualizarFoto(
    id: number,
    filename: string
  ): Promise<{ success: boolean; message: string; foto_url?: string }> {
    const empleado = await empleadosRepository.buscarPorId(id);
    if (!empleado) {
      return { success: false, message: 'Empleado no encontrado' };
    }
    await empleadosRepository.actualizarFoto(id, filename);
    const fotoUrl = `empleados/${filename}`;
    return {
      success: true,
      message: 'Foto actualizada correctamente',
      foto_url: fotoUrl
    };
  }

  // Resetear contraseña
  async resetearContrasena(
    id: number,
    datos: ResetearContrasenaRequest,
    id_usuario_resetea: number,
    direccion_ip: string,
    navegador: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {

    // Verificar que el empleado existe
    const empleado = await empleadosRepository.buscarPorId(id);
    if (!empleado) {
      return {
        success: false,
        message: 'Empleado no encontrado'
      };
    }

    // Validar contraseña
    if (!datos.contrasena_temporal || datos.contrasena_temporal.length < 6) {
      return {
        success: false,
        message: 'La contraseña temporal debe tener mínimo 6 caracteres'
      };
    }

    // Hashear nueva contraseña
    const nuevaContrasenaHash = await bcrypt.hash(datos.contrasena_temporal, 10);

    // Actualizar contraseña
    await empleadosRepository.resetearContrasena(id, nuevaContrasenaHash);

    // Registrar en historial
    await authRepository.registrarAccion(
      id_usuario_resetea,
      'usuario_resetear_password',
      `Reseteó la contraseña de ${empleado.nombre} ${empleado.apellido}`,
      direccion_ip,
      navegador
    );

    return {
      success: true,
      message: 'Contraseña reseteada correctamente'
    };
  }

  // Eliminar empleado
  async eliminar(
    id: number,
    id_usuario_elimina: number,
    direccion_ip: string,
    navegador: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const empleado = await empleadosRepository.buscarPorId(id);
    if (!empleado) {
      return {
        success: false,
        message: 'Empleado no encontrado'
      };
    }

    const tieneVentas = await empleadosRepository.tieneVentas(id);
    if (tieneVentas) {
      return {
        success: false,
        message: 'No se puede eliminar: el empleado tiene ventas registradas. Use "Desactivar" para deshabilitar su cuenta.'
      };
    }

    const eliminado = await empleadosRepository.eliminar(id);
    if (!eliminado) {
      return {
        success: false,
        message: 'No se pudo eliminar el empleado'
      };
    }

    await authRepository.registrarAccion(
      id_usuario_elimina,
      'usuario_eliminar',
      `Eliminó el usuario ${empleado.nombre} ${empleado.apellido} (${empleado.username})`,
      direccion_ip,
      navegador
    );

    return {
      success: true,
      message: 'Empleado eliminado correctamente'
    };
  }

  // Obtener estadísticas de empleado (para ver stats de otro usuario - requiere que exista)
  async obtenerEstadisticas(id: number): Promise<{
    success: boolean;
    estadisticas?: EstadisticasEmpleado;
    message?: string;
  }> {
    const empleado = await empleadosRepository.buscarPorId(id);
    if (!empleado) {
      return {
        success: false,
        message: 'Empleado no encontrado'
      };
    }

    const estadisticas = await empleadosRepository.obtenerEstadisticas(id);

    return {
      success: true,
      estadisticas
    };
  }

  // Obtener mis estadísticas (usuario autenticado: empleado o jefe - no valida rol)
  async obtenerMisEstadisticas(id_usuario: number): Promise<{
    success: boolean;
    estadisticas?: EstadisticasEmpleado;
    message?: string;
  }> {
    const estadisticas = await empleadosRepository.obtenerEstadisticas(id_usuario);
    return {
      success: true,
      estadisticas
    };
  }
}

export default new EmpleadosService();