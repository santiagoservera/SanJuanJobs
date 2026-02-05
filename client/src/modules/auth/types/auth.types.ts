/**
 * Tipos para el módulo de autenticación
 */

export type RolUsuario = "EMPLEADO" | "EMPLEADOR" | "ADMIN";

export interface Usuario {
  id: number;
  email: string;
  rol: RolUsuario;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface LoginDTO {
  email: string;
  contrasena: string;
}

export interface RegistroEmpleadoDTO {
  email: string;
  contrasena: string;
  rol: "EMPLEADO";
  nombre: string;
  apellido: string;
}

export interface RegistroEmpleadorDTO {
  email: string;
  contrasena: string;
  rol: "EMPLEADOR";
  nombreEmpresa: string;
}

export type RegistroDTO = RegistroEmpleadoDTO | RegistroEmpleadorDTO;

export interface PerfilCompleto {
  id: number;
  email: string;
  rol: RolUsuario;
  fechaCreacion: string;
  perfilEmpleado?: {
    id: number;
    nombre: string;
    apellido: string;
    domicilio: string | null;
    telefono: string | null;
    sobreMi: string | null;
    experiencia: string | null;
    educacion: string | null;
  };
  perfilEmpleador?: {
    id: number;
    nombreEmpresa: string;
    descripcionEmpresa: string | null;
    emailContacto: string | null;
    telefonoContacto: string | null;
    sitioWeb: string | null;
  };
}
