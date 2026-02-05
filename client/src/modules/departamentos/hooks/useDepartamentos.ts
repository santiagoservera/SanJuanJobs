import { useQuery } from "@tanstack/react-query";
import { departamentosService } from "../services/departamentosService";

/**
 * Hook para obtener todos los departamentos
 * @param incluirConteo - Si es true, incluye la cantidad de trabajos activos
 */
export const useDepartamentos = (incluirConteo: boolean = false) => {
  return useQuery({
    queryKey: ["departamentos", { incluirConteo }],
    queryFn: () => departamentosService.obtenerDepartamentos(incluirConteo),
    staleTime: 1000 * 60 * 10, // 10 minutos (los departamentos no cambian)
  });
};

/**
 * Hook para obtener un departamento por slug
 */
export const useDepartamentoPorSlug = (slug: string) => {
  return useQuery({
    queryKey: ["departamento", slug],
    queryFn: () => departamentosService.obtenerDepartamentoPorSlug(slug),
    enabled: !!slug,
  });
};
