export interface ActualizarPerfilEmpleadoDTO {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  domicilio?: string;
  sobreMi?: string;
  experiencia?: string;
  educacion?: string;
}

export interface ActualizarPerfilEmpleadorDTO {
  nombreEmpresa?: string;
  descripcionEmpresa?: string;
  emailContacto?: string;
  telefonoContacto?: string;
  sitioWeb?: string;
}

export interface CambiarContrasenaDTO {
  contrasenaActual: string;
  contrasenaNueva: string;
}
