import productosRepository from '../repositories/productos.repository';
import { ProductoConCategoria } from '../types/producto.types';

export class ReportesService {
  async stockBajo(umbral: number): Promise<{
    success: boolean;
    umbral: number;
    productos: ProductoConCategoria[];
  }> {
    const u = Math.max(0, Math.min(100000, Math.floor(Number(umbral) || 0)));
    const productos = await productosRepository.listarStockBajoPorUmbral(u);

    return {
      success: true,
      umbral: u,
      productos
    };
  }
}

export default new ReportesService();
