import { api } from "@/shared/api/axios";
import type { ApiResponse } from "@/shared/types/api.types";
import type {
  ActualizarPerfilEmpleadoDTO,
  ActualizarPerfilEmpleadorDTO,
  CambiarContrasenaDTO,
} from "../types/perfiles.types";

/**
 * Servicio para interactuar con el endpoint de perfiles
 */
export const perfilesService = {
  /**
   * Actualizar perfil de empleado
   */
  async actualizarPerfilEmpleado(
    datos: ActualizarPerfilEmpleadoDTO
  ): Promise<any> {
    const { data } = await api.put<ApiResponse<any>>("/perfil/empleado", datos);
    return data.datos!;
  },

  /**
   * Actualizar perfil de empleador
   */
  async actualizarPerfilEmpleador(
    datos: ActualizarPerfilEmpleadorDTO
  ): Promise<any> {
    const { data } = await api.put<ApiResponse<any>>(
      "/perfil/empleador",
      datos
    );
    return data.datos!;
  },

  /**
   * Cambiar contraseña
   */
  async cambiarContrasena(datos: CambiarContrasenaDTO): Promise<void> {
    await api.put("/perfil/contrasena", datos);
  },

  /**
   * Obtener perfil público de empleador
   */
  async obtenerPerfilEmpleadorPublico(empleadorId: number): Promise<any> {
    const { data } = await api.get<ApiResponse<any>>(
      `/perfil/empleador/${empleadorId}/publico`
    );
    return data.datos!;
  },
};
