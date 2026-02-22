"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriasService = void 0;
const categorias_repository_1 = __importDefault(require("../repositories/categorias.repository"));
const auth_repository_1 = __importDefault(require("../repositories/auth.repository"));
class CategoriasService {
    // Listar categorías
    async listar(filtros) {
        const categorias = await categorias_repository_1.default.listar(filtros);
        return {
            success: true,
            categorias
        };
    }
    // Buscar por ID
    async buscarPorId(id) {
        const categoria = await categorias_repository_1.default.buscarPorId(id);
        if (!categoria) {
            return {
                success: false,
                message: 'Categoría no encontrada'
            };
        }
        const cantidadProductos = await categorias_repository_1.default.contarProductos(id);
        return {
            success: true,
            categoria: {
                ...categoria,
                cantidad_productos: cantidadProductos
            }
        };
    }
    // Crear categoría
    async crear(datos, id_usuario, direccion_ip, navegador) {
        // Validar nombre
        if (!datos.nombre || datos.nombre.trim().length === 0) {
            return {
                success: false,
                message: 'El nombre de la categoría es requerido'
            };
        }
        // Verificar si ya existe
        const existe = await categorias_repository_1.default.existeNombre(datos.nombre);
        if (existe) {
            return {
                success: false,
                message: 'Ya existe una categoría con ese nombre'
            };
        }
        // Crear categoría
        const categoria_id = await categorias_repository_1.default.crear(datos);
        // Registrar en historial
        await auth_repository_1.default.registrarAccion(id_usuario, 'categoria_crear', `Creó la categoría "${datos.nombre}" ${datos.emoji || ''}`, direccion_ip, navegador);
        return {
            success: true,
            message: 'Categoría creada correctamente',
            categoria_id
        };
    }
    // Editar categoría
    async editar(id, datos, id_usuario, direccion_ip, navegador) {
        // Verificar que existe
        const categoria = await categorias_repository_1.default.buscarPorId(id);
        if (!categoria) {
            return {
                success: false,
                message: 'Categoría no encontrada'
            };
        }
        // Verificar nombre si se está cambiando
        if (datos.nombre && datos.nombre !== categoria.nombre) {
            const existe = await categorias_repository_1.default.existeNombre(datos.nombre, id);
            if (existe) {
                return {
                    success: false,
                    message: 'Ya existe una categoría con ese nombre'
                };
            }
        }
        // Editar categoría
        await categorias_repository_1.default.editar(id, datos);
        // Registrar en historial
        const cambios = Object.keys(datos).join(', ');
        await auth_repository_1.default.registrarAccion(id_usuario, 'categoria_editar', `Editó la categoría "${categoria.nombre}". Campos: ${cambios}`, direccion_ip, navegador);
        return {
            success: true,
            message: 'Categoría actualizada correctamente'
        };
    }
    // Eliminar categoría
    async eliminar(id, id_usuario, direccion_ip, navegador) {
        // Verificar que existe
        const categoria = await categorias_repository_1.default.buscarPorId(id);
        if (!categoria) {
            return {
                success: false,
                message: 'Categoría no encontrada'
            };
        }
        // Verificar que no tenga productos
        const cantidadProductos = await categorias_repository_1.default.contarProductos(id);
        if (cantidadProductos > 0) {
            return {
                success: false,
                message: `No se puede eliminar. Esta categoría tiene ${cantidadProductos} producto(s) activo(s)`
            };
        }
        // Eliminar (desactivar)
        await categorias_repository_1.default.eliminar(id);
        // Registrar en historial
        await auth_repository_1.default.registrarAccion(id_usuario, 'categoria_eliminar', `Eliminó la categoría "${categoria.nombre}"`, direccion_ip, navegador);
        return {
            success: true,
            message: 'Categoría eliminada correctamente'
        };
    }
}
exports.CategoriasService = CategoriasService;
exports.default = new CategoriasService();
