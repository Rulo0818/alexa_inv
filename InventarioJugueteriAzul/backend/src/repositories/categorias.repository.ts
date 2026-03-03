import { query } from '../config/database';
import {
  Categoria,
  CrearCategoriaRequest,
  EditarCategoriaRequest,
  ListarCategoriasQuery,
  CategoriaConProductos
} from '../types/categoria.types';

export class CategoriasRepository {

  // Listar categorías
  async listar(filtros: ListarCategoriasQuery): Promise<CategoriaConProductos[]> {
    let sql = `
      SELECT c.*, 
             COUNT(p.id) as cantidad_productos
      FROM categorias c
      LEFT JOIN productos p ON c.id = p.id_categoria AND p.activo = 1
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filtros.activo !== undefined) {
      sql += ` AND c.activo = ?`;
      params.push(filtros.activo ? 1 : 0);
    }

    if (filtros.search) {
      sql += ` AND c.nombre LIKE ?`;
      params.push(`%${filtros.search}%`);
    }

    sql += ` GROUP BY c.id ORDER BY c.nombre ASC`;

    return await query(sql, params);
  }

  // Buscar por ID
  async buscarPorId(id: number): Promise<Categoria | null> {
    const resultado = await query(
      `SELECT * FROM categorias WHERE id = ?`,
      [id]
    );

    if (resultado.length === 0) return null;
    return resultado[0];
  }

  // Verificar si nombre ya existe
  async existeNombre(nombre: string, excluirId?: number): Promise<boolean> {
    let sql = `SELECT COUNT(*) as total FROM categorias WHERE nombre = ?`;
    const params: any[] = [nombre];

    if (excluirId) {
      sql += ` AND id != ?`;
      params.push(excluirId);
    }

    const resultado = await query(sql, params);
    return resultado[0].total > 0;
  }

  // Contar productos en categoría
  async contarProductos(id: number): Promise<number> {
    const resultado = await query(
      `SELECT COUNT(*) as total FROM productos WHERE id_categoria = ? AND activo = 1`,
      [id]
    );
    return resultado[0].total;
  }

  // Crear categoría
  async crear(datos: CrearCategoriaRequest): Promise<number> {
    const resultado = await query(
      `INSERT INTO categorias (nombre, emoji, activo) VALUES (?, ?, 1)`,
      [datos.nombre, datos.emoji || '📦']
    );
    return resultado.insertId;
  }

  // Editar categoría
  async editar(id: number, datos: EditarCategoriaRequest): Promise<void> {
    const campos: string[] = [];
    const valores: any[] = [];

    if (datos.nombre !== undefined) {
      campos.push('nombre = ?');
      valores.push(datos.nombre);
    }

    if (datos.emoji !== undefined) {
      campos.push('emoji = ?');
      valores.push(datos.emoji);
    }

    if (campos.length === 0) return;

    valores.push(id);
    const sql = `UPDATE categorias SET ${campos.join(', ')} WHERE id = ?`;

    await query(sql, valores);
  }

  // Eliminar categoría (desactivar)
  async eliminar(id: number): Promise<void> {
    await query(
      `UPDATE categorias SET activo = 0 WHERE id = ?`,
      [id]
    );
  }
}

export default new CategoriasRepository();