import { api } from "@/shared/api/axios";
import type { ApiResponse } from "@/shared/types/api.types";
import type {
  LoginDTO,
  RegistroDTO,
  AuthResponse,
  PerfilCompleto,
} from "../types/auth.types";

/**
 * Servicio para interactuar con el endpoint de autenticación
 */
export const authService = {
  /**
   * Iniciar sesión
   */
  async login(datos: LoginDTO): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      datos
    );

    // Guardar token en localStorage
    if (data.datos?.token) {
      localStorage.setItem("token", data.datos.token);
      localStorage.setItem("usuario", JSON.stringify(data.datos.usuario));
    }

    return data.datos!;
  },

  /**
   * Registrar nuevo usuario
   */
  async registro(datos: RegistroDTO): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      "/auth/registro",
      datos
    );

    // Guardar token en localStorage
    if (data.datos?.token) {
      localStorage.setItem("token", data.datos.token);
      localStorage.setItem("usuario", JSON.stringify(data.datos.usuario));
    }

    return data.datos!;
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  async obtenerPerfil(): Promise<PerfilCompleto> {
    const { data } = await api.get<ApiResponse<PerfilCompleto>>("/auth/me");
    return data.datos!;
  },

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  },

  /**
   * Obtener token del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem("token");
  },

  /**
   * Obtener usuario del localStorage
   */
  getUsuario(): any | null {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
