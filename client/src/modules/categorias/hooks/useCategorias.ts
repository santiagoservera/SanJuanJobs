import { useQuery } from "@tanstack/react-query";
import { categoriasService } from "../services/categoriasService";

/**
 * Hook para obtener todas las categorías
 */
export const useCategorias = () => {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: categoriasService.obtenerCategorias,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

/**
 * Hook para obtener una categoría por ID
 */
export const useCategoria = (id: number) => {
  return useQuery({
    queryKey: ["categoria", id],
    queryFn: () => categoriasService.obtenerCategoriaPorId(id),
    enabled: !!id,
  });
};

/**
 * Hook para obtener una categoría por slug
 */
export const useCategoriaPorSlug = (slug: string) => {
  return useQuery({
    queryKey: ["categoria", slug],
    queryFn: () => categoriasService.obtenerCategoriaPorSlug(slug),
    enabled: !!slug,
  });
};
