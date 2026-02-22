"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductosController = void 0;
const productos_service_1 = __importDefault(require("../services/productos.service"));
class ProductosController {
    // GET /api/productos
    async listar(req, res) {
        try {
            const filtros = {
                categoria: req.query.categoria ? parseInt(req.query.categoria) : undefined,
                activo: req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined,
                estado: req.query.estado,
                stock_bajo: req.query.stock_bajo === 'true',
                search: req.query.search
            };
            const resultado = await productos_service_1.default.listar(filtros);
            res.status(200).json(resultado);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    // GET /api/productos/:id
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
            const resultado = await productos_service_1.default.buscarPorId(id);
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
    // GET /api/productos/codigo/:codigo
    async buscarPorCodigo(req, res) {
        try {
            const codigo = req.params.codigo;
            const resultado = await productos_service_1.default.buscarPorCodigo(codigo);
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
    // POST /api/productos
    async crear(req, res) {
        try {
            const datos = req.body;
            const id_usuario = req.usuario.id;
            const direccion_ip = req.ip || 'desconocida';
            const navegador = req.headers['user-agent'] || 'desconocido';
            const resultado = await productos_service_1.default.crear(datos, id_usuario, direccion_ip, navegador);
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
    // PUT /api/productos/:id
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
            const resultado = await productos_service_1.default.editar(id, datos, id_usuario, direccion_ip, navegador);
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
    // DELETE /api/productos/:id
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
            const resultado = await productos_service_1.default.eliminar(id, id_usuario, direccion_ip, navegador);
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
    // GET /api/productos/estadisticas/inventario
    async obtenerEstadisticas(req, res) {
        try {
            const resultado = await productos_service_1.default.obtenerEstadisticas();
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
exports.ProductosController = ProductosController;
exports.default = new ProductosController();
