import { api } from "@/shared/api/axios";
import type { ApiResponse } from "@/shared/types/api.types";
import type { Departamento } from "../types/departamentos.types";

/**
 * Servicio para interactuar con el endpoint de departamentos
 */
export const departamentosService = {
  /**
   * Obtener todos los departamentos
   * @param incluirConteo - Si es true, incluye la cantidad de trabajos activos
   */
  async obtenerDepartamentos(
    incluirConteo: boolean = false,
  ): Promise<Departamento[]> {
    const params = incluirConteo ? "?incluirConteo=true" : "";
    const { data } = await api.get<ApiResponse<Departamento[]>>(
      `/departamentos${params}`,
    );
    return data.datos || [];
  },

  /**
   * Obtener departamento por slug
   */
  async obtenerDepartamentoPorSlug(slug: string): Promise<Departamento> {
    const { data } = await api.get<ApiResponse<Departamento>>(
      `/departamentos/${slug}`,
    );
    return data.datos!;
  },
};
