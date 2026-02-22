"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpleadosController = void 0;
const empleados_service_1 = __importDefault(require("../services/empleados.service"));
class EmpleadosController {
    // GET /api/empleados/estadisticas/resumen
    async obtenerResumen(req, res) {
        try {
            const resultado = await empleados_service_1.default.obtenerResumen();
            res.status(200).json(resultado);
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }
    // GET /api/empleados
    async listar(req, res) {
        try {
            const filtros = {
                rol: req.query.rol,
                activo: req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined,
                search: req.query.search
            };
            const resultado = await empleados_service_1.default.listar(filtros);
            res.status(200).json(resultado);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    // GET /api/empleados/:id
    async buscarPorId(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
                return;
            }
            const resultado = await empleados_service_1.default.buscarPorId(id);
            if (!resultado.success) {
                res.status(404).json(resultado);
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
    // POST /api/empleados
    async crear(req, res) {
        try {
            const datos = req.body;
            const id_usuario_creador = req.usuario.id;
            const direccion_ip = req.ip || 'desconocida';
            const navegador = req.headers['user-agent'] || 'desconocido';
            const resultado = await empleados_service_1.default.crear(datos, id_usuario_creador, direccion_ip, navegador);
            if (!resultado.success) {
                res.status(400).json(resultado);
                return;
            }
            res.status(201).json(resultado);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    // PUT /api/empleados/:id
    async editar(req, res) {
        try {
            const id = parseInt(req.params.id);
            const datos = req.body;
            const id_usuario_editor = req.usuario.id;
            const direccion_ip = req.ip || 'desconocida';
            const navegador = req.headers['user-agent'] || 'desconocido';
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
                return;
            }
            const resultado = await empleados_service_1.default.editar(id, datos, id_usuario_editor, direccion_ip, navegador);
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
    // POST /api/empleados/:id/foto - subir/actualizar foto del empleado
    async subirFoto(req, res) {
        try {
            const id = parseInt(req.params.id);
            const file = req.file;
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: 'ID inválido' });
                return;
            }
            if (!file || !file.filename) {
                res.status(400).json({ success: false, message: 'No se recibió ninguna imagen' });
                return;
            }
            const resultado = await empleados_service_1.default.actualizarFoto(id, file.filename);
            if (!resultado.success) {
                res.status(400).json(resultado);
                return;
            }
            res.status(200).json(resultado);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error?.message || 'Error al subir la imagen'
            });
        }
    }
    // POST /api/empleados/:id/resetear-contrasena
    async resetearContrasena(req, res) {
        try {
            const id = parseInt(req.params.id);
            const datos = req.body;
            const id_usuario_resetea = req.usuario.id;
            const direccion_ip = req.ip || 'desconocida';
            const navegador = req.headers['user-agent'] || 'desconocido';
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
                return;
            }
            const resultado = await empleados_service_1.default.resetearContrasena(id, datos, id_usuario_resetea, direccion_ip, navegador);
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
    // GET /api/empleados/mi-estadisticas (solo autenticación, devuelve stats del usuario logueado: empleado o jefe)
    async obtenerMisEstadisticas(req, res) {
        try {
            const id_usuario = req.usuario.id;
            const resultado = await empleados_service_1.default.obtenerMisEstadisticas(id_usuario);
            if (!resultado.success) {
                res.status(404).json(resultado);
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
    // DELETE /api/empleados/:id
    async eliminar(req, res) {
        try {
            const id = parseInt(req.params.id);
            const id_usuario = req.usuario.id;
            const direccion_ip = req.ip || 'desconocida';
            const navegador = req.headers['user-agent'] || 'desconocido';
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: 'ID inválido' });
                return;
            }
            const resultado = await empleados_service_1.default.eliminar(id, id_usuario, direccion_ip, navegador);
            if (!resultado.success) {
                res.status(400).json(resultado);
                return;
            }
            res.status(200).json(resultado);
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }
    // GET /api/empleados/:id/estadisticas
    async obtenerEstadisticas(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
                return;
            }
            const resultado = await empleados_service_1.default.obtenerEstadisticas(id);
            if (!resultado.success) {
                res.status(404).json(resultado);
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
}
exports.EmpleadosController = EmpleadosController;
exports.default = new EmpleadosController();
