"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentasService = void 0;
const ventas_repository_1 = __importDefault(require("../repositories/ventas.repository"));
const productos_repository_1 = __importDefault(require("../repositories/productos.repository"));
const auth_repository_1 = __importDefault(require("../repositories/auth.repository"));
class VentasService {
    // Registrar venta
    async registrarVenta(datos, id_empleado, direccion_ip, navegador) {
        // Validaciones
        if (!datos.productos || datos.productos.length === 0) {
            return {
                success: false,
                message: 'Debe agregar al menos un producto'
            };
        }
        // Verificar stock de cada producto
        for (const prod of datos.productos) {
            const producto = await productos_repository_1.default.buscarPorId(prod.id_producto);
            if (!producto) {
                return {
                    success: false,
                    message: `Producto con ID ${prod.id_producto} no encontrado`
                };
            }
            if (producto.stock < prod.cantidad) {
                return {
                    success: false,
                    message: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}`
                };
            }
            if (prod.cantidad <= 0) {
                return {
                    success: false,
                    message: 'La cantidad debe ser mayor a 0'
                };
            }
        }
        // Calcular total
        let total = 0;
        for (const prod of datos.productos) {
            total += prod.precio_unitario * prod.cantidad;
        }
        // Fecha y hora en zona local (para que coincida con CURDATE() de MySQL)
        const ahora = new Date();
        const anio = ahora.getFullYear();
        const mes = String(ahora.getMonth() + 1).padStart(2, '0');
        const dia = String(ahora.getDate()).padStart(2, '0');
        const fecha = `${anio}-${mes}-${dia}`;
        const hora = ahora.toTimeString().split(' ')[0];
        // Registrar venta
        const venta_id = await ventas_repository_1.default.registrarVenta(id_empleado, total, datos.metodo_pago, fecha, hora);
        // Registrar detalle
        await ventas_repository_1.default.registrarDetalle(venta_id, datos.productos);
        // Los triggers actualizan el stock automáticamente
        // Registrar en historial
        const productosTexto = datos.productos.length === 1
            ? '1 producto'
            : `${datos.productos.length} productos`;
        await auth_repository_1.default.registrarAccion(id_empleado, 'venta', `Realizó una venta de ${productosTexto} por $${total.toFixed(2)} (${datos.metodo_pago})`, direccion_ip, navegador);
        return {
            success: true,
            message: 'Venta registrada correctamente',
            venta_id
        };
    }
    // Listar ventas
    async listar(filtros) {
        const ventas = await ventas_repository_1.default.listar(filtros);
        return {
            success: true,
            ventas
        };
    }
    // Buscar venta por ID
    async buscarPorId(id) {
        const venta = await ventas_repository_1.default.buscarPorId(id);
        if (!venta) {
            return {
                success: false,
                message: 'Venta no encontrada'
            };
        }
        return {
            success: true,
            venta
        };
    }
    // Cancelar venta
    async cancelar(id, datos, id_usuario, direccion_ip, navegador) {
        // Verificar que existe
        const venta = await ventas_repository_1.default.buscarPorId(id);
        if (!venta) {
            return {
                success: false,
                message: 'Venta no encontrada'
            };
        }
        // Verificar que no esté cancelada
        if (venta.cancelada) {
            return {
                success: false,
                message: 'Esta venta ya está cancelada'
            };
        }
        // Verificar tiempo (máximo 7 días)
        const puedeCancelarse = await ventas_repository_1.default.puedeCancelarse(id);
        if (!puedeCancelarse) {
            return {
                success: false,
                message: 'No se puede cancelar. Han pasado más de 7 días desde la venta'
            };
        }
        // Validar motivo
        if (!datos.motivo || datos.motivo.trim().length === 0) {
            return {
                success: false,
                message: 'Debe proporcionar un motivo de cancelación'
            };
        }
        // Cancelar venta (el trigger restaura el stock automáticamente)
        await ventas_repository_1.default.cancelar(id, datos.motivo, id_usuario);
        // Registrar en historial
        await auth_repository_1.default.registrarAccion(id_usuario, 'venta_cancelada', `Canceló la venta #${id}. Motivo: ${datos.motivo}`, direccion_ip, navegador);
        return {
            success: true,
            message: 'Venta cancelada correctamente. Stock restaurado.'
        };
    }
    // Obtener estadísticas
    async obtenerEstadisticas(filtros) {
        const estadisticas = await ventas_repository_1.default.obtenerEstadisticas(filtros);
        return {
            success: true,
            estadisticas
        };
    }
}
exports.VentasService = VentasService;
exports.default = new VentasService();
