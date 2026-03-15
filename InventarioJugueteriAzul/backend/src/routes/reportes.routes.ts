import { Router } from 'express';
import reportesController from '../controllers/reportes.controller';
import { verificarAutenticacion, verificarJefe } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas de reportes requieren autenticación y ser jefe
router.use(verificarAutenticacion);
router.use(verificarJefe);

// GET /api/reportes/stock-bajo
router.get('/stock-bajo', reportesController.stockBajo.bind(reportesController));

export default router;
