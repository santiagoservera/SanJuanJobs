/**
 * Tipos y interfaces para el módulo de categorías
 */

/**
 * DTO para crear una categoría (admin)
 */
export interface CrearCategoriaDTO {
  nombre: string;
  slug: string;
  descripcion?: string;
}

/**
 * DTO para actualizar una categoría (admin)
 */
export interface ActualizarCategoriaDTO {
  nombre?: string;
  slug?: string;
  descripcion?: string;
}
