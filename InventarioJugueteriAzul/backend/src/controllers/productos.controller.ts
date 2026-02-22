import { Request, Response } from 'express';
import productosService from '../services/productos.service';
import {
  CrearProductoRequest,
  EditarProductoRequest,
  ListarProductosQuery
} from '../types/producto.types';

export class ProductosController {

  // GET /api/productos
  async listar(req: Request, res: Response): Promise<void> {
    try {
      const filtros: ListarProductosQuery = {
        categoria: req.query.categoria ? parseInt(req.query.categoria as string) : undefined,
        activo: req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined,
        estado: req.query.estado as any,
        stock_bajo: req.query.stock_bajo === 'true',
        search: req.query.search as string
      };

      const resultado = await productosService.listar(filtros);
      res.status(200).json(resultado);

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/productos/:id
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

      const resultado = await productosService.buscarPorId(id);

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

  // GET /api/productos/codigo/:codigo
  async buscarPorCodigo(req: Request, res: Response): Promise<void> {
    try {
      const codigo = req.params.codigo;

      const resultado = await productosService.buscarPorCodigo(codigo);

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

  // POST /api/productos
  async crear(req: Request, res: Response): Promise<void> {
    try {
      const datos: CrearProductoRequest = req.body;
      const id_usuario = req.usuario!.id;
      const direccion_ip = req.ip || 'desconocida';
      const navegador = req.headers['user-agent'] || 'desconocido';

      const resultado = await productosService.crear(
        datos,
        id_usuario,
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

  // PUT /api/productos/:id
  async editar(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const datos: EditarProductoRequest = req.body;
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

      const resultado = await productosService.editar(
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

  // DELETE /api/productos/:id
  async eliminar(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
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

      const resultado = await productosService.eliminar(
        id,
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

  // GET /api/productos/estadisticas/inventario
  async obtenerEstadisticas(req: Request, res: Response): Promise<void> {
    try {
      const resultado = await productosService.obtenerEstadisticas();
      res.status(200).json(resultado);

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

export default new ProductosController();