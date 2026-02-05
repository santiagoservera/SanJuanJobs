import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";

/**
 * Clase para errores personalizados de la API
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public mensaje: string,
    public detalles?: any
  ) {
    super(mensaje);
    this.name = "ApiError";
  }
}

/**
 * Middleware para manejo centralizado de errores
 */
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("❌ Error:", err);

  // Error personalizado de la API
  if (err instanceof ApiError) {
    const respuesta: ApiResponse = {
      exito: false,
      mensaje: err.mensaje,
      error: err.detalles,
    };
    return res.status(err.statusCode).json(respuesta);
  }

  // Error de validación de Prisma
  if (err.name === "PrismaClientValidationError") {
    const respuesta: ApiResponse = {
      exito: false,
      mensaje: "Error de validación en la base de datos",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    };
    return res.status(400).json(respuesta);
  }

  // Error desconocido
  const respuesta: ApiResponse = {
    exito: false,
    mensaje: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  };

  res.status(500).json(respuesta);
};

/**
 * Middleware para rutas no encontradas
 */
export const notFoundHandler = (req: Request, res: Response) => {
  const respuesta: ApiResponse = {
    exito: false,
    mensaje: `Ruta no encontrada: ${req.method} ${req.path}`,
  };
  res.status(404).json(respuesta);
};
