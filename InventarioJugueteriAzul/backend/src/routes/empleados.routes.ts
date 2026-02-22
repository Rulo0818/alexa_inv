import { Router } from 'express';
import empleadosController from '../controllers/empleados.controller';
import { verificarAutenticacion, verificarJefe } from '../middlewares/auth.middleware';
import { uploadFotoEmpleado } from '../config/upload';

const router = Router();

// Rutas que requieren solo autenticación (empleado puede ver sus propias stats)
router.get(
  '/mi-estadisticas',
  verificarAutenticacion,
  empleadosController.obtenerMisEstadisticas.bind(empleadosController)
);

// Todas las demás rutas requieren autenticación y ser jefe
router.use(verificarAutenticacion);
router.use(verificarJefe);

// GET /api/empleados
router.get('/', empleadosController.listar.bind(empleadosController));

// GET /api/empleados/estadisticas/resumen (antes de :id)
router.get(
  '/estadisticas/resumen',
  empleadosController.obtenerResumen.bind(empleadosController)
);

// GET /api/empleados/:id
router.get('/:id', empleadosController.buscarPorId.bind(empleadosController));

// POST /api/empleados
router.post('/', empleadosController.crear.bind(empleadosController));

// PUT /api/empleados/:id
router.put('/:id', empleadosController.editar.bind(empleadosController));

// POST /api/empleados/:id/foto - subir/actualizar foto
router.post(
  '/:id/foto',
  uploadFotoEmpleado.single('foto'),
  empleadosController.subirFoto.bind(empleadosController)
);

// DELETE /api/empleados/:id
router.delete('/:id', empleadosController.eliminar.bind(empleadosController));

// POST /api/empleados/:id/resetear-contrasena
router.post(
  '/:id/resetear-contrasena',
  empleadosController.resetearContrasena.bind(empleadosController)
);

// GET /api/empleados/:id/estadisticas
router.get(
  '/:id/estadisticas',
  empleadosController.obtenerEstadisticas.bind(empleadosController)
);

export default router;