import { query } from '../config/database';
import {
  Producto,
  ProductoConCategoria,
  CrearProductoRequest,
  EditarProductoRequest,
  ListarProductosQuery,
  EstadisticasInventario
} from '../types/producto.types';

export class ProductosRepository {

  // Generar siguiente código automático
  async generarCodigo(): Promise<string> {
    await query(`UPDATE secuencia_productos SET ultimo_numero = ultimo_numero + 1`);
    const resultado = await query(`SELECT ultimo_numero FROM secuencia_productos`);
    const numero = resultado[0].ultimo_numero;
    return `J${String(numero).padStart(4, '0')}`;
  }

  // Listar productos
  async listar(filtros: ListarProductosQuery): Promise<ProductoConCategoria[]> {
    let sql = `
      SELECT p.*, c.nombre as nombre_categoria, c.emoji as emoji_categoria
      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filtros.categoria) {
      sql += ` AND p.id_categoria = ?`;
      params.push(filtros.categoria);
    }

    if (filtros.activo !== undefined) {
      sql += ` AND p.activo = ?`;
      params.push(filtros.activo ? 1 : 0);
    }

    if (filtros.estado) {
      sql += ` AND p.estado = ?`;
      params.push(filtros.estado);
    }

    if (filtros.stock_bajo) {
      sql += ` AND p.stock < p.stock_minimo AND p.stock > 0`;
    }

    if (filtros.search) {
      sql += ` AND (p.nombre LIKE ? OR p.codigo LIKE ?)`;
      const searchParam = `%${filtros.search}%`;
      params.push(searchParam, searchParam);
    }

    sql += ` ORDER BY p.nombre ASC`;

    return await query(sql, params);
  }

  // Buscar por ID
  async buscarPorId(id: number): Promise<ProductoConCategoria | null> {
    const resultado = await query(
      `SELECT p.*, c.nombre as nombre_categoria, c.emoji as emoji_categoria
       FROM productos p
       INNER JOIN categorias c ON p.id_categoria = c.id
       WHERE p.id = ?`,
      [id]
    );

    if (resultado.length === 0) return null;
    return resultado[0];
  }

  // Buscar por código
  async buscarPorCodigo(codigo: string): Promise<ProductoConCategoria | null> {
    const resultado = await query(
      `SELECT p.*, c.nombre as nombre_categoria, c.emoji as emoji_categoria
       FROM productos p
       INNER JOIN categorias c ON p.id_categoria = c.id
       WHERE p.codigo = ?`,
      [codigo]
    );

    if (resultado.length === 0) return null;
    return resultado[0];
  }

  // Verificar si código existe
  async existeCodigo(codigo: string): Promise<boolean> {
    const resultado = await query(
      `SELECT COUNT(*) as total FROM productos WHERE codigo = ?`,
      [codigo]
    );
    return resultado[0].total > 0;
  }

  // Crear producto
  async crear(datos: CrearProductoRequest, codigo: string): Promise<number> {
    const resultado = await query(
      `INSERT INTO productos 
       (codigo, nombre, id_categoria, precio_de_compra, precio_de_venta, 
        stock, stock_minimo, estado, descuento_porcentaje, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        codigo,
        datos.nombre,
        datos.id_categoria,
        Number(datos.precio_de_compra),
        Number(datos.precio_de_venta),
        Math.max(1, Math.floor(Number(datos.stock))),
        Math.max(0, Math.floor(Number(datos.stock_minimo ?? 5))),
        datos.estado || 'bueno',
        Math.min(100, Math.max(0, Number(datos.descuento_porcentaje) || 0))
      ]
    );

    return resultado.insertId;
  }

  // Editar producto
  async editar(id: number, datos: EditarProductoRequest): Promise<void> {
    const campos: string[] = [];
    const valores: any[] = [];

    if (datos.nombre !== undefined) {
      campos.push('nombre = ?');
      valores.push(datos.nombre);
    }
    if (datos.id_categoria !== undefined) {
      campos.push('id_categoria = ?');
      valores.push(datos.id_categoria);
    }
    if (datos.precio_de_compra !== undefined) {
      campos.push('precio_de_compra = ?');
      valores.push(datos.precio_de_compra);
    }
    if (datos.precio_de_venta !== undefined) {
      campos.push('precio_de_venta = ?');
      valores.push(datos.precio_de_venta);
    }
    if (datos.stock !== undefined) {
      campos.push('stock = ?');
      valores.push(datos.stock);
    }
    if (datos.stock_minimo !== undefined) {
      campos.push('stock_minimo = ?');
      valores.push(datos.stock_minimo);
    }
    if (datos.estado !== undefined) {
      campos.push('estado = ?');
      valores.push(datos.estado);
    }
    if (datos.descuento_porcentaje !== undefined) {
      campos.push('descuento_porcentaje = ?');
      valores.push(datos.descuento_porcentaje);
    }

    if (campos.length === 0) return;

    valores.push(id);
    const sql = `UPDATE productos SET ${campos.join(', ')} WHERE id = ?`;

    await query(sql, valores);
  }

  // Eliminar (soft delete)
  async eliminar(id: number): Promise<void> {
    await query(
      `UPDATE productos SET activo = 0 WHERE id = ?`,
      [id]
    );
  }

  // Obtener estadísticas de inventario
  async obtenerEstadisticas(): Promise<EstadisticasInventario> {
    // Total productos
    const totalResult = await query(
      `SELECT COUNT(*) as total FROM productos WHERE activo = 1`
    );

    // Valor inventario
    const valorResult = await query(
      `SELECT SUM(precio_de_compra * stock) as valor FROM productos WHERE activo = 1`
    );

    // Stock bajo
    const stockBajoResult = await query(
      `SELECT COUNT(*) as total FROM productos 
       WHERE activo = 1 AND stock < stock_minimo AND stock > 0`
    );

    // Agotados
    const agotadosResult = await query(
      `SELECT COUNT(*) as total FROM productos WHERE activo = 1 AND stock = 0`
    );

    // Por categoría
    const porCategoriaResult = await query(
      `SELECT c.id as id_categoria, c.nombre as nombre_categoria, 
              COUNT(p.id) as cantidad,
              SUM(p.precio_de_compra * p.stock) as valor
       FROM categorias c
       LEFT JOIN productos p ON c.id = p.id_categoria AND p.activo = 1
       WHERE c.activo = 1
       GROUP BY c.id, c.nombre
       ORDER BY cantidad DESC`
    );

    return {
      total_productos: totalResult[0].total,
      valor_inventario: parseFloat(valorResult[0].valor) || 0,
      stock_bajo: stockBajoResult[0].total,
      agotados: agotadosResult[0].total,
      por_categoria: porCategoriaResult.map((cat: any) => ({
        id_categoria: cat.id_categoria,
        nombre_categoria: cat.nombre_categoria,
        cantidad: cat.cantidad,
        valor: parseFloat(cat.valor) || 0
      }))
    };
  }
}

export default new ProductosRepository();