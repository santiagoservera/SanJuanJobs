export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  _count?: {
    trabajos: number;
  };
}
