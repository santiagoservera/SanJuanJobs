import { api } from "@/shared/api/axios";
import type { ApiResponse } from "@/shared/types/api.types";
import type {
  Postulacion,
  CrearPostulacionDTO,
  PostulacionesPaginadas,
  EstadisticasPostulaciones,
} from "../types/postulaciones.types";

/**
 * Servicio para interactuar con el endpoint de postulaciones
 */
export const postulacionesService = {
  /**
   * Crear una postulación
   */
  async crear(datos: CrearPostulacionDTO): Promise<Postulacion> {
    const { data } = await api.post<ApiResponse<Postulacion>>(
      "/postulaciones",
      datos,
    );
    return data.datos!;
  },

  /**
   * Obtener mis postulaciones (empleado)
   */
  async obtenerMisPostulaciones(): Promise<PostulacionesPaginadas> {
    const { data } = await api.get<ApiResponse<PostulacionesPaginadas>>(
      "/postulaciones/mis-postulaciones",
    );
    return data.datos!;
  },

  /**
   * Obtener postulaciones recibidas (empleador)
   */
  async obtenerPostulacionesRecibidas(): Promise<PostulacionesPaginadas> {
    const { data } = await api.get<ApiResponse<PostulacionesPaginadas>>(
      "/postulaciones/recibidas",
    );
    return data.datos!;
  },

  /**
   * Obtener una postulación por ID
   */
  async obtenerPorId(id: number): Promise<Postulacion> {
    const { data } = await api.get<ApiResponse<Postulacion>>(
      `/postulaciones/${id}`,
    );
    return data.datos!;
  },

  /**
   * Eliminar una postulación
   */
  async eliminar(id: number): Promise<void> {
    await api.delete(`/postulaciones/${id}`);
  },

  /**
   * Obtener estadísticas (empleador)
   */
  async obtenerEstadisticas(): Promise<EstadisticasPostulaciones> {
    const { data } = await api.get<ApiResponse<EstadisticasPostulaciones>>(
      "/postulaciones/estadisticas",
    );
    return data.datos!;
  },

  /**
   * Obtener postulaciones de un trabajo específico (empleador)
   */
  async obtenerPostulacionesPorTrabajo(
    trabajoId: number,
  ): Promise<PostulacionesPaginadas> {
    const { data } = await api.get<ApiResponse<PostulacionesPaginadas>>(
      `/postulaciones/recibidas?trabajoId=${trabajoId}&limite=100`,
    );
    return data.datos!;
  },

  /**
   * Actualizar estado de una postulación (empleador)
   */
  async actualizarEstado(id: number, estado: string): Promise<Postulacion> {
    const { data } = await api.patch<ApiResponse<Postulacion>>(
      `/postulaciones/${id}/estado`,
      { estado },
    );
    return data.datos!;
  },
};
