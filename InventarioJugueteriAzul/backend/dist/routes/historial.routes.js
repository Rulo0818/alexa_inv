"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const historial_controller_1 = __importDefault(require("../controllers/historial.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.verificarAutenticacion);
router.use(auth_middleware_1.verificarJefe);
router.get('/', historial_controller_1.default.listar.bind(historial_controller_1.default));
router.get('/estadisticas/hoy', historial_controller_1.default.obtenerEstadisticas.bind(historial_controller_1.default));
exports.default = router;
