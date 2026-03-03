"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpleadosRepository = void 0;
const database_1 = require("../config/database");
class EmpleadosRepository {
    // Listar empleados con filtros
    async listar(filtros) {
        let sql = `
      SELECT u.id, u.username, u.nombre, u.apellido, u.edad, 
             u.telefono, u.domicilio, r.nombre_rol, u.activo, u.fecha_creacion, u.foto_url,
             (SELECT COUNT(*) FROM ventas v 
              WHERE v.id_empleado = u.id AND DATE(v.fecha) = CURDATE() AND v.cancelada = 0) as ventas_hoy,
             (SELECT COUNT(*) FROM ventas v 
              WHERE v.id_empleado = u.id AND v.cancelada = 0) as ventas_totales
      FROM usuarios u
      INNER JOIN roles r ON u.id_rol = r.id
      WHERE 1=1
    `;
        const params = [];
        if (filtros.rol) {
            sql += ` AND r.nombre_rol = ?`;
            params.push(filtros.rol);
        }
        if (filtros.activo !== undefined) {
            sql += ` AND u.activo = ?`;
            params.push(filtros.activo ? 1 : 0);
        }
        if (filtros.search) {
            sql += ` AND (u.nombre LIKE ? OR u.apellido LIKE ? OR u.username LIKE ? OR u.telefono LIKE ?)`;
            const searchParam = `%${filtros.search}%`;
            params.push(searchParam, searchParam, searchParam, searchParam);
        }
        sql += ` ORDER BY u.fecha_creacion DESC`;
        return await (0, database_1.query)(sql, params);
    }
    // Buscar empleado por ID
    async buscarPorId(id) {
        const resultado = await (0, database_1.query)(`SELECT u.id, u.username, u.nombre, u.apellido, u.edad, 
              u.telefono, u.domicilio, r.nombre_rol, u.activo, u.fecha_creacion,
              u.foto_url
       FROM usuarios u
       INNER JOIN roles r ON u.id_rol = r.id
       WHERE u.id = ?`, [id]);
        if (resultado.length === 0)
            return null;
        return resultado[0];
    }
    // Verificar si username ya existe
    async existeUsername(username) {
        const resultado = await (0, database_1.query)(`SELECT COUNT(*) as total FROM usuarios WHERE username = ?`, [username]);
        return resultado[0].total > 0;
    }
    // Verificar si teléfono ya existe
    async existeTelefono(telefono, excluirId) {
        let sql = `SELECT COUNT(*) as total FROM usuarios WHERE telefono = ?`;
        const params = [telefono];
        if (excluirId) {
            sql += ` AND id != ?`;
            params.push(excluirId);
        }
        const resultado = await (0, database_1.query)(sql, params);
        return resultado[0].total > 0;
    }
    // Crear empleado
    async crear(datos, username, contrasenaHash, fotoUrl) {
        const activo = datos.activo !== false ? 1 : 0;
        const resultado = await (0, database_1.query)(`INSERT INTO usuarios 
       (id_rol, username, contrasena, nombre, apellido, edad, telefono, domicilio, 
        requiere_cambio_contrasena, activo, foto_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`, [
            datos.id_rol,
            username,
            contrasenaHash,
            datos.nombre,
            datos.apellido,
            datos.edad || null,
            datos.telefono || null,
            datos.domicilio || null,
            activo,
            fotoUrl || null
        ]);
        return resultado.insertId;
    }
    // Editar empleado
    async editar(id, datos) {
        const campos = [];
        const valores = [];
        if (datos.nombre !== undefined) {
            campos.push('nombre = ?');
            valores.push(datos.nombre);
        }
        if (datos.apellido !== undefined) {
            campos.push('apellido = ?');
            valores.push(datos.apellido);
        }
        if (datos.edad !== undefined) {
            campos.push('edad = ?');
            valores.push(datos.edad);
        }
        if (datos.telefono !== undefined) {
            campos.push('telefono = ?');
            valores.push(datos.telefono);
        }
        if (datos.domicilio !== undefined) {
            campos.push('domicilio = ?');
            valores.push(datos.domicilio);
        }
        if (datos.activo !== undefined) {
            campos.push('activo = ?');
            valores.push(datos.activo ? 1 : 0);
        }
        if (datos.foto_url !== undefined) {
            campos.push('foto_url = ?');
            valores.push(datos.foto_url || null);
        }
        if (campos.length === 0)
            return;
        valores.push(id);
        const sql = `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`;
        await (0, database_1.query)(sql, valores);
    }
    // Actualizar foto
    async actualizarFoto(id, filename) {
        const fotoUrl = `empleados/${filename}`;
        await (0, database_1.query)(`UPDATE usuarios SET foto_url = ? WHERE id = ?`, [fotoUrl, id]);
    }
    // Verificar si el empleado tiene ventas
    async tieneVentas(id) {
        const resultado = await (0, database_1.query)(`SELECT COUNT(*) as total FROM ventas WHERE id_empleado = ?`, [id]);
        return (resultado[0]?.total ?? 0) > 0;
    }
    // Eliminar empleado (borrado físico) - solo si no tiene ventas
    async eliminar(id) {
        const resultado = await (0, database_1.query)(`DELETE FROM usuarios WHERE id = ?`, [id]);
        return resultado.affectedRows > 0;
    }
    // Resetear contraseña
    async resetearContrasena(id, nuevaContrasenaHash) {
        await (0, database_1.query)(`UPDATE usuarios 
       SET contrasena = ?, requiere_cambio_contrasena = 1
       WHERE id = ?`, [nuevaContrasenaHash, id]);
    }
    // Obtener estadísticas de empleado/jefe (por id de usuario)
    async obtenerEstadisticas(id) {
        const [hoyResult, totalResult, ultimaResult] = await Promise.all([
            (0, database_1.query)(`SELECT 
           COUNT(*) as ventas_hoy,
           COALESCE(SUM(total), 0) as total_vendido
         FROM ventas
         WHERE id_empleado = ? 
           AND DATE(fecha) = CURDATE()
           AND cancelada = 0`, [id]),
            (0, database_1.query)(`SELECT COALESCE(SUM(total), 0) as total_historico
         FROM ventas
         WHERE id_empleado = ? AND cancelada = 0`, [id]),
            (0, database_1.query)(`SELECT COALESCE(MAX(fecha_creacion), MAX(CONCAT(fecha, ' ', hora))) as ultima_venta
         FROM ventas
         WHERE id_empleado = ? AND cancelada = 0`, [id])
        ]);
        return {
            ventas_hoy: hoyResult[0]?.ventas_hoy ?? 0,
            total_vendido: parseFloat(hoyResult[0]?.total_vendido ?? 0),
            total_vendido_historico: parseFloat(totalResult[0]?.total_historico ?? 0),
            ultima_venta: ultimaResult[0]?.ultima_venta ?? null
        };
    }
    // Resumen para tarjetas (total, activos, ventas hoy, jefes)
    async obtenerResumen() {
        const [totalRes, activosRes, ventasRes, jefesRes] = await Promise.all([
            (0, database_1.query)(`SELECT COUNT(*) as total FROM usuarios`),
            (0, database_1.query)(`SELECT COUNT(*) as total FROM usuarios WHERE activo = 1`),
            (0, database_1.query)(`SELECT COUNT(*) as total FROM ventas WHERE DATE(fecha) = CURDATE() AND cancelada = 0`),
            (0, database_1.query)(`SELECT COUNT(*) as total FROM usuarios u INNER JOIN roles r ON u.id_rol = r.id WHERE r.nombre_rol = 'jefe'`)
        ]);
        return {
            total: totalRes[0]?.total ?? 0,
            activos: activosRes[0]?.total ?? 0,
            ventas_hoy: ventasRes[0]?.total ?? 0,
            jefes: jefesRes[0]?.total ?? 0
        };
    }
    // Contar empleados
    async contar(filtros) {
        let sql = `SELECT COUNT(*) as total FROM usuarios u INNER JOIN roles r ON u.id_rol = r.id WHERE 1=1`;
        const params = [];
        if (filtros.rol) {
            sql += ` AND r.nombre_rol = ?`;
            params.push(filtros.rol);
        }
        if (filtros.activo !== undefined) {
            sql += ` AND u.activo = ?`;
            params.push(filtros.activo ? 1 : 0);
        }
        const resultado = await (0, database_1.query)(sql, params);
        return resultado[0].total;
    }
}
exports.EmpleadosRepository = EmpleadosRepository;
exports.default = new EmpleadosRepository();
