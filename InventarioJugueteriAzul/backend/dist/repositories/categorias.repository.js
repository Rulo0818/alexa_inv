"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriasRepository = void 0;
const database_1 = require("../config/database");
class CategoriasRepository {
    // Listar categorías
    async listar(filtros) {
        let sql = `
      SELECT c.*, 
             COUNT(p.id) as cantidad_productos
      FROM categorias c
      LEFT JOIN productos p ON c.id = p.id_categoria AND p.activo = 1
      WHERE 1=1
    `;
        const params = [];
        if (filtros.activo !== undefined) {
            sql += ` AND c.activo = ?`;
            params.push(filtros.activo ? 1 : 0);
        }
        if (filtros.search) {
            sql += ` AND c.nombre LIKE ?`;
            params.push(`%${filtros.search}%`);
        }
        sql += ` GROUP BY c.id ORDER BY c.nombre ASC`;
        return await (0, database_1.query)(sql, params);
    }
    // Buscar por ID
    async buscarPorId(id) {
        const resultado = await (0, database_1.query)(`SELECT * FROM categorias WHERE id = ?`, [id]);
        if (resultado.length === 0)
            return null;
        return resultado[0];
    }
    // Verificar si nombre ya existe
    async existeNombre(nombre, excluirId) {
        let sql = `SELECT COUNT(*) as total FROM categorias WHERE nombre = ?`;
        const params = [nombre];
        if (excluirId) {
            sql += ` AND id != ?`;
            params.push(excluirId);
        }
        const resultado = await (0, database_1.query)(sql, params);
        return resultado[0].total > 0;
    }
    // Contar productos en categoría
    async contarProductos(id) {
        const resultado = await (0, database_1.query)(`SELECT COUNT(*) as total FROM productos WHERE id_categoria = ? AND activo = 1`, [id]);
        return resultado[0].total;
    }
    // Crear categoría
    async crear(datos) {
        const resultado = await (0, database_1.query)(`INSERT INTO categorias (nombre, emoji, activo) VALUES (?, ?, 1)`, [datos.nombre, datos.emoji || '📦']);
        return resultado.insertId;
    }
    // Editar categoría
    async editar(id, datos) {
        const campos = [];
        const valores = [];
        if (datos.nombre !== undefined) {
            campos.push('nombre = ?');
            valores.push(datos.nombre);
        }
        if (datos.emoji !== undefined) {
            campos.push('emoji = ?');
            valores.push(datos.emoji);
        }
        if (campos.length === 0)
            return;
        valores.push(id);
        const sql = `UPDATE categorias SET ${campos.join(', ')} WHERE id = ?`;
        await (0, database_1.query)(sql, valores);
    }
    // Eliminar categoría (desactivar)
    async eliminar(id) {
        await (0, database_1.query)(`UPDATE categorias SET activo = 0 WHERE id = ?`, [id]);
    }
}
exports.CategoriasRepository = CategoriasRepository;
exports.default = new CategoriasRepository();
