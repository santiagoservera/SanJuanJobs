import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postulacionesService } from "../services/postulacionesService";
import type { CrearPostulacionDTO } from "../types/postulaciones.types";
import { toast } from "sonner";

/**
 * Hook para crear una postulación
 */
export const useCrearPostulacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: CrearPostulacionDTO) =>
      postulacionesService.crear(datos),
    onSuccess: () => {
      // Invalidar cache de postulaciones
      queryClient.invalidateQueries({ queryKey: ["postulaciones"] });
      queryClient.invalidateQueries({ queryKey: ["mis-postulaciones"] });
      queryClient.invalidateQueries({ queryKey: ["ya-postulado"] });
    },
  });
};

/**
 * Hook para obtener mis postulaciones (empleado)
 */
export const useMisPostulaciones = () => {
  return useQuery({
    queryKey: ["mis-postulaciones"],
    queryFn: postulacionesService.obtenerMisPostulaciones,
  });
};

/**
 * Hook para obtener postulaciones recibidas (empleador)
 */
export const usePostulacionesRecibidas = () => {
  return useQuery({
    queryKey: ["postulaciones-recibidas"],
    queryFn: postulacionesService.obtenerPostulacionesRecibidas,
  });
};

/**
 * Hook para obtener una postulación por ID
 */
export const usePostulacion = (id: number) => {
  return useQuery({
    queryKey: ["postulacion", id],
    queryFn: () => postulacionesService.obtenerPorId(id),
    enabled: !!id,
  });
};

/**
 * Hook para eliminar una postulación
 */
export const useEliminarPostulacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postulacionesService.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postulaciones"] });
      queryClient.invalidateQueries({ queryKey: ["mis-postulaciones"] });
      toast.success("Postulación eliminada correctamente");
    },
  });
};

/**
 * Hook para obtener estadísticas (empleador)
 */
export const useEstadisticasPostulaciones = () => {
  return useQuery({
    queryKey: ["estadisticas-postulaciones"],
    queryFn: postulacionesService.obtenerEstadisticas,
  });
};

/**
 * Hook para verificar si ya me postulé a un trabajo
 */
export const useYaPostulado = (trabajoId: number) => {
  return useQuery({
    queryKey: ["ya-postulado", trabajoId],
    queryFn: async () => {
      try {
        const postulaciones =
          await postulacionesService.obtenerMisPostulaciones();
        return postulaciones.postulaciones.some(
          (p) => p.trabajo.id === trabajoId,
        );
      } catch {
        return false;
      }
    },
    enabled: !!trabajoId,
  });
};

/**
 * Hook para obtener postulaciones de un trabajo específico (empleador)
 */
export const usePostulacionesPorTrabajo = (trabajoId: number | null) => {
  return useQuery({
    queryKey: ["postulaciones-trabajo", trabajoId],
    queryFn: () =>
      postulacionesService.obtenerPostulacionesPorTrabajo(trabajoId!),
    enabled: !!trabajoId,
  });
};

/**
 * Hook para actualizar estado de una postulación
 */
export const useActualizarEstadoPostulacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) =>
      postulacionesService.actualizarEstado(id, estado),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["postulaciones-trabajo"] });
      queryClient.invalidateQueries({ queryKey: ["postulaciones-recibidas"] });
      queryClient.invalidateQueries({ queryKey: ["estadisticas-trabajos"] });
      toast.success(
        variables.estado === "ACEPTADA"
          ? "Postulación aceptada"
          : "Postulación rechazada",
      );
    },
    onError: (error: any) => {
      const mensaje =
        error.response?.data?.mensaje || "Error al actualizar la postulación";
      toast.error(mensaje);
    },
  });
};
