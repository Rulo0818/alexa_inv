import { Router } from 'express';
import categoriasController from '../controllers/categorias.controller';
import { verificarAutenticacion, verificarJefe } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(verificarAutenticacion);

// GET /api/categorias (cualquier usuario autenticado)
router.get('/', categoriasController.listar.bind(categoriasController));

// GET /api/categorias/:id (cualquier usuario autenticado)
router.get('/:id', categoriasController.buscarPorId.bind(categoriasController));

// Las siguientes rutas requieren ser jefe
router.use(verificarJefe);

// POST /api/categorias
router.post('/', categoriasController.crear.bind(categoriasController));

// PUT /api/categorias/:id
router.put('/:id', categoriasController.editar.bind(categoriasController));

// DELETE /api/categorias/:id
router.delete('/:id', categoriasController.eliminar.bind(categoriasController));

export default router;