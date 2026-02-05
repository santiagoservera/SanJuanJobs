/**
 * Tipos y interfaces para el módulo de departamentos
 */

/**
 * Departamento básico
 */
export interface DepartamentoDTO {
  id: number;
  nombre: string;
  slug: string;
  codigo: string | null;
}

/**
 * Departamento con conteo de trabajos
 */
export interface DepartamentoConTrabajos extends DepartamentoDTO {
  _count: {
    trabajos: number;
  };
}
