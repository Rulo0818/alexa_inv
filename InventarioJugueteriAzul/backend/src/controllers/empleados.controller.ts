import { Request, Response } from 'express';
import empleadosService from '../services/empleados.service';
import {
  CrearEmpleadoRequest,
  EditarEmpleadoRequest,
  ResetearContrasenaRequest,
  ListarEmpleadosQuery
} from '../types/empleado.types';

export class EmpleadosController {

  // GET /api/empleados/estadisticas/resumen
  async obtenerResumen(req: Request, res: Response): Promise<void> {
    try {
      const resultado = await empleadosService.obtenerResumen();
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  // GET /api/empleados
  async listar(req: Request, res: Response): Promise<void> {
    try {
      const filtros: ListarEmpleadosQuery = {
        rol: req.query.rol as any,
        activo: req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined,
        search: req.query.search as string
      };

      const resultado = await empleadosService.listar(filtros);
      res.status(200).json(resultado);

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/empleados/:id
  async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
        return;
      }

      const resultado = await empleadosService.buscarPorId(id);

      if (!resultado.success) {
        res.status(404).json(resultado);
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

  // POST /api/empleados
  async crear(req: Request, res: Response): Promise<void> {
    try {
      const datos: CrearEmpleadoRequest = req.body;
      const id_usuario_creador = req.usuario!.id;
      const direccion_ip = req.ip || 'desconocida';
      const navegador = req.headers['user-agent'] || 'desconocido';

      const resultado = await empleadosService.crear(
        datos,
        id_usuario_creador,
        direccion_ip,
        navegador
      );

      if (!resultado.success) {
        res.status(400).json(resultado);
        return;
      }

      res.status(201).json(resultado);

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // PUT /api/empleados/:id
  async editar(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const datos: EditarEmpleadoRequest = req.body;
      const id_usuario_editor = req.usuario!.id;
      const direccion_ip = req.ip || 'desconocida';
      const navegador = req.headers['user-agent'] || 'desconocido';

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
        return;
      }

      const resultado = await empleadosService.editar(
        id,
        datos,
        id_usuario_editor,
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

  // POST /api/empleados/:id/foto - subir/actualizar foto del empleado
  async subirFoto(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const file = req.file as Express.Multer.File | undefined;

      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID inválido' });
        return;
      }
      if (!file || !file.filename) {
        res.status(400).json({ success: false, message: 'No se recibió ninguna imagen' });
        return;
      }

      const resultado = await empleadosService.actualizarFoto(id, file.filename);

      if (!resultado.success) {
        res.status(400).json(resultado);
        return;
      }

      res.status(200).json(resultado);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error?.message || 'Error al subir la imagen'
      });
    }
  }

  // POST /api/empleados/:id/resetear-contrasena
  async resetearContrasena(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const datos: ResetearContrasenaRequest = req.body;
      const id_usuario_resetea = req.usuario!.id;
      const direccion_ip = req.ip || 'desconocida';
      const navegador = req.headers['user-agent'] || 'desconocido';

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
        return;
      }

      const resultado = await empleadosService.resetearContrasena(
        id,
        datos,
        id_usuario_resetea,
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

  // GET /api/empleados/mi-estadisticas (solo autenticación, devuelve stats del usuario logueado: empleado o jefe)
  async obtenerMisEstadisticas(req: Request, res: Response): Promise<void> {
    try {
      const id_usuario = req.usuario!.id;
      const resultado = await empleadosService.obtenerMisEstadisticas(id_usuario);

      if (!resultado.success) {
        res.status(404).json(resultado);
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

  // DELETE /api/empleados/:id
  async eliminar(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const id_usuario = req.usuario!.id;
      const direccion_ip = req.ip || 'desconocida';
      const navegador = req.headers['user-agent'] || 'desconocido';

      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID inválido' });
        return;
      }

      const resultado = await empleadosService.eliminar(id, id_usuario, direccion_ip, navegador);

      if (!resultado.success) {
        res.status(400).json(resultado);
        return;
      }

      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  // GET /api/empleados/:id/estadisticas
  async obtenerEstadisticas(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
        return;
      }

      const resultado = await empleadosService.obtenerEstadisticas(id);

      if (!resultado.success) {
        res.status(404).json(resultado);
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
}

export default new EmpleadosController();