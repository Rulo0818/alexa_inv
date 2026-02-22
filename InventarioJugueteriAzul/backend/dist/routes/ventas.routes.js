"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ventas_controller_1 = __importDefault(require("../controllers/ventas.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_middleware_1.verificarAutenticacion);
// POST /api/ventas (cualquier usuario autenticado puede registrar venta)
router.post('/', ventas_controller_1.default.registrarVenta.bind(ventas_controller_1.default));
// GET /api/ventas (solo jefes pueden ver todas las ventas)
router.get('/', auth_middleware_1.verificarJefe, ventas_controller_1.default.listar.bind(ventas_controller_1.default));
// GET /api/ventas/estadisticas/resumen (solo jefes)
router.get('/estadisticas/resumen', auth_middleware_1.verificarJefe, ventas_controller_1.default.obtenerEstadisticas.bind(ventas_controller_1.default));
// GET /api/ventas/:id (solo jefes)
router.get('/:id', auth_middleware_1.verificarJefe, ventas_controller_1.default.buscarPorId.bind(ventas_controller_1.default));
// POST /api/ventas/:id/cancelar (solo jefes)
router.post('/:id/cancelar', auth_middleware_1.verificarJefe, ventas_controller_1.default.cancelar.bind(ventas_controller_1.default));
exports.default = router;
