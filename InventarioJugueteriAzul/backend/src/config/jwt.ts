import jwt from 'jsonwebtoken';
import { UsuarioToken } from '../types/usuario.types';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

// Generar token
export const generarToken = (usuario: UsuarioToken): string => {
  return jwt.sign(usuario, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  } as jwt.SignOptions);
};

// Verificar token
export const verificarToken = (token: string): UsuarioToken => {
  return jwt.verify(token, JWT_SECRET) as UsuarioToken;
};