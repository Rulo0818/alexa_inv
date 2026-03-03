import historialRepository, {
  ListarHistorialQuery,
  AccionHistorial,
  EstadisticasHistorial
} from '../repositories/historial.repository';

export class HistorialService {

  async listar(filtros: ListarHistorialQuery): Promise<{ success: boolean; data?: AccionHistorial[]; message?: string }> {
    try {
      const data = await historialRepository.listar(filtros);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: 'Error al obtener el historial de acciones' };
    }
  }

  async obtenerEstadisticasHoy(): Promise<{ success: boolean; data?: EstadisticasHistorial; message?: string }> {
    try {
      const data = await historialRepository.obtenerEstadisticasHoy();
      return { success: true, data };
    } catch (error) {
      return { success: false, message: 'Error al obtener estadísticas' };
    }
  }
}

export default new HistorialService();
