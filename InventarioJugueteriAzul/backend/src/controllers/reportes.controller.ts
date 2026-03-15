import { Request, Response } from 'express';
import reportesService from '../services/reportes.service';

export class ReportesController {
  // GET /api/reportes/stock-bajo?umbral=5
  async stockBajo(req: Request, res: Response): Promise<void> {
    try {
      const umbralRaw = req.query.umbral as string | undefined;
      const umbral = umbralRaw == null || umbralRaw === '' ? 5 : Number(umbralRaw);

      const resultado = await reportesService.stockBajo(umbral);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

export default new ReportesController();
