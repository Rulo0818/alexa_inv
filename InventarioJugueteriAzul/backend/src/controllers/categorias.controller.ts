import { Request, Response } from 'express';
import categoriasService from '../services/categorias.service';
import {
  CrearCategoriaRequest,
  EditarCategoriaRequest,
  ListarCategoriasQuery
} from '../types/categoria.types';

export class CategoriasController {

  // GET /api/categorias
  async listar(req: Request, res: Response): Promise<void> {
    try {
      const filtros: ListarCategoriasQuery = {
        activo: req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined,
        search: req.query.search as string
      };

      const resultado = await categoriasService.listar(filtros);
      res.status(200).json(resultado);

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/categorias/:id
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

      const resultado = await categoriasService.buscarPorId(id);

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

  // POST /api/categorias
  async crear(req: Request, res: Response): Promise<void> {
    try {
      const datos: CrearCategoriaRequest = req.body;
      const id_usuario = req.usuario!.id;
      const direccion_ip = req.ip || 'desconocida';
      const navegador = req.headers['user-agent'] || 'desconocido';

      const resultado = await categoriasService.crear(
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

  // PUT /api/categorias/:id
  async editar(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const datos: EditarCategoriaRequest = req.body;
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

      const resultado = await categoriasService.editar(
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

  // DELETE /api/categorias/:id
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

      const resultado = await categoriasService.eliminar(
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
}

export default new CategoriasController();