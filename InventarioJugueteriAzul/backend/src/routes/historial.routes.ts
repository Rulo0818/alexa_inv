import { Router } from 'express';
import historialController from '../controllers/historial.controller';
import { verificarAutenticacion, verificarJefe } from '../middlewares/auth.middleware';

const router = Router();

router.use(verificarAutenticacion);
router.use(verificarJefe);

router.get('/', historialController.listar.bind(historialController));
router.get('/estadisticas/hoy', historialController.obtenerEstadisticas.bind(historialController));

export default router;
