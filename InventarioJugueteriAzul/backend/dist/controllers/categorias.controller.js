"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriasController = void 0;
const categorias_service_1 = __importDefault(require("../services/categorias.service"));
class CategoriasController {
    // GET /api/categorias
    async listar(req, res) {
        try {
            const filtros = {
                activo: req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined,
                search: req.query.search
            };
            const resultado = await categorias_service_1.default.listar(filtros);
            res.status(200).json(resultado);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    // GET /api/categorias/:id
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
            const resultado = await categorias_service_1.default.buscarPorId(id);
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
    // POST /api/categorias
    async crear(req, res) {
        try {
            const datos = req.body;
            const id_usuario = req.usuario.id;
            const direccion_ip = req.ip || 'desconocida';
            const navegador = req.headers['user-agent'] || 'desconocido';
            const resultado = await categorias_service_1.default.crear(datos, id_usuario, direccion_ip, navegador);
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
    // PUT /api/categorias/:id
    async editar(req, res) {
        try {
            const id = parseInt(req.params.id);
            const datos = req.body;
            const id_usuario = req.usuario.id;
            const direccion_ip = req.ip || 'desconocida';
            const navegador = req.headers['user-agent'] || 'desconocido';
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
                return;
            }
            const resultado = await categorias_service_1.default.editar(id, datos, id_usuario, direccion_ip, navegador);
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
    // DELETE /api/categorias/:id
    async eliminar(req, res) {
        try {
            const id = parseInt(req.params.id);
            const id_usuario = req.usuario.id;
            const direccion_ip = req.ip || 'desconocida';
            const navegador = req.headers['user-agent'] || 'desconocido';
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
                return;
            }
            const resultado = await categorias_service_1.default.eliminar(id, id_usuario, direccion_ip, navegador);
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
}
exports.CategoriasController = CategoriasController;
exports.default = new CategoriasController();
