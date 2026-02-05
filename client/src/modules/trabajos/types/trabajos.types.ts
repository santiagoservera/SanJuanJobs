export interface Trabajo {
  id: number;
  titulo: string;
  descripcion: string;
  ubicacion: string | null;
  googleMapsUrl: string | null;
  latitud?: number;
  longitud?: number;
  paga: number | null;
  requisitos: string | null;
  beneficios: string | null;
  estado: "ACTIVO" | "CERRADO" | "BORRADOR";
  fechaCreacion: string;
  fechaActualizacion: string;
  categoria: {
    id: number;
    nombre: string;
    slug: string;
  };
  tipoTrabajo: {
    id: number;
    nombre: string;
    slug: string;
  };
  departamento: {
    id: number;
    nombre: string;
    slug: string;
  };
  empleador: {
    id: number;
    email: string;
    perfilEmpleador: {
      nombreEmpresa: string;
      descripcionEmpresa?: string | null;
      emailContacto?: string | null;
      telefonoContacto?: string | null;
      sitioWeb?: string | null;
    } | null;
  };
  _count?: {
    postulaciones: number;
  };
}

export interface FiltrosTrabajos {
  categoriaId?: number;
  tipoTrabajoId?: number;
  departamentoId?: number;
  ubicacion?: string;
  busqueda?: string;
  estado?: "ACTIVO" | "CERRADO" | "BORRADOR";
  pagina?: number;
  limite?: number;
}

export interface TrabajosPaginados {
  trabajos: Trabajo[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface CrearTrabajoDTO {
  titulo: string;
  descripcion: string;
  departamentoId: number;
  ubicacion?: string;
  googleMapsUrl?: string;
  latitud?: number;
  longitud?: number;
  categoriaId: number;
  tipoTrabajoId: number;
  paga?: number;
  requisitos?: string;
  beneficios?: string;
  estado?: "ACTIVO" | "CERRADO" | "BORRADOR";
}

export interface ActualizarTrabajoDTO {
  titulo?: string;
  descripcion?: string;
  departamentoId?: number;
  ubicacion?: string;
  googleMapsUrl?: string;
  latitud?: number;
  longitud?: number;
  categoriaId?: number;
  tipoTrabajoId?: number;
  paga?: number;
  requisitos?: string;
  beneficios?: string;
  estado?: "ACTIVO" | "CERRADO" | "BORRADOR";
}
