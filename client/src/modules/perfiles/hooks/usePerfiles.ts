import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { perfilesService } from "../services/perfilesService";
import type {
  ActualizarPerfilEmpleadoDTO,
  ActualizarPerfilEmpleadorDTO,
  CambiarContrasenaDTO,
} from "../types/perfiles.types";
import { toast } from "sonner";

/**
 * Hook para actualizar perfil de empleado
 */
export const useActualizarPerfilEmpleado = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: ActualizarPerfilEmpleadoDTO) =>
      perfilesService.actualizarPerfilEmpleado(datos),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["auth", "perfil"] });
      const previousProfile = queryClient.getQueryData(["auth", "perfil"]);

      queryClient.setQueryData(["auth", "perfil"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          perfilEmpleado: {
            ...old.perfilEmpleado,
            ...newData,
          },
        };
      });

      return { previousProfile };
    },
    onSuccess: () => {
      toast.success("Perfil actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["auth", "perfil"] });
    },
    onError: (error: any, _newData, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(["auth", "perfil"], context.previousProfile);
      }

      const mensaje =
        error.response?.data?.mensaje || "Error al actualizar el perfil";
      toast.error(mensaje, {
        duration: 5000,
      });
    },
  });
};

/**
 * Hook para actualizar perfil de empleador
 */
export const useActualizarPerfilEmpleador = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: ActualizarPerfilEmpleadorDTO) =>
      perfilesService.actualizarPerfilEmpleador(datos),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["auth", "perfil"] });
      const previousProfile = queryClient.getQueryData(["auth", "perfil"]);

      queryClient.setQueryData(["auth", "perfil"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          perfilEmpleador: {
            ...old.perfilEmpleador,
            ...newData,
          },
        };
      });

      return { previousProfile };
    },
    onSuccess: () => {
      toast.success("Perfil actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["auth", "perfil"] });
    },
    onError: (error: any, _newData, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(["auth", "perfil"], context.previousProfile);
      }

      const mensaje =
        error.response?.data?.mensaje || "Error al actualizar el perfil";
      toast.error(mensaje, {
        duration: 5000,
      });
    },
  });
};

/**
 * Hook para cambiar contraseña
 */
export const useCambiarContrasena = () => {
  return useMutation({
    mutationFn: (datos: CambiarContrasenaDTO) =>
      perfilesService.cambiarContrasena(datos),
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente");
    },
    onError: (error: any) => {
      const mensaje =
        error.response?.data?.mensaje || "Error al cambiar la contraseña";
      toast.error(mensaje, {
        duration: 5000,
      });
    },
  });
};

/**
 * Hook para obtener perfil público de empleador
 */
export const usePerfilEmpleadorPublico = (empleadorId: number) => {
  return useQuery({
    queryKey: ["perfil-empleador-publico", empleadorId],
    queryFn: () => perfilesService.obtenerPerfilEmpleadorPublico(empleadorId),
    enabled: empleadorId > 0,
  });
};
