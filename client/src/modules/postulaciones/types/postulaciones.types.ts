export type EstadoPostulacion =
  | "PENDIENTE"
  | "REVISADA"
  | "ACEPTADA"
  | "RECHAZADA";

export interface Postulacion {
  id: number;
  cartaPresentacion: string | null;
  estado: EstadoPostulacion;
  fechaPostulacion: string;
  fechaRevision: string | null;
  trabajo: {
    id: number;
    titulo: string;
    ubicacion: string;
    estado: string;
    empleador: {
      id: number;
      perfilEmpleador: {
        nombreEmpresa: string;
      } | null;
    };
  };
  empleado: {
    id: number;
    email: string;
    perfilEmpleado: {
      nombre: string;
      apellido: string;
      telefono: string | null;
      domicilio: string | null;
      sobreMi: string | null;
      experiencia: string | null;
      educacion: string | null;
    } | null;
  };
}

export interface CrearPostulacionDTO {
  trabajoId: number;
  cartaPresentacion?: string;
}

export interface PostulacionesPaginadas {
  postulaciones: Postulacion[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface EstadisticasPostulaciones {
  PENDIENTE: number;
  REVISADA: number;
  ACEPTADA: number;
  RECHAZADA: number;
  total: number;
}
