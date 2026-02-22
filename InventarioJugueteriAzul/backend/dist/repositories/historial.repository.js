"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistorialRepository = void 0;
const database_1 = require("../config/database");
class HistorialRepository {
    async listar(filtros) {
        let sql = `
      SELECT ha.id, ha.id_usuario, ha.tipo_accion, ha.descripcion,
             ha.direccion_ip, ha.navegador, ha.fecha_creacion,
             u.nombre, u.apellido, r.nombre_rol, u.username
      FROM historial_acciones ha
      INNER JOIN usuarios u ON ha.id_usuario = u.id
      INNER JOIN roles r ON u.id_rol = r.id
      WHERE 1=1
    `;
        const params = [];
        if (filtros.fecha_inicio) {
            sql += ` AND DATE(ha.fecha_creacion) >= ?`;
            params.push(filtros.fecha_inicio);
        }
        if (filtros.fecha_fin) {
            sql += ` AND DATE(ha.fecha_creacion) <= ?`;
            params.push(filtros.fecha_fin);
        }
        if (filtros.id_usuario) {
            sql += ` AND ha.id_usuario = ?`;
            params.push(filtros.id_usuario);
        }
        if (filtros.tipo_accion) {
            sql += ` AND ha.tipo_accion = ?`;
            params.push(filtros.tipo_accion);
        }
        if (filtros.busqueda && filtros.busqueda.trim()) {
            sql += ` AND (
        ha.descripcion LIKE ? OR
        u.nombre LIKE ? OR u.apellido LIKE ? OR u.username LIKE ? OR
        CAST(ha.id AS CHAR) LIKE ?
      )`;
            const term = `%${filtros.busqueda.trim()}%`;
            params.push(term, term, term, term, term);
        }
        sql += ` ORDER BY ha.fecha_creacion DESC`;
        const resultado = await (0, database_1.query)(sql, params);
        return resultado;
    }
    async obtenerEstadisticasHoy() {
        const hoy = new Date().toISOString().split('T')[0];
        const [accionesResult, ventasResult, cambiosResult, usuariosResult] = await Promise.all([
            (0, database_1.query)(`SELECT COUNT(*) as total FROM historial_acciones WHERE DATE(fecha_creacion) = ?`, [hoy]),
            (0, database_1.query)(`SELECT COUNT(*) as total FROM historial_acciones 
         WHERE tipo_accion = 'venta' AND DATE(fecha_creacion) = ?`, [hoy]),
            (0, database_1.query)(`SELECT COUNT(*) as total FROM historial_acciones 
         WHERE tipo_accion IN ('producto_crear','producto_editar','categoria_crear','categoria_editar','usuario_crear','usuario_editar') 
         AND DATE(fecha_creacion) = ?`, [hoy]),
            (0, database_1.query)(`SELECT COUNT(DISTINCT id_usuario) as total FROM historial_acciones WHERE DATE(fecha_creacion) = ?`, [hoy])
        ]);
        return {
            acciones_hoy: accionesResult[0]?.total ?? 0,
            ventas_hoy: ventasResult[0]?.total ?? 0,
            cambios_guardados_hoy: cambiosResult[0]?.total ?? 0,
            usuarios_activos_hoy: usuariosResult[0]?.total ?? 0
        };
    }
}
exports.HistorialRepository = HistorialRepository;
exports.default = new HistorialRepository();
