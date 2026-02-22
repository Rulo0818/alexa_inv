"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empleados_controller_1 = __importDefault(require("../controllers/empleados.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_1 = require("../config/upload");
const router = (0, express_1.Router)();
// Rutas que requieren solo autenticación (empleado puede ver sus propias stats)
router.get('/mi-estadisticas', auth_middleware_1.verificarAutenticacion, empleados_controller_1.default.obtenerMisEstadisticas.bind(empleados_controller_1.default));
// Todas las demás rutas requieren autenticación y ser jefe
router.use(auth_middleware_1.verificarAutenticacion);
router.use(auth_middleware_1.verificarJefe);
// GET /api/empleados
router.get('/', empleados_controller_1.default.listar.bind(empleados_controller_1.default));
// GET /api/empleados/estadisticas/resumen (antes de :id)
router.get('/estadisticas/resumen', empleados_controller_1.default.obtenerResumen.bind(empleados_controller_1.default));
// GET /api/empleados/:id
router.get('/:id', empleados_controller_1.default.buscarPorId.bind(empleados_controller_1.default));
// POST /api/empleados
router.post('/', empleados_controller_1.default.crear.bind(empleados_controller_1.default));
// PUT /api/empleados/:id
router.put('/:id', empleados_controller_1.default.editar.bind(empleados_controller_1.default));
// POST /api/empleados/:id/foto - subir/actualizar foto
router.post('/:id/foto', upload_1.uploadFotoEmpleado.single('foto'), empleados_controller_1.default.subirFoto.bind(empleados_controller_1.default));
// DELETE /api/empleados/:id
router.delete('/:id', empleados_controller_1.default.eliminar.bind(empleados_controller_1.default));
// POST /api/empleados/:id/resetear-contrasena
router.post('/:id/resetear-contrasena', empleados_controller_1.default.resetearContrasena.bind(empleados_controller_1.default));
// GET /api/empleados/:id/estadisticas
router.get('/:id/estadisticas', empleados_controller_1.default.obtenerEstadisticas.bind(empleados_controller_1.default));
exports.default = router;
