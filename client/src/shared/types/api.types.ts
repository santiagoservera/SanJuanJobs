/**
 * Tipos compartidos para las respuestas de la API
 */

export interface ApiResponse<T = any> {
  exito: boolean;
  mensaje: string;
  datos?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  trabajos?: T[];
  postulaciones?: T[];
  total: number;
  pagina: number;
  totalPaginas: number;
}
