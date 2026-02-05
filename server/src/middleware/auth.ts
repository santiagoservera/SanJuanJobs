import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { ApiError } from "./errorHandler";
import { AuthService } from "../modules/auth/auth.service";
import { RolUsuario } from "../types";

const authService = new AuthService();

/**
 * Middleware de autenticación
 * Verifica que el usuario esté autenticado mediante JWT
 */
export const autenticar = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Token no proporcionado");
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // Verificar token
    const payload = authService.verificarToken(token);

    // Agregar usuario al request
    req.usuario = {
      id: payload.id,
      email: payload.email,
      rol: payload.rol,
    };

    console.log("✅ Usuario autenticado:", req.usuario); // Debug

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware para verificar roles
 * Verifica que el usuario tenga uno de los roles permitidos
 */
export const verificarRol = (...rolesPermitidos: RolUsuario[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      console.log("❌ No hay usuario en el request"); // Debug
      return next(new ApiError(401, "No autenticado"));
    }

    console.log("🔍 Verificando rol:", {
      rolUsuario: req.usuario.rol,
      rolesPermitidos,
      coincide: rolesPermitidos.includes(req.usuario.rol),
    }); // Debug

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return next(
        new ApiError(
          403,
          `No tienes permisos para realizar esta acción. Se requiere uno de estos roles: ${rolesPermitidos.join(
            ", "
          )}`
        )
      );
    }

    next();
  };
};
