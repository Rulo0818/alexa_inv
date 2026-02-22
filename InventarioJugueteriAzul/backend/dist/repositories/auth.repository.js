"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const database_1 = require("../config/database");
class AuthRepository {
    // Buscar usuario por username
    async buscarPorUsername(username) {
        const resultado = await (0, database_1.query)(`SELECT u.*, r.nombre_rol 
       FROM usuarios u
       INNER JOIN roles r ON u.id_rol = r.id
       WHERE u.username = ? AND u.activo = 1`, [username]);
        if (resultado.length === 0)
            return null;
        return resultado[0];
    }
    // Buscar usuario por id
    async buscarPorId(id) {
        const resultado = await (0, database_1.query)(`SELECT u.*, r.nombre_rol 
       FROM usuarios u
       INNER JOIN roles r ON u.id_rol = r.id
       WHERE u.id = ? AND u.activo = 1`, [id]);
        if (resultado.length === 0)
            return null;
        return resultado[0];
    }
    // Guardar sesión
    async guardarSesion(id_usuario, token, direccion_ip, navegador) {
        await (0, database_1.query)(`INSERT INTO sesiones (id_usuario, token, direccion_ip, navegador)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       token = VALUES(token),
       direccion_ip = VALUES(direccion_ip),
       navegador = VALUES(navegador),
       ultima_actividad = CURRENT_TIMESTAMP`, [id_usuario, token, direccion_ip, navegador]);
    }
    // Eliminar sesión (logout)
    async eliminarSesion(id_usuario) {
        await (0, database_1.query)(`DELETE FROM sesiones WHERE id_usuario = ?`, [id_usuario]);
    }
    // Actualizar contraseña
    async actualizarContrasena(id_usuario, nueva_contrasena) {
        await (0, database_1.query)(`UPDATE usuarios 
       SET contrasena = ?, 
           requiere_cambio_contrasena = 0,
           fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id = ?`, [nueva_contrasena, id_usuario]);
    }
    // Registrar acción en historial
    async registrarAccion(id_usuario, tipo_accion, descripcion, direccion_ip, navegador) {
        await (0, database_1.query)(`INSERT INTO historial_acciones 
       (id_usuario, tipo_accion, descripcion, direccion_ip, navegador)
       VALUES (?, ?, ?, ?, ?)`, [id_usuario, tipo_accion, descripcion, direccion_ip, navegador]);
    }
}
exports.AuthRepository = AuthRepository;
exports.default = new AuthRepository();
