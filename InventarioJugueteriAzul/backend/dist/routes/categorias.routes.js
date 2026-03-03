"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categorias_controller_1 = __importDefault(require("../controllers/categorias.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_middleware_1.verificarAutenticacion);
// GET /api/categorias (cualquier usuario autenticado)
router.get('/', categorias_controller_1.default.listar.bind(categorias_controller_1.default));
// GET /api/categorias/:id (cualquier usuario autenticado)
router.get('/:id', categorias_controller_1.default.buscarPorId.bind(categorias_controller_1.default));
// Las siguientes rutas requieren ser jefe
router.use(auth_middleware_1.verificarJefe);
// POST /api/categorias
router.post('/', categorias_controller_1.default.crear.bind(categorias_controller_1.default));
// PUT /api/categorias/:id
router.put('/:id', categorias_controller_1.default.editar.bind(categorias_controller_1.default));
// DELETE /api/categorias/:id
router.delete('/:id', categorias_controller_1.default.eliminar.bind(categorias_controller_1.default));
exports.default = router;
