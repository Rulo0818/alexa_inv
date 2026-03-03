import ventasRepository from '../repositories/ventas.repository';
import productosRepository from '../repositories/productos.repository';
import authRepository from '../repositories/auth.repository';
import {
  RegistrarVentaRequest,
  CancelarVentaRequest,
  VentaCompleta,
  ListarVentasQuery,
  EstadisticasVentas
} from '../types/venta.types';

export class VentasService {

  // Registrar venta
  async registrarVenta(
    datos: RegistrarVentaRequest,
    id_empleado: number,
    direccion_ip: string,
    navegador: string
  ): Promise<{
    success: boolean;
    message: string;
    venta_id?: number;
  }> {

    // Validaciones
    if (!datos.productos || datos.productos.length === 0) {
      return {
        success: false,
        message: 'Debe agregar al menos un producto'
      };
    }

    // Verificar stock de cada producto
    for (const prod of datos.productos) {
      const producto = await productosRepository.buscarPorId(prod.id_producto);

      if (!producto) {
        return {
          success: false,
          message: `Producto con ID ${prod.id_producto} no encontrado`
        };
      }

      if (producto.stock < prod.cantidad) {
        return {
          success: false,
          message: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}`
        };
      }

      if (prod.cantidad <= 0) {
        return {
          success: false,
          message: 'La cantidad debe ser mayor a 0'
        };
      }
    }

    // Calcular total
    let total = 0;
    for (const prod of datos.productos) {
      total += prod.precio_unitario * prod.cantidad;
    }

    // Fecha y hora en zona local (para que coincida con CURDATE() de MySQL)
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const fecha = `${anio}-${mes}-${dia}`;
    const hora = ahora.toTimeString().split(' ')[0];

    // Registrar venta
    const venta_id = await ventasRepository.registrarVenta(
      id_empleado,
      total,
      datos.metodo_pago,
      fecha,
      hora
    );

    // Registrar detalle
    await ventasRepository.registrarDetalle(venta_id, datos.productos);

    // Los triggers actualizan el stock automáticamente

    // Registrar en historial
    const productosTexto = datos.productos.length === 1 
      ? '1 producto' 
      : `${datos.productos.length} productos`;

    await authRepository.registrarAccion(
      id_empleado,
      'venta',
      `Realizó una venta de ${productosTexto} por $${total.toFixed(2)} (${datos.metodo_pago})`,
      direccion_ip,
      navegador
    );

    return {
      success: true,
      message: 'Venta registrada correctamente',
      venta_id
    };
  }

  // Listar ventas
  async listar(filtros: ListarVentasQuery): Promise<{
    success: boolean;
    ventas: VentaCompleta[];
  }> {
    const ventas = await ventasRepository.listar(filtros);

    return {
      success: true,
      ventas
    };
  }

  // Buscar venta por ID
  async buscarPorId(id: number): Promise<{
    success: boolean;
    venta?: VentaCompleta;
    message?: string;
  }> {
    const venta = await ventasRepository.buscarPorId(id);

    if (!venta) {
      return {
        success: false,
        message: 'Venta no encontrada'
      };
    }

    return {
      success: true,
      venta
    };
  }

  // Cancelar venta
  async cancelar(
    id: number,
    datos: CancelarVentaRequest,
    id_usuario: number,
    direccion_ip: string,
    navegador: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {

    // Verificar que existe
    const venta = await ventasRepository.buscarPorId(id);
    if (!venta) {
      return {
        success: false,
        message: 'Venta no encontrada'
      };
    }

    // Verificar que no esté cancelada
    if (venta.cancelada) {
      return {
        success: false,
        message: 'Esta venta ya está cancelada'
      };
    }

    // Verificar tiempo (máximo 7 días)
    const puedeCancelarse = await ventasRepository.puedeCancelarse(id);
    if (!puedeCancelarse) {
      return {
        success: false,
        message: 'No se puede cancelar. Han pasado más de 7 días desde la venta'
      };
    }

    // Validar motivo
    if (!datos.motivo || datos.motivo.trim().length === 0) {
      return {
        success: false,
        message: 'Debe proporcionar un motivo de cancelación'
      };
    }

    // Cancelar venta (el trigger restaura el stock automáticamente)
    await ventasRepository.cancelar(id, datos.motivo, id_usuario);

    // Registrar en historial
    await authRepository.registrarAccion(
      id_usuario,
      'venta_cancelada',
      `Canceló la venta #${id}. Motivo: ${datos.motivo}`,
      direccion_ip,
      navegador
    );

    return {
      success: true,
      message: 'Venta cancelada correctamente. Stock restaurado.'
    };
  }

  // Obtener estadísticas
  async obtenerEstadisticas(filtros: ListarVentasQuery): Promise<{
    success: boolean;
    estadisticas: EstadisticasVentas;
  }> {
    const estadisticas = await ventasRepository.obtenerEstadisticas(filtros);

    return {
      success: true,
      estadisticas
    };
  }
}

export default new VentasService();
