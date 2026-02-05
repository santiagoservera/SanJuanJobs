import { Request } from "express";

/**
 * Tipos enumerados para el sistema
 * (SQL Server no soporta enums nativos, pero TypeScript sí)
 */

// Roles de usuario
export type RolUsuario = "EMPLEADO" | "EMPLEADOR" | "ADMIN";

// Estados de trabajo
export type EstadoTrabajo = "ACTIVO" | "CERRADO" | "BORRADOR";

// Estados de postulación
export type EstadoPostulacion =
  | "PENDIENTE"
  | "REVISADA"
  | "ACEPTADA"
  | "RECHAZADA";

/**
 * Extensión del objeto Request de Express
 * Agrega información del usuario autenticado
 */
export interface AuthRequest extends Request {
  usuario?: {
    id: number;
    email: string;
    rol: RolUsuario;
  };
}

/**
 * Respuesta estándar de la API
 */
export interface ApiResponse<T = any> {
  exito: boolean;
  mensaje: string;
  datos?: T;
  error?: string;
}

/**
 * Constantes para validación
 */
export const ROLES_USUARIO: RolUsuario[] = ["EMPLEADO", "EMPLEADOR", "ADMIN"];
export const ESTADOS_TRABAJO: EstadoTrabajo[] = [
  "ACTIVO",
  "CERRADO",
  "BORRADOR",
];
export const ESTADOS_POSTULACION: EstadoPostulacion[] = [
  "PENDIENTE",
  "REVISADA",
  "ACEPTADA",
  "RECHAZADA",
];
