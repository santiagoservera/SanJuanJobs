import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import { ApiError } from "./errorHandler";

/**
 * Middleware para validar peticiones usando express-validator
 */
export const validar = (validaciones: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Ejecutar todas las validaciones
    await Promise.all(validaciones.map((validacion) => validacion.run(req)));

    // Verificar si hay errores
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
      const mensajesError = errores.array().map((err) => ({
        campo: err.type === "field" ? err.path : "desconocido",
        mensaje: err.msg,
      }));

      throw new ApiError(400, "Errores de validación", mensajesError);
    }

    next();
  };
};
