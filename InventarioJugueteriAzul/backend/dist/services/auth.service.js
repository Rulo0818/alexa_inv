"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../config/jwt");
const auth_repository_1 = __importDefault(require("../repositories/auth.repository"));
class AuthService {
    // Login
    async login(datos, direccion_ip, navegador) {
        // Buscar usuario
        console.log(`[Login] Intento: usuario=${datos.username}`);
        const usuario = await auth_repository_1.default.buscarPorUsername(datos.username);
        if (!usuario) {
            console.log('[Login] ❌ Contraseña inválida - Usuario no encontrado');
            return {
                success: false,
                message: 'Usuario o contraseña incorrectos'
            };
        }
        // Verificar contraseña
        const contrasenaCorrecta = await bcrypt_1.default.compare(datos.contrasena, usuario.contrasena);
        if (!contrasenaCorrecta) {
            console.log('[Login] ❌ Contraseña inválida');
            return {
                success: false,
                message: 'Usuario o contraseña incorrectos'
            };
        }
        console.log('[Login] ✅ Contraseña correcta - Login exitoso');
        // Crear datos del token
        const usuarioToken = {
            id: usuario.id,
            username: usuario.username,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            id_rol: usuario.id_rol,
            nombre_rol: usuario.nombre_rol,
            requiere_cambio_contrasena: usuario.requiere_cambio_contrasena
        };
        // Generar token
        const token = (0, jwt_1.generarToken)(usuarioToken);
        // Guardar sesión
        await auth_repository_1.default.guardarSesion(usuario.id, token, direccion_ip, navegador);
        // Registrar en historial
        await auth_repository_1.default.registrarAccion(usuario.id, 'login', `${usuario.nombre} ${usuario.apellido} inició sesión`, direccion_ip, navegador);
        return {
            success: true,
            message: 'Login exitoso',
            token,
            usuario: usuarioToken,
            requiere_cambio_contrasena: usuario.requiere_cambio_contrasena
        };
    }
    // Cambiar contraseña
    async cambiarContrasena(id_usuario, datos, direccion_ip, navegador) {
        // Buscar usuario
        const usuario = await auth_repository_1.default.buscarPorId(id_usuario);
        if (!usuario) {
            return {
                success: false,
                message: 'Usuario no encontrado'
            };
        }
        // Verificar contraseña actual
        const contrasenaCorrecta = await bcrypt_1.default.compare(datos.contrasena_actual, usuario.contrasena);
        if (!contrasenaCorrecta) {
            return {
                success: false,
                message: 'La contraseña actual es incorrecta'
            };
        }
        // Validar nueva contraseña
        if (datos.contrasena_nueva !== datos.confirmar_contrasena) {
            return {
                success: false,
                message: 'Las contraseñas nuevas no coinciden'
            };
        }
        if (datos.contrasena_nueva.length < 6) {
            return {
                success: false,
                message: 'La contraseña debe tener mínimo 6 caracteres'
            };
        }
        // Hashear nueva contraseña
        const nuevaContrasenaHash = await bcrypt_1.default.hash(datos.contrasena_nueva, 10);
        // Actualizar contraseña
        await auth_repository_1.default.actualizarContrasena(id_usuario, nuevaContrasenaHash);
        // Registrar en historial
        await auth_repository_1.default.registrarAccion(id_usuario, 'usuario_editar', `${usuario.nombre} ${usuario.apellido} cambió su contraseña`, direccion_ip, navegador);
        return {
            success: true,
            message: 'Contraseña actualizada correctamente'
        };
    }
    // Logout
    async logout(id_usuario) {
        await auth_repository_1.default.eliminarSesion(id_usuario);
    }
}
exports.AuthService = AuthService;
exports.default = new AuthService();
