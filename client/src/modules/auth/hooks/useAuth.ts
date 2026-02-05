import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import type { LoginDTO, RegistroDTO } from "../types/auth.types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * Hook principal de autenticación
 */
export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Query para obtener el perfil del usuario autenticado
  const { data: perfil, isLoading: isLoadingPerfil } = useQuery({
    queryKey: ["perfil"],
    queryFn: authService.obtenerPerfil,
    enabled: authService.isAuthenticated(),
    retry: false,
  });

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: (datos: LoginDTO) => authService.login(datos),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["perfil"] });
      toast.success("¡Bienvenido de vuelta!");

      // Redirigir según el rol
      if (data.usuario.rol === "EMPLEADOR") {
        navigate("/dashboard/empleador");
      } else if (data.usuario.rol === "EMPLEADO") {
        navigate("/dashboard/empleado");
      } else {
        navigate("/");
      }
    },
    onError: (error: any) => {
      const mensaje =
        error.response?.data?.mensaje || "Error al iniciar sesión";
      toast.error(mensaje);
    },
  });

  // Mutation para registro
  const registroMutation = useMutation({
    mutationFn: (datos: RegistroDTO) => authService.registro(datos),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["perfil"] });
      toast.success("¡Cuenta creada exitosamente!");

      // Redirigir según el rol
      if (data.usuario.rol === "EMPLEADOR") {
        navigate("/dashboard/empleador");
      } else if (data.usuario.rol === "EMPLEADO") {
        navigate("/dashboard/empleado");
      } else {
        navigate("/");
      }
    },
    onError: (error: any) => {
      const mensaje = error.response?.data?.mensaje || "Error al registrarse";
      toast.error(mensaje);
    },
  });

  // Función para cerrar sesión
  const logout = () => {
    authService.logout();
    queryClient.clear();
    navigate("/");
    toast.success("Sesión cerrada correctamente");
  };

  return {
    // Estado
    perfil,
    isLoadingPerfil,
    isAuthenticated: authService.isAuthenticated(),
    usuario: authService.getUsuario(),

    // Mutaciones
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    registro: registroMutation.mutate,
    isRegistering: registroMutation.isPending,
    logout,
  };
};
