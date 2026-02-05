import { api } from "@/shared/api/axios";
import type { ApiResponse } from "@/shared/types/api.types";
import type { Categoria } from "../types/categorias.types";

/**
 * Servicio para interactuar con el endpoint de categorías
 */
export const categoriasService = {
  /**
   * Obtener todas las categorías
   */
  async obtenerCategorias(): Promise<Categoria[]> {
    const { data } = await api.get<ApiResponse<Categoria[]>>("/categorias");
    return data.datos || [];
  },

  /**
   * Obtener categoría por ID
   */
  async obtenerCategoriaPorId(id: number): Promise<Categoria> {
    const { data } = await api.get<ApiResponse<Categoria>>(`/categorias/${id}`);
    return data.datos!;
  },

  /**
   * Obtener categoría por slug
   */
  async obtenerCategoriaPorSlug(slug: string): Promise<Categoria> {
    const { data } = await api.get<ApiResponse<Categoria>>(
      `/categorias/slug/${slug}`
    );
    return data.datos!;
  },
};
