/**
 * Tipos y interfaces para el módulo de tipos de trabajo
 */

/**
 * DTO para crear un tipo de trabajo (admin)
 */
export interface CrearTipoTrabajoDTO {
  nombre: string;
  slug: string;
}

/**
 * DTO para actualizar un tipo de trabajo (admin)
 */
export interface ActualizarTipoTrabajoDTO {
  nombre?: string;
  slug?: string;
}
