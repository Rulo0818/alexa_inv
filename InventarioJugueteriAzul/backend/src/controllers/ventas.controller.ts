import { Request, Response } from 'express';
import ventasService from '../services/ventas.service';
import {
  RegistrarVentaRequest,
  CancelarVentaRequest,
  ListarVentasQuery
} from '../types/venta.types';

export class VentasController {

  // POST /api/ventas
  async registrarVenta(req: Request, res: Response): Promise<void> {
    try {
      const datos: RegistrarVentaRequest = req.body;
      const id_empleado = req.usuario!.id;
      const direccion_ip = req.ip || 'desconocida';
      const navegador = req.headers['user-agent'] || 'desconocido';

      const resultado = await ventasService.registrarVenta(
        datos,
        id_empleado,
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

  // GET /api/ventas
  async listar(req: Request, res: Response): Promise<void> {
    try {
      const filtros: ListarVentasQuery = {
        fecha_inicio: req.query.fecha_inicio as string,
        fecha_fin: req.query.fecha_fin as string,
        id_empleado: req.query.id_empleado ? parseInt(req.query.id_empleado as string) : undefined,
        metodo_pago: req.query.metodo_pago as any,
        cancelada: req.query.cancelada === 'true' ? true : req.query.cancelada === 'false' ? false : undefined
      };

      const resultado = await ventasService.listar(filtros);
      res.status(200).json(resultado);

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/ventas/:id
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

      const resultado = await ventasService.buscarPorId(id);

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

  // POST /api/ventas/:id/cancelar
  async cancelar(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const datos: CancelarVentaRequest = req.body;
      const id_usuario = req.usuario!.id;
      const direccion_ip = req.ip || 'desconocida';
      const navegador = req.headers['user-agent'] || 'desconocido';

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
        return;
      }

      const resultado = await ventasService.cancelar(
        id,
        datos,
        id_usuario,
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

  // GET /api/ventas/estadisticas/resumen
  async obtenerEstadisticas(req: Request, res: Response): Promise<void> {
    try {
      const filtros: ListarVentasQuery = {
        fecha_inicio: req.query.fecha_inicio as string,
        fecha_fin: req.query.fecha_fin as string
      };

      const resultado = await ventasService.obtenerEstadisticas(filtros);
      res.status(200).json(resultado);

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

export default new VentasController();