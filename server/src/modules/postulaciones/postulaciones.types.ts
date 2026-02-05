/**
 * Tipos y interfaces para el módulo de postulaciones
 */

import { EstadoPostulacion } from "../../types";

/**
 * DTO para crear una postulación
 */
export interface CrearPostulacionDTO {
  trabajoId: number;
  cartaPresentacion?: string;
}

/**
 * DTO para actualizar el estado de una postulación
 */
export interface ActualizarEstadoDTO {
  estado: EstadoPostulacion;
}

/**
 * Filtros para listar postulaciones
 */
export interface FiltrosPostulaciones {
  estado?: EstadoPostulacion;
  trabajoId?: number;
  pagina?: number;
  limite?: number;
}

/**
 * Respuesta paginada de postulaciones
 */
export interface PostulacionesPaginadas {
  postulaciones: any[];
  total: number;
  pagina: number;
  totalPaginas: number;
}
