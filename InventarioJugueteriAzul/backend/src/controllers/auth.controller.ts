import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { LoginRequest, CambiarContrasenaRequest } from '../types/usuario.types';

export class AuthController {

  // POST /api/auth/login
  async login(req: Request, res: Response): Promise<void> {
    try {
      const datos: LoginRequest = req.body;

      // Validar campos
      if (!datos.username || !datos.contrasena) {
        res.status(400).json({
          success: false,
          message: 'Usuario y contraseña son requeridos'
        });
        return;
      }

      // Obtener IP y navegador
      const direccion_ip = req.ip || 'desconocida';
      const navegador = req.headers['user-agent'] || 'desconocido';

      // Ejecutar login
      const resultado = await authService.login(
        datos,
        direccion_ip,
        navegador
      );

      if (!resultado.success) {
        res.status(401).json(resultado);
        return;
      }

      res.status(200).json(resultado);

    } catch (error: any) {
      console.error('[Login] ❌ Error interno:', error?.message || error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // POST /api/auth/cambiar-contrasena
  async cambiarContrasena(req: Request, res: Response): Promise<void> {
    try {
      const datos: CambiarContrasenaRequest = req.body;
      const id_usuario = req.usuario!.id;

      // Validar campos
      if (!datos.contrasena_actual || !datos.contrasena_nueva || !datos.confirmar_contrasena) {
        res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos'
        });
        return;
      }

      // Obtener IP y navegador
      const direccion_ip = req.ip || 'desconocida';
      const navegador = req.headers['user-agent'] || 'desconocido';

      const resultado = await authService.cambiarContrasena(
        id_usuario,
        datos,
        direccion_ip,
        navegador
      );

      if (!resultado.success) {
        res.status(400).json(resultado);
        return;
      }

      res.status(200).json(resultado);

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // POST /api/auth/logout
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const id_usuario = req.usuario!.id;
      await authService.logout(id_usuario);

      res.status(200).json({
        success: true,
        message: 'Sesión cerrada correctamente'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

export default new AuthController();