"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentasRepository = void 0;
const database_1 = require("../config/database");
class VentasRepository {
    // Registrar venta
    async registrarVenta(id_empleado, total, metodo_pago, fecha, hora) {
        const resultado = await (0, database_1.query)(`INSERT INTO ventas (id_empleado, total, metodo_pago, fecha, hora, cancelada)
       VALUES (?, ?, ?, ?, ?, 0)`, [id_empleado, total, metodo_pago, fecha, hora]);
        return resultado.insertId;
    }
    // Registrar detalle de venta
    async registrarDetalle(id_venta, productos) {
        for (const prod of productos) {
            await (0, database_1.query)(`INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?)`, [id_venta, prod.id_producto, prod.cantidad, prod.precio_unitario, prod.cantidad * prod.precio_unitario]);
        }
    }
    // Listar ventas
    async listar(filtros) {
        let sql = `
      SELECT v.*, 
             u.nombre as nombre_empleado, 
             u.apellido as apellido_empleado
      FROM ventas v
      INNER JOIN usuarios u ON v.id_empleado = u.id
      WHERE 1=1
    `;
        const params = [];
        if (filtros.fecha_inicio) {
            sql += ` AND v.fecha >= ?`;
            params.push(filtros.fecha_inicio);
        }
        if (filtros.fecha_fin) {
            sql += ` AND v.fecha <= ?`;
            params.push(filtros.fecha_fin);
        }
        if (filtros.id_empleado) {
            sql += ` AND v.id_empleado = ?`;
            params.push(filtros.id_empleado);
        }
        if (filtros.metodo_pago) {
            sql += ` AND v.metodo_pago = ?`;
            params.push(filtros.metodo_pago);
        }
        if (filtros.cancelada !== undefined) {
            sql += ` AND v.cancelada = ?`;
            params.push(filtros.cancelada ? 1 : 0);
        }
        sql += ` ORDER BY v.fecha_creacion DESC`;
        const ventas = await (0, database_1.query)(sql, params);
        // Obtener productos de cada venta
        for (const venta of ventas) {
            const productos = await (0, database_1.query)(`SELECT dv.*, p.nombre, p.codigo
         FROM detalle_ventas dv
         INNER JOIN productos p ON dv.id_producto = p.id
         WHERE dv.id_venta = ?`, [venta.id]);
            venta.productos = productos;
        }
        return ventas;
    }
    // Buscar venta por ID
    async buscarPorId(id) {
        const resultado = await (0, database_1.query)(`SELECT v.*, 
              u.nombre as nombre_empleado, 
              u.apellido as apellido_empleado
       FROM ventas v
       INNER JOIN usuarios u ON v.id_empleado = u.id
       WHERE v.id = ?`, [id]);
        if (resultado.length === 0)
            return null;
        const venta = resultado[0];
        // Obtener productos
        const productos = await (0, database_1.query)(`SELECT dv.*, p.nombre, p.codigo
       FROM detalle_ventas dv
       INNER JOIN productos p ON dv.id_producto = p.id
       WHERE dv.id_venta = ?`, [id]);
        venta.productos = productos;
        return venta;
    }
    // Cancelar venta
    async cancelar(id, motivo, cancelada_por) {
        await (0, database_1.query)(`UPDATE ventas 
       SET cancelada = 1, 
           motivo_cancelacion = ?, 
           cancelada_por = ?, 
           fecha_cancelacion = NOW()
       WHERE id = ?`, [motivo, cancelada_por, id]);
    }
    // Verificar si venta puede cancelarse (máximo 7 días)
    async puedeCancelarse(id) {
        const resultado = await (0, database_1.query)(`SELECT DATEDIFF(NOW(), fecha_creacion) as dias FROM ventas WHERE id = ?`, [id]);
        if (resultado.length === 0)
            return false;
        return resultado[0].dias <= 7;
    }
    // Obtener estadísticas
    async obtenerEstadisticas(filtros) {
        let whereClause = 'WHERE v.cancelada = 0';
        const params = [];
        if (filtros.fecha_inicio) {
            whereClause += ` AND v.fecha >= ?`;
            params.push(filtros.fecha_inicio);
        }
        if (filtros.fecha_fin) {
            whereClause += ` AND v.fecha <= ?`;
            params.push(filtros.fecha_fin);
        }
        // Totales
        const totalesResult = await (0, database_1.query)(`SELECT 
         SUM(total) as total_ventas,
         COUNT(*) as ventas_realizadas,
         AVG(total) as promedio_venta,
         SUM(CASE WHEN metodo_pago = 'efectivo' THEN total ELSE 0 END) as ventas_efectivo,
         SUM(CASE WHEN metodo_pago = 'transferencia' THEN total ELSE 0 END) as ventas_transferencia
       FROM ventas v ${whereClause}`, params);
        const totales = totalesResult[0];
        const totalVentas = parseFloat(totales.total_ventas) || 0;
        // Top productos
        const topProductos = await (0, database_1.query)(`SELECT p.nombre, p.codigo,
              SUM(dv.cantidad) as cantidad_vendida,
              SUM(dv.subtotal) as total_vendido
       FROM detalle_ventas dv
       INNER JOIN productos p ON dv.id_producto = p.id
       INNER JOIN ventas v ON dv.id_venta = v.id
       ${whereClause}
       GROUP BY p.id, p.nombre, p.codigo
       ORDER BY cantidad_vendida DESC
       LIMIT 5`, params);
        // Ventas por empleado
        const ventasPorEmpleado = await (0, database_1.query)(`SELECT u.nombre, u.apellido,
              COUNT(v.id) as cantidad_ventas,
              SUM(v.total) as total_vendido
       FROM ventas v
       INNER JOIN usuarios u ON v.id_empleado = u.id
       ${whereClause}
       GROUP BY u.id, u.nombre, u.apellido
       ORDER BY total_vendido DESC`, params);
        return {
            total_ventas: totalVentas,
            ventas_realizadas: totales.ventas_realizadas,
            promedio_venta: parseFloat(totales.promedio_venta) || 0,
            ventas_efectivo: parseFloat(totales.ventas_efectivo) || 0,
            ventas_transferencia: parseFloat(totales.ventas_transferencia) || 0,
            porcentaje_efectivo: totalVentas > 0 ? (parseFloat(totales.ventas_efectivo) / totalVentas) * 100 : 0,
            porcentaje_transferencia: totalVentas > 0 ? (parseFloat(totales.ventas_transferencia) / totalVentas) * 100 : 0,
            top_productos: topProductos.map((p) => ({
                nombre: p.nombre,
                codigo: p.codigo,
                cantidad_vendida: p.cantidad_vendida,
                total_vendido: parseFloat(p.total_vendido)
            })),
            ventas_por_empleado: ventasPorEmpleado.map((e) => ({
                nombre: e.nombre,
                apellido: e.apellido,
                cantidad_ventas: e.cantidad_ventas,
                total_vendido: parseFloat(e.total_vendido)
            }))
        };
    }
}
exports.VentasRepository = VentasRepository;
exports.default = new VentasRepository();
