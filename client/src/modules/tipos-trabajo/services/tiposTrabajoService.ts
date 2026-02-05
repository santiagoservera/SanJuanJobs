import { api } from "@/shared/api/axios";
import type { ApiResponse } from "@/shared/types/api.types";
import type { TipoTrabajo } from "../types/tipos-trabajo.types";

/**
 * Servicio para interactuar con el endpoint de tipos de trabajo
 */
export const tiposTrabajoService = {
  /**
   * Obtener todos los tipos de trabajo
   */
  async obtenerTodos(): Promise<TipoTrabajo[]> {
    const { data } = await api.get<ApiResponse<TipoTrabajo[]>>(
      "/tipos-trabajo"
    );
    return data.datos!;
  },
};
