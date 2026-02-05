/**
 * Tipos para el módulo de departamentos
 */

export interface Departamento {
  id: number;
  nombre: string;
  slug: string;
  codigo: string | null;
  _count?: {
    trabajos: number;
  };
}
