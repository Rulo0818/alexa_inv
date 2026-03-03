import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { verificarAutenticacion } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/auth/login
router.post('/login', authController.login.bind(authController));

// POST /api/auth/cambiar-contrasena
router.post(
  '/cambiar-contrasena',
  verificarAutenticacion,
  authController.cambiarContrasena.bind(authController)
);

// POST /api/auth/logout
router.post(
  '/logout',
  verificarAutenticacion,
  authController.logout.bind(authController)
);

export default router;