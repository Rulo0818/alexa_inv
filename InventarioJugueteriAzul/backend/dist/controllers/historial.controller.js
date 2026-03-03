"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistorialController = void 0;
const historial_service_1 = __importDefault(require("../services/historial.service"));
class HistorialController {
    async listar(req, res) {
        try {
            const filtros = {
                fecha_inicio: req.query.fecha_inicio,
                fecha_fin: req.query.fecha_fin,
                id_usuario: req.query.id_usuario ? parseInt(req.query.id_usuario) : undefined,
                tipo_accion: req.query.tipo_accion,
                busqueda: req.query.busqueda
            };
            const resultado = await historial_service_1.default.listar(filtros);
            if (!resultado.success) {
                res.status(500).json(resultado);
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
    async obtenerEstadisticas(req, res) {
        try {
            const resultado = await historial_service_1.default.obtenerEstadisticasHoy();
            if (!resultado.success) {
                res.status(500).json(resultado);
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
exports.HistorialController = HistorialController;
exports.default = new HistorialController();
