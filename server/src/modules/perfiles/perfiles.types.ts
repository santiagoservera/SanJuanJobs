/**
 * Tipos y interfaces para el módulo de perfiles
 */

/**
 * DTO para actualizar perfil de empleado
 */
export interface ActualizarPerfilEmpleadoDTO {
  nombre?: string;
  apellido?: string;
  domicilio?: string;
  telefono?: string;
  sobreMi?: string;
  experiencia?: string;
  educacion?: string;
}

/**
 * DTO para actualizar perfil de empleador
 */
export interface ActualizarPerfilEmpleadorDTO {
  nombreEmpresa?: string;
  descripcionEmpresa?: string;
  emailContacto?: string;
  telefonoContacto?: string;
  sitioWeb?: string;
}

/**
 * DTO para cambiar contraseña
 */
export interface CambiarContrasenaDTO {
  contrasenaActual: string;
  contrasenaNueva: string;
}

export interface PerfilEmpleadorPublicoResponse {
  id: number;
  perfilEmpleador: {
    nombreEmpresa: string;
    descripcionEmpresa: string | null;
    emailContacto: string | null;
    telefonoContacto: string | null;
    sitioWeb: string | null;
  };
  trabajos: Array<{
    id: number;
    titulo: string;
    ubicacion: string;
    fechaCreacion: Date;
    tipoTrabajo: {
      nombre: string;
      slug: string;
    };
    categoria: {
      nombre: string;
    };
    _count: {
      postulaciones: number;
    };
  }>;
  estadisticas: {
    totalTrabajos: number;
    trabajosActivos: number;
  };
}
