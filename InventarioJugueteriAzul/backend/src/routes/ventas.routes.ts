import { Router } from 'express';
import ventasController from '../controllers/ventas.controller';
import { verificarAutenticacion, verificarJefe } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(verificarAutenticacion);

// POST /api/ventas (cualquier usuario autenticado puede registrar venta)
router.post('/', ventasController.registrarVenta.bind(ventasController));

// GET /api/ventas (solo jefes pueden ver todas las ventas)
router.get('/', verificarJefe, ventasController.listar.bind(ventasController));

// GET /api/ventas/estadisticas/resumen (solo jefes)
router.get(
  '/estadisticas/resumen',
  verificarJefe,
  ventasController.obtenerEstadisticas.bind(ventasController)
);

// GET /api/ventas/:id (solo jefes)
router.get('/:id', verificarJefe, ventasController.buscarPorId.bind(ventasController));

// POST /api/ventas/:id/cancelar (solo jefes)
router.post(
  '/:id/cancelar',
  verificarJefe,
  ventasController.cancelar.bind(ventasController)
);

export default router;