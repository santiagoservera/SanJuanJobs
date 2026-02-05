export interface TipoTrabajo {
  id: number;
  nombre: string;
  slug: string;
  _count?: {
    trabajos: number;
  };
}
