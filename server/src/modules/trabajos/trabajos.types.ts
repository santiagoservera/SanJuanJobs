/**
 * Tipos y interfaces para el módulo de trabajos
 */

import { EstadoTrabajo } from "../../types";

/**
 * DTO para crear un nuevo trabajo
 */
export interface CrearTrabajoDTO {
  titulo: string;
  descripcion: string;
  departamentoId: number; // Cambiado: ahora es departamentoId
  ubicacion?: string; // Opcional: dirección específica dentro del departamento
  googleMapsUrl?: string; // URL de Google Maps para ubicación exacta
  latitud?: number;
  longitud?: number;
  categoriaId: number;
  tipoTrabajoId: number;
  paga?: number;
  requisitos?: string;
  beneficios?: string;
  estado?: EstadoTrabajo;
}

/**
 * DTO para actualizar un trabajo
 */
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
  estado?: EstadoTrabajo;
}

/**
 * Filtros para listar trabajos
 */
export interface FiltrosTrabajos {
  categoriaId?: number;
  tipoTrabajoId?: number;
  departamentoId?: number; // Agregado para filtrar por departamento
  ubicacion?: string; // Búsqueda en dirección específica
  busqueda?: string; // Búsqueda en título y descripción
  estado?: EstadoTrabajo;
  pagina?: number;
  limite?: number;
}

/**
 * Respuesta paginada de trabajos
 */
export interface TrabajosPaginados {
  trabajos: any[];
  total: number;
  pagina: number;
  totalPaginas: number;
}
