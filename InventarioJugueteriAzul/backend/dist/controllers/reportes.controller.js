"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportesController = void 0;
const reportes_service_1 = __importDefault(require("../services/reportes.service"));
class ReportesController {
    // GET /api/reportes/stock-bajo?umbral=5
    async stockBajo(req, res) {
        try {
            const umbralRaw = req.query.umbral;
            const umbral = umbralRaw == null || umbralRaw === '' ? 5 : Number(umbralRaw);
            const resultado = await reportes_service_1.default.stockBajo(umbral);
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
exports.ReportesController = ReportesController;
exports.default = new ReportesController();
