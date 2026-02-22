"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductosService = void 0;
const productos_repository_1 = __importDefault(require("../repositories/productos.repository"));
const categorias_repository_1 = __importDefault(require("../repositories/categorias.repository"));
const auth_repository_1 = __importDefault(require("../repositories/auth.repository"));
class ProductosService {
    // Listar productos
    async listar(filtros) {
        const productos = await productos_repository_1.default.listar(filtros);
        return {
            success: true,
            productos
        };
    }
    // Buscar por ID
    async buscarPorId(id) {
        const producto = await productos_repository_1.default.buscarPorId(id);
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
    async buscarPorCodigo(codigo) {
        const producto = await productos_repository_1.default.buscarPorCodigo(codigo);
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
    async crear(datos, id_usuario, direccion_ip, navegador) {
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
        const categoria = await categorias_repository_1.default.buscarPorId(datos.id_categoria);
        if (!categoria) {
            return {
                success: false,
                message: 'La categoría seleccionada no existe'
            };
        }
        // Generar código automático
        const codigo = await productos_repository_1.default.generarCodigo();
        // Crear producto
        const producto_id = await productos_repository_1.default.crear(datos, codigo);
        // Registrar en historial
        await auth_repository_1.default.registrarAccion(id_usuario, 'producto_crear', `Creó el producto "${datos.nombre}" (${codigo})`, direccion_ip, navegador);
        return {
            success: true,
            message: 'Producto creado correctamente',
            producto_id,
            codigo
        };
    }
    // Editar producto
    async editar(id, datos, id_usuario, direccion_ip, navegador) {
        // Verificar que existe
        const producto = await productos_repository_1.default.buscarPorId(id);
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
        }
        else if (datos.precio_de_venta !== undefined && datos.precio_de_venta <= producto.precio_de_compra) {
            return {
                success: false,
                message: 'El precio de venta debe ser mayor al precio de compra'
            };
        }
        else if (datos.precio_de_compra !== undefined && producto.precio_de_venta <= datos.precio_de_compra) {
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
            const categoria = await categorias_repository_1.default.buscarPorId(datos.id_categoria);
            if (!categoria) {
                return {
                    success: false,
                    message: 'La categoría seleccionada no existe'
                };
            }
        }
        // Editar producto
        await productos_repository_1.default.editar(id, datos);
        // Registrar en historial
        const cambios = Object.keys(datos).join(', ');
        await auth_repository_1.default.registrarAccion(id_usuario, 'producto_editar', `Editó el producto "${producto.nombre}". Campos: ${cambios}`, direccion_ip, navegador);
        return {
            success: true,
            message: 'Producto actualizado correctamente'
        };
    }
    // Eliminar producto
    async eliminar(id, id_usuario, direccion_ip, navegador) {
        // Verificar que existe
        const producto = await productos_repository_1.default.buscarPorId(id);
        if (!producto) {
            return {
                success: false,
                message: 'Producto no encontrado'
            };
        }
        // Eliminar (soft delete)
        await productos_repository_1.default.eliminar(id);
        // Registrar en historial
        await auth_repository_1.default.registrarAccion(id_usuario, 'producto_eliminar', `Eliminó el producto "${producto.nombre}" (${producto.codigo})`, direccion_ip, navegador);
        return {
            success: true,
            message: 'Producto eliminado correctamente'
        };
    }
    // Obtener estadísticas
    async obtenerEstadisticas() {
        const estadisticas = await productos_repository_1.default.obtenerEstadisticas();
        return {
            success: true,
            estadisticas
        };
    }
}
exports.ProductosService = ProductosService;
exports.default = new ProductosService();
