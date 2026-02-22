import { query } from '../config/database';
import { Usuario } from '../types/usuario.types';

export class AuthRepository {

  // Buscar usuario por username
  async buscarPorUsername(username: string): Promise<Usuario | null> {
    const resultado = await query(
      `SELECT u.*, r.nombre_rol 
       FROM usuarios u
       INNER JOIN roles r ON u.id_rol = r.id
       WHERE u.username = ? AND u.activo = 1`,
      [username]
    );

    if (resultado.length === 0) return null;
    return resultado[0];
  }

  // Buscar usuario por id
  async buscarPorId(id: number): Promise<Usuario | null> {
    const resultado = await query(
      `SELECT u.*, r.nombre_rol 
       FROM usuarios u
       INNER JOIN roles r ON u.id_rol = r.id
       WHERE u.id = ? AND u.activo = 1`,
      [id]
    );

    if (resultado.length === 0) return null;
    return resultado[0];
  }

  // Guardar sesión
  async guardarSesion(
    id_usuario: number,
    token: string,
    direccion_ip: string,
    navegador: string
  ): Promise<void> {
    await query(
      `INSERT INTO sesiones (id_usuario, token, direccion_ip, navegador)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       token = VALUES(token),
       direccion_ip = VALUES(direccion_ip),
       navegador = VALUES(navegador),
       ultima_actividad = CURRENT_TIMESTAMP`,
      [id_usuario, token, direccion_ip, navegador]
    );
  }

  // Eliminar sesión (logout)
  async eliminarSesion(id_usuario: number): Promise<void> {
    await query(
      `DELETE FROM sesiones WHERE id_usuario = ?`,
      [id_usuario]
    );
  }

  // Actualizar contraseña
  async actualizarContrasena(
    id_usuario: number,
    nueva_contrasena: string
  ): Promise<void> {
    await query(
      `UPDATE usuarios 
       SET contrasena = ?, 
           requiere_cambio_contrasena = 0,
           fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [nueva_contrasena, id_usuario]
    );
  }

  // Registrar acción en historial
  async registrarAccion(
    id_usuario: number,
    tipo_accion: string,
    descripcion: string,
    direccion_ip: string,
    navegador: string
  ): Promise<void> {
    await query(
      `INSERT INTO historial_acciones 
       (id_usuario, tipo_accion, descripcion, direccion_ip, navegador)
       VALUES (?, ?, ?, ?, ?)`,
      [id_usuario, tipo_accion, descripcion, direccion_ip, navegador]
    );
  }
}

export default new AuthRepository();