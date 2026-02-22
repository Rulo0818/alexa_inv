import { Request, Response } from 'express';
import historialService from '../services/historial.service';

export class HistorialController {

  async listar(req: Request, res: Response): Promise<void> {
    try {
      const filtros = {
        fecha_inicio: req.query.fecha_inicio as string,
        fecha_fin: req.query.fecha_fin as string,
        id_usuario: req.query.id_usuario ? parseInt(req.query.id_usuario as string) : undefined,
        tipo_accion: req.query.tipo_accion as string,
        busqueda: req.query.busqueda as string
      };

      const resultado = await historialService.listar(filtros);

      if (!resultado.success) {
        res.status(500).json(resultado);
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

  async obtenerEstadisticas(req: Request, res: Response): Promise<void> {
    try {
      const resultado = await historialService.obtenerEstadisticasHoy();

      if (!resultado.success) {
        res.status(500).json(resultado);
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

export default new HistorialController();
