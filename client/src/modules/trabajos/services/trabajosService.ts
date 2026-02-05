import { api } from "@/shared/api/axios";
import type { ApiResponse } from "@/shared/types/api.types";
import type {
  Trabajo,
  FiltrosTrabajos,
  TrabajosPaginados,
  CrearTrabajoDTO,
  ActualizarTrabajoDTO,
} from "../types/trabajos.types";

/**
 * Servicio para interactuar con el endpoint de trabajos
 */
export const trabajosService = {
  /**
   * Obtener trabajos con filtros
   */
  async obtenerTrabajos(filtros?: FiltrosTrabajos): Promise<TrabajosPaginados> {
    const params = new URLSearchParams();

    if (filtros?.categoriaId)
      params.append("categoriaId", filtros.categoriaId.toString());
    if (filtros?.tipoTrabajoId)
      params.append("tipoTrabajoId", filtros.tipoTrabajoId.toString());
    if (filtros?.ubicacion) params.append("ubicacion", filtros.ubicacion);
    if (filtros?.busqueda) params.append("busqueda", filtros.busqueda);
    if (filtros?.estado) params.append("estado", filtros.estado);
    if (filtros?.pagina) params.append("pagina", filtros.pagina.toString());
    if (filtros?.limite) params.append("limite", filtros.limite.toString());
    if (filtros?.departamentoId)
      params.append("departamentoId", filtros.departamentoId.toString());

    const { data } = await api.get<ApiResponse<TrabajosPaginados>>(
      `/trabajos?${params.toString()}`,
    );
    return data.datos!;
  },

  /**
   * Obtener trabajo por ID
   */
  async obtenerTrabajoPorId(id: number): Promise<Trabajo> {
    const { data } = await api.get<ApiResponse<Trabajo>>(`/trabajos/${id}`);
    return data.datos!;
  },

  /**
   * Obtener mis trabajos publicados (empleador)
   */
  async obtenerMisTrabajos(): Promise<Trabajo[]> {
    const { data } = await api.get<ApiResponse<Trabajo[]>>(
      "/trabajos/mis-publicaciones",
    );
    return data.datos!;
  },

  /**
   * Obtener estadísticas de trabajos (empleador)
   */
  async obtenerEstadisticas(): Promise<any> {
    const { data } = await api.get<ApiResponse<any>>("/trabajos/estadisticas");
    return data.datos!;
  },

  /**
   * Crear un nuevo trabajo (empleador)
   */
  async crear(datos: CrearTrabajoDTO): Promise<Trabajo> {
    const { data } = await api.post<ApiResponse<Trabajo>>("/trabajos", datos);
    return data.datos!;
  },

  /**
   * Actualizar un trabajo (empleador)
   */
  async actualizar(id: number, datos: ActualizarTrabajoDTO): Promise<Trabajo> {
    const { data } = await api.put<ApiResponse<Trabajo>>(
      `/trabajos/${id}`,
      datos,
    );
    return data.datos!;
  },

  /**
   * Eliminar un trabajo (empleador)
   */
  async eliminar(id: number): Promise<void> {
    await api.delete(`/trabajos/${id}`);
  },

  /**
   * Buscar sugerencias de trabajos (solo títulos únicos)
   */
  async buscarSugerencias(query: string): Promise<string[]> {
    const { data } = await api.get<ApiResponse<any>>(
      `/trabajos/sugerencias?q=${encodeURIComponent(query)}`,
    );
    return data.datos!;
  },
};
