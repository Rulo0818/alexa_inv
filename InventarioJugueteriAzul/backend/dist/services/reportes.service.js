"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportesService = void 0;
const productos_repository_1 = __importDefault(require("../repositories/productos.repository"));
class ReportesService {
    async stockBajo(umbral) {
        const u = Math.max(0, Math.min(100000, Math.floor(Number(umbral) || 0)));
        const productos = await productos_repository_1.default.listarStockBajoPorUmbral(u);
        return {
            success: true,
            umbral: u,
            productos
        };
    }
}
exports.ReportesService = ReportesService;
exports.default = new ReportesService();
