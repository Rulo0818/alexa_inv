export interface Usuario {
  id: number;
  id_rol: number;
  username: string;
  contrasena: string;
  nombre: string;
  apellido: string;
  edad?: number;
  telefono?: string;
  domicilio?: string;
  requiere_cambio_contrasena: boolean;
  activo: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export interface UsuarioToken {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  id_rol: number;
  nombre_rol: string;
  requiere_cambio_contrasena: boolean;
  foto_url?: string | null;
}

export interface LoginRequest {
  username: string;
  contrasena: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  usuario?: UsuarioToken;
  requiere_cambio_contrasena?: boolean;
}

export interface CambiarContrasenaRequest {
  contrasena_actual: string;
  contrasena_nueva: string;
  confirmar_contrasena: string;
}