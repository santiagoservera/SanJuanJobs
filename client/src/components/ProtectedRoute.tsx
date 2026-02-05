import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: Array<"EMPLEADO" | "EMPLEADOR" | "ADMIN">;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  requireAuth = true,
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) => {
  const { isAuthenticated, usuario, isLoadingPerfil } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si requiere autenticación y no está autenticado
    if (requireAuth && !isLoadingPerfil && !isAuthenticated) {
      toast.error("Necesitás iniciar sesión para acceder a esta página");
      navigate(redirectTo, { replace: true });
    }

    // Si está autenticado pero no tiene el rol permitido
    if (
      requireAuth &&
      !isLoadingPerfil &&
      isAuthenticated &&
      allowedRoles &&
      usuario?.rol &&
      !allowedRoles.includes(usuario.rol as any)
    ) {
      toast.error("No tenés permisos para acceder a esta página");

      // Redirigir al dashboard correspondiente según su rol
      if (usuario.rol === "EMPLEADO") {
        navigate("/dashboard/empleado", { replace: true });
      } else if (usuario.rol === "EMPLEADOR") {
        navigate("/dashboard/empleador", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [
    requireAuth,
    isAuthenticated,
    isLoadingPerfil,
    allowedRoles,
    usuario,
    navigate,
    redirectTo,
  ]);

  // Mostrar loader mientras se verifica la autenticación
  if (requireAuth && isLoadingPerfil) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si requiere autenticación y no está autenticado
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si requiere roles específicos y no los tiene
  if (
    requireAuth &&
    isAuthenticated &&
    allowedRoles &&
    usuario?.rol &&
    !allowedRoles.includes(usuario.rol as any)
  ) {
    // Redirigir según rol
    if (usuario.rol === "EMPLEADO") {
      return <Navigate to="/dashboard/empleado" replace />;
    } else if (usuario.rol === "EMPLEADOR") {
      return <Navigate to="/dashboard/empleador" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Si pasa todas las validaciones, renderizar el componente
  return <>{children}</>;
};
