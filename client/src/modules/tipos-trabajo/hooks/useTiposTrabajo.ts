import { useQuery } from "@tanstack/react-query";
import { tiposTrabajoService } from "../services/tiposTrabajoService";

/**
 * Hook para obtener tipos de trabajo
 */
export const useTiposTrabajo = () => {
  return useQuery({
    queryKey: ["tipos-trabajo"],
    queryFn: tiposTrabajoService.obtenerTodos,
  });
};
