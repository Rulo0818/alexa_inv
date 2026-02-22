import { Router } from 'express';
import productosController from '../controllers/productos.controller';
import { verificarAutenticacion, verificarJefe } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(verificarAutenticacion);

// GET /api/productos (cualquier usuario autenticado)
router.get('/', productosController.listar.bind(productosController));

// GET /api/productos/estadisticas/inventario (solo jefes)
router.get(
  '/estadisticas/inventario',
  verificarJefe,
  productosController.obtenerEstadisticas.bind(productosController)
);

// GET /api/productos/codigo/:codigo (cualquier usuario autenticado)
router.get('/codigo/:codigo', productosController.buscarPorCodigo.bind(productosController));

// GET /api/productos/:id (cualquier usuario autenticado)
router.get('/:id', productosController.buscarPorId.bind(productosController));

// Las siguientes rutas requieren ser jefe
router.use(verificarJefe);

// POST /api/productos
router.post('/', productosController.crear.bind(productosController));

// PUT /api/productos/:id
router.put('/:id', productosController.editar.bind(productosController));

// DELETE /api/productos/:id
router.delete('/:id', productosController.eliminar.bind(productosController));

export default router;