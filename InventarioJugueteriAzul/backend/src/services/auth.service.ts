import bcrypt from 'bcrypt';
import { generarToken } from '../config/jwt';
import authRepository from '../repositories/auth.repository';
import {
  LoginRequest,
  LoginResponse,
  UsuarioToken,
  CambiarContrasenaRequest
} from '../types/usuario.types';

export class AuthService {

  // Login
  async login(
    datos: LoginRequest,
    direccion_ip: string,
    navegador: string
  ): Promise<LoginResponse> {

    // Buscar usuario
    console.log(`[Login] Intento: usuario=${datos.username}`);
    const usuario = await authRepository.buscarPorUsername(datos.username);

    if (!usuario) {
      console.log('[Login] ❌ Contraseña inválida - Usuario no encontrado');
      return {
        success: false,
        message: 'Usuario o contraseña incorrectos'
      };
    }

    // Verificar contraseña
    const contrasenaCorrecta = await bcrypt.compare(
      datos.contrasena,
      usuario.contrasena
    );

    if (!contrasenaCorrecta) {
      console.log('[Login] ❌ Contraseña inválida');
      return {
        success: false,
        message: 'Usuario o contraseña incorrectos'
      };
    }

    console.log('[Login] ✅ Contraseña correcta - Login exitoso');

    // Crear datos del token
    const usuarioToken: UsuarioToken = {
      id: usuario.id,
      username: usuario.username,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      id_rol: usuario.id_rol,
      nombre_rol: (usuario as any).nombre_rol,
      requiere_cambio_contrasena: usuario.requiere_cambio_contrasena,
      foto_url: (usuario as any).foto_url ?? null
    };

    // Generar token
    const token = generarToken(usuarioToken);

    // Guardar sesión
    await authRepository.guardarSesion(
      usuario.id,
      token,
      direccion_ip,
      navegador
    );

    // Registrar en historial
    await authRepository.registrarAccion(
      usuario.id,
      'login',
      `${usuario.nombre} ${usuario.apellido} inició sesión`,
      direccion_ip,
      navegador
    );

    return {
      success: true,
      message: 'Login exitoso',
      token,
      usuario: usuarioToken,
      requiere_cambio_contrasena: usuario.requiere_cambio_contrasena
    };
  }

  // Cambiar contraseña
  async cambiarContrasena(
    id_usuario: number,
    datos: CambiarContrasenaRequest,
    direccion_ip: string,
    navegador: string
  ): Promise<{ success: boolean; message: string }> {

    // Buscar usuario
    const usuario = await authRepository.buscarPorId(id_usuario);

    if (!usuario) {
      return {
        success: false,
        message: 'Usuario no encontrado'
      };
    }

    // Verificar contraseña actual
    const contrasenaCorrecta = await bcrypt.compare(
      datos.contrasena_actual,
      usuario.contrasena
    );

    if (!contrasenaCorrecta) {
      return {
        success: false,
        message: 'La contraseña actual es incorrecta'
      };
    }

    // Validar nueva contraseña
    if (datos.contrasena_nueva !== datos.confirmar_contrasena) {
      return {
        success: false,
        message: 'Las contraseñas nuevas no coinciden'
      };
    }

    if (datos.contrasena_nueva.length < 6) {
      return {
        success: false,
        message: 'La contraseña debe tener mínimo 6 caracteres'
      };
    }

    // Hashear nueva contraseña
    const nuevaContrasenaHash = await bcrypt.hash(datos.contrasena_nueva, 10);

    // Actualizar contraseña
    await authRepository.actualizarContrasena(id_usuario, nuevaContrasenaHash);

    // Registrar en historial
    await authRepository.registrarAccion(
      id_usuario,
      'usuario_editar',
      `${usuario.nombre} ${usuario.apellido} cambió su contraseña`,
      direccion_ip,
      navegador
    );

    return {
      success: true,
      message: 'Contraseña actualizada correctamente'
    };
  }

  // Logout
  async logout(id_usuario: number): Promise<void> {
    await authRepository.eliminarSesion(id_usuario);
  }
}

export default new AuthService();