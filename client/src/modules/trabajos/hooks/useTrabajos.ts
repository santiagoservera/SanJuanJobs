import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trabajosService } from "../services/trabajosService";
import type {
  FiltrosTrabajos,
  CrearTrabajoDTO,
  ActualizarTrabajoDTO,
} from "../types/trabajos.types";
import { toast } from "sonner";

/**
 * Hook para obtener trabajos con filtros
 */
export const useTrabajos = (filtros?: FiltrosTrabajos) => {
  return useQuery({
    queryKey: ["trabajos", filtros],
    queryFn: () => trabajosService.obtenerTrabajos(filtros),
  });
};

/**
 * Hook para obtener un trabajo por ID
 */
export const useTrabajo = (id: number) => {
  return useQuery({
    queryKey: ["trabajo", id],
    queryFn: () => trabajosService.obtenerTrabajoPorId(id),
    enabled: !!id,
  });
};

/**
 * Hook para obtener mis trabajos publicados (empleador)
 */
export const useMisTrabajos = () => {
  return useQuery({
    queryKey: ["mis-trabajos"],
    queryFn: trabajosService.obtenerMisTrabajos,
  });
};

/**
 * Hook para obtener estadísticas (empleador)
 */
export const useEstadisticasTrabajos = () => {
  return useQuery({
    queryKey: ["estadisticas-trabajos"],
    queryFn: trabajosService.obtenerEstadisticas,
  });
};

/**
 * Hook para crear un trabajo
 */
export const useCrearTrabajo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: CrearTrabajoDTO) => trabajosService.crear(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mis-trabajos"] });
      queryClient.invalidateQueries({ queryKey: ["estadisticas-trabajos"] });
      toast.success("Trabajo publicado exitosamente");
    },
    onError: (error: any) => {
      const mensaje =
        error.response?.data?.mensaje || "Error al crear el trabajo";
      toast.error(mensaje, { duration: 5000 });
    },
  });
};

/**
 * Hook para actualizar un trabajo
 */
export const useActualizarTrabajo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: ActualizarTrabajoDTO }) =>
      trabajosService.actualizar(id, datos),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mis-trabajos"] });
      queryClient.invalidateQueries({ queryKey: ["trabajo", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["estadisticas-trabajos"] });
      toast.success("Trabajo actualizado exitosamente");
    },
    onError: (error: any) => {
      const mensaje =
        error.response?.data?.mensaje || "Error al actualizar el trabajo";
      toast.error(mensaje, { duration: 5000 });
    },
  });
};

/**
 * Hook para eliminar un trabajo
 */
export const useEliminarTrabajo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => trabajosService.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mis-trabajos"] });
      queryClient.invalidateQueries({ queryKey: ["estadisticas-trabajos"] });
      toast.success("Trabajo eliminado exitosamente");
    },
    onError: (error: any) => {
      const mensaje =
        error.response?.data?.mensaje || "Error al eliminar el trabajo";
      toast.error(mensaje, { duration: 5000 });
    },
  });
};

/**
 * Hook para buscar sugerencias de trabajos
 */
export const useBuscarSugerencias = (
  query: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["sugerencias-trabajos", query],
    queryFn: () => trabajosService.buscarSugerencias(query),
    enabled: enabled && query.length >= 2,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });
};
