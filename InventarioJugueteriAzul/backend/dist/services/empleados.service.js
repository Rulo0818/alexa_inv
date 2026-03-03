"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpleadosService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const empleados_repository_1 = __importDefault(require("../repositories/empleados.repository"));
const auth_repository_1 = __importDefault(require("../repositories/auth.repository"));
class EmpleadosService {
    // Generar username
    generarUsername(nombre, apellido, rol) {
        const nombreLimpio = nombre.trim().toLowerCase().replace(/\s+/g, '_');
        const apellidoLimpio = apellido.trim().toLowerCase().replace(/\s+/g, '_');
        const sufijo = rol === 'jefe' ? 'AJA' : 'EJA';
        return `${nombreLimpio}_${apellidoLimpio}${sufijo}`;
    }
    // Resumen para tarjetas
    async obtenerResumen() {
        const resumen = await empleados_repository_1.default.obtenerResumen();
        return { success: true, resumen };
    }
    // Listar empleados
    async listar(filtros) {
        const empleados = await empleados_repository_1.default.listar(filtros);
        const total = await empleados_repository_1.default.contar(filtros);
        return {
            success: true,
            empleados,
            total
        };
    }
    // Buscar empleado por ID
    async buscarPorId(id) {
        const empleado = await empleados_repository_1.default.buscarPorId(id);
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
    async crear(datos, id_usuario_creador, direccion_ip, navegador) {
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
        const existeUsername = await empleados_repository_1.default.existeUsername(username);
        if (existeUsername) {
            return {
                success: false,
                message: `El username ${username} ya existe. Intenta con otro nombre o apellido.`
            };
        }
        // Verificar teléfono si se proporciona
        if (datos.telefono) {
            const existeTelefono = await empleados_repository_1.default.existeTelefono(datos.telefono);
            if (existeTelefono) {
                return {
                    success: false,
                    message: 'El teléfono ya está registrado'
                };
            }
        }
        // Hashear contraseña
        const contrasenaHash = await bcrypt_1.default.hash(datos.contrasena_temporal, 10);
        // Crear empleado
        const empleado_id = await empleados_repository_1.default.crear(datos, username, contrasenaHash, undefined);
        // Registrar en historial
        await auth_repository_1.default.registrarAccion(id_usuario_creador, 'usuario_crear', `Creó el usuario ${datos.nombre} ${datos.apellido} (${username})`, direccion_ip, navegador);
        return {
            success: true,
            message: 'Empleado creado correctamente',
            empleado_id,
            username
        };
    }
    // Editar empleado
    async editar(id, datos, id_usuario_editor, direccion_ip, navegador) {
        // Verificar que el empleado existe
        const empleado = await empleados_repository_1.default.buscarPorId(id);
        if (!empleado) {
            return {
                success: false,
                message: 'Empleado no encontrado'
            };
        }
        // Verificar teléfono si se proporciona
        if (datos.telefono) {
            const existeTelefono = await empleados_repository_1.default.existeTelefono(datos.telefono, id);
            if (existeTelefono) {
                return {
                    success: false,
                    message: 'El teléfono ya está registrado por otro usuario'
                };
            }
        }
        // Editar empleado
        await empleados_repository_1.default.editar(id, datos);
        // Registrar en historial
        const cambios = Object.keys(datos).join(', ');
        await auth_repository_1.default.registrarAccion(id_usuario_editor, 'usuario_editar', `Editó el usuario ${empleado.nombre} ${empleado.apellido}. Campos: ${cambios}`, direccion_ip, navegador);
        return {
            success: true,
            message: 'Empleado actualizado correctamente'
        };
    }
    // Actualizar foto del empleado
    async actualizarFoto(id, filename) {
        const empleado = await empleados_repository_1.default.buscarPorId(id);
        if (!empleado) {
            return { success: false, message: 'Empleado no encontrado' };
        }
        await empleados_repository_1.default.actualizarFoto(id, filename);
        const fotoUrl = `empleados/${filename}`;
        return {
            success: true,
            message: 'Foto actualizada correctamente',
            foto_url: fotoUrl
        };
    }
    // Resetear contraseña
    async resetearContrasena(id, datos, id_usuario_resetea, direccion_ip, navegador) {
        // Verificar que el empleado existe
        const empleado = await empleados_repository_1.default.buscarPorId(id);
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
        const nuevaContrasenaHash = await bcrypt_1.default.hash(datos.contrasena_temporal, 10);
        // Actualizar contraseña
        await empleados_repository_1.default.resetearContrasena(id, nuevaContrasenaHash);
        // Registrar en historial
        await auth_repository_1.default.registrarAccion(id_usuario_resetea, 'usuario_resetear_password', `Reseteó la contraseña de ${empleado.nombre} ${empleado.apellido}`, direccion_ip, navegador);
        return {
            success: true,
            message: 'Contraseña reseteada correctamente'
        };
    }
    // Eliminar empleado
    async eliminar(id, id_usuario_elimina, direccion_ip, navegador) {
        const empleado = await empleados_repository_1.default.buscarPorId(id);
        if (!empleado) {
            return {
                success: false,
                message: 'Empleado no encontrado'
            };
        }
        const tieneVentas = await empleados_repository_1.default.tieneVentas(id);
        if (tieneVentas) {
            return {
                success: false,
                message: 'No se puede eliminar: el empleado tiene ventas registradas. Use "Desactivar" para deshabilitar su cuenta.'
            };
        }
        const eliminado = await empleados_repository_1.default.eliminar(id);
        if (!eliminado) {
            return {
                success: false,
                message: 'No se pudo eliminar el empleado'
            };
        }
        await auth_repository_1.default.registrarAccion(id_usuario_elimina, 'usuario_eliminar', `Eliminó el usuario ${empleado.nombre} ${empleado.apellido} (${empleado.username})`, direccion_ip, navegador);
        return {
            success: true,
            message: 'Empleado eliminado correctamente'
        };
    }
    // Obtener estadísticas de empleado (para ver stats de otro usuario - requiere que exista)
    async obtenerEstadisticas(id) {
        const empleado = await empleados_repository_1.default.buscarPorId(id);
        if (!empleado) {
            return {
                success: false,
                message: 'Empleado no encontrado'
            };
        }
        const estadisticas = await empleados_repository_1.default.obtenerEstadisticas(id);
        return {
            success: true,
            estadisticas
        };
    }
    // Obtener mis estadísticas (usuario autenticado: empleado o jefe - no valida rol)
    async obtenerMisEstadisticas(id_usuario) {
        const estadisticas = await empleados_repository_1.default.obtenerEstadisticas(id_usuario);
        return {
            success: true,
            estadisticas
        };
    }
}
exports.EmpleadosService = EmpleadosService;
exports.default = new EmpleadosService();
