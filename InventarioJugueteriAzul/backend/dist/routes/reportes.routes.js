"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportes_controller_1 = __importDefault(require("../controllers/reportes.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas de reportes requieren autenticación y ser jefe
router.use(auth_middleware_1.verificarAutenticacion);
router.use(auth_middleware_1.verificarJefe);
// GET /api/reportes/stock-bajo
router.get('/stock-bajo', reportes_controller_1.default.stockBajo.bind(reportes_controller_1.default));
exports.default = router;
