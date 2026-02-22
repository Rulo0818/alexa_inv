"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productos_controller_1 = __importDefault(require("../controllers/productos.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_middleware_1.verificarAutenticacion);
// GET /api/productos (cualquier usuario autenticado)
router.get('/', productos_controller_1.default.listar.bind(productos_controller_1.default));
// GET /api/productos/estadisticas/inventario (solo jefes)
router.get('/estadisticas/inventario', auth_middleware_1.verificarJefe, productos_controller_1.default.obtenerEstadisticas.bind(productos_controller_1.default));
// GET /api/productos/codigo/:codigo (cualquier usuario autenticado)
router.get('/codigo/:codigo', productos_controller_1.default.buscarPorCodigo.bind(productos_controller_1.default));
// GET /api/productos/:id (cualquier usuario autenticado)
router.get('/:id', productos_controller_1.default.buscarPorId.bind(productos_controller_1.default));
// Las siguientes rutas requieren ser jefe
router.use(auth_middleware_1.verificarJefe);
// POST /api/productos
router.post('/', productos_controller_1.default.crear.bind(productos_controller_1.default));
// PUT /api/productos/:id
router.put('/:id', productos_controller_1.default.editar.bind(productos_controller_1.default));
// DELETE /api/productos/:id
router.delete('/:id', productos_controller_1.default.eliminar.bind(productos_controller_1.default));
exports.default = router;
