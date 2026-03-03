"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = __importDefault(require("../services/auth.service"));
class AuthController {
    // POST /api/auth/login
    async login(req, res) {
        try {
            const datos = req.body;
            // Validar campos
            if (!datos.username || !datos.contrasena) {
                res.status(400).json({
                    success: false,
                    message: 'Usuario y contraseña son requeridos'
                });
                return;
            }
            // Obtener IP y navegador
            const direccion_ip = req.ip || 'desconocida';
            const navegador = req.headers['user-agent'] || 'desconocido';
            // Ejecutar login
            const resultado = await auth_service_1.default.login(datos, direccion_ip, navegador);
            if (!resultado.success) {
                res.status(401).json(resultado);
                return;
            }
            res.status(200).json(resultado);
        }
        catch (error) {
            console.error('[Login] ❌ Error interno:', error?.message || error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    // POST /api/auth/cambiar-contrasena
    async cambiarContrasena(req, res) {
        try {
            const datos = req.body;
            const id_usuario = req.usuario.id;
            // Validar campos
            if (!datos.contrasena_actual || !datos.contrasena_nueva || !datos.confirmar_contrasena) {
                res.status(400).json({
                    success: false,
                    message: 'Todos los campos son requeridos'
                });
                return;
            }
            // Obtener IP y navegador
            const direccion_ip = req.ip || 'desconocida';
            const navegador = req.headers['user-agent'] || 'desconocido';
            const resultado = await auth_service_1.default.cambiarContrasena(id_usuario, datos, direccion_ip, navegador);
            if (!resultado.success) {
                res.status(400).json(resultado);
                return;
            }
            res.status(200).json(resultado);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    // POST /api/auth/logout
    async logout(req, res) {
        try {
            const id_usuario = req.usuario.id;
            await auth_service_1.default.logout(id_usuario);
            res.status(200).json({
                success: true,
                message: 'Sesión cerrada correctamente'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
