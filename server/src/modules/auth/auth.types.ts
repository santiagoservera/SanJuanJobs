/**
 * Tipos y interfaces para el módulo de autenticación
 */

import { RolUsuario } from "../../types";

/**
 * Datos para registro de nuevo usuario
 */
export interface RegistroDTO {
  email: string;
  contrasena: string;
  rol: RolUsuario;
  // Datos adicionales según el rol
  nombre?: string;
  apellido?: string;
  nombreEmpresa?: string;
}

/**
 * Datos para login
 */
export interface LoginDTO {
  email: string;
  contrasena: string;
}

/**
 * Respuesta de autenticación exitosa
 */
export interface AuthResponse {
  token: string;
  usuario: {
    id: number;
    email: string;
    rol: RolUsuario;
  };
}

/**
 * Payload del JWT
 */
export interface JWTPayload {
  id: number;
  email: string;
  rol: RolUsuario;
}
