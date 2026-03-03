import { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../config/jwt';
import { UsuarioToken } from '../types/usuario.types';

// Extender Request para incluir usuario
declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioToken;
    }
  }
}

// Middleware: Verificar token JWT
export const verificarAutenticacion = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No tienes autorización para acceder'
      });
      return;
    }

    // Extraer token
    const token = authHeader.split(' ')[1];

    // Verificar token
    const usuario = verificarToken(token);

    // Agregar usuario al request
    req.usuario = usuario;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// Middleware: Verificar rol de jefe
export const verificarJefe = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.usuario) {
    res.status(401).json({
      success: false,
      message: 'No autenticado'
    });
    return;
  }

  if (req.usuario.nombre_rol !== 'jefe') {
    res.status(403).json({
      success: false,
      message: 'No tienes permisos para realizar esta acción'
    });
    return;
  }

  next();
};
