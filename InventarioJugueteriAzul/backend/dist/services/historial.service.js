"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistorialService = void 0;
const historial_repository_1 = __importDefault(require("../repositories/historial.repository"));
class HistorialService {
    async listar(filtros) {
        try {
            const data = await historial_repository_1.default.listar(filtros);
            return { success: true, data };
        }
        catch (error) {
            return { success: false, message: 'Error al obtener el historial de acciones' };
        }
    }
    async obtenerEstadisticasHoy() {
        try {
            const data = await historial_repository_1.default.obtenerEstadisticasHoy();
            return { success: true, data };
        }
        catch (error) {
            return { success: false, message: 'Error al obtener estadísticas' };
        }
    }
}
exports.HistorialService = HistorialService;
exports.default = new HistorialService();
