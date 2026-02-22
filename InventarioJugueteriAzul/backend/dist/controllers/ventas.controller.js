"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentasController = void 0;
const ventas_service_1 = __importDefault(require("../services/ventas.service"));
class VentasController {
    // POST /api/ventas
    async registrarVenta(req, res) {
        try {
            const datos = req.body;
            const id_empleado = req.usuario.id;
            const direccion_ip = req.ip || 'desconocida';
            const navegador = req.headers['user-agent'] || 'desconocido';
            const resultado = await ventas_service_1.default.registrarVenta(datos, id_empleado, direccion_ip, navegador);
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
    // GET /api/ventas
    async listar(req, res) {
        try {
            const filtros = {
                fecha_inicio: req.query.fecha_inicio,
                fecha_fin: req.query.fecha_fin,
                id_empleado: req.query.id_empleado ? parseInt(req.query.id_empleado) : undefined,
                metodo_pago: req.query.metodo_pago,
                cancelada: req.query.cancelada === 'true' ? true : req.query.cancelada === 'false' ? false : undefined
            };
            const resultado = await ventas_service_1.default.listar(filtros);
            res.status(200).json(resultado);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    // GET /api/ventas/:id
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
            const resultado = await ventas_service_1.default.buscarPorId(id);
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
    // POST /api/ventas/:id/cancelar
    async cancelar(req, res) {
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
            const resultado = await ventas_service_1.default.cancelar(id, datos, id_usuario, direccion_ip, navegador);
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
    // GET /api/ventas/estadisticas/resumen
    async obtenerEstadisticas(req, res) {
        try {
            const filtros = {
                fecha_inicio: req.query.fecha_inicio,
                fecha_fin: req.query.fecha_fin
            };
            const resultado = await ventas_service_1.default.obtenerEstadisticas(filtros);
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
exports.VentasController = VentasController;
exports.default = new VentasController();
