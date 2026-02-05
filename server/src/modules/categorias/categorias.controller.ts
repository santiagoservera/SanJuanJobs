import { Request, Response } from "express";
import { CategoriasService } from "./categorias.service";
import { AuthRequest, ApiResponse } from "../../types";
import { CrearCategoriaDTO, ActualizarCategoriaDTO } from "./categorias.types";

/**
 * Controlador de categorías
 * Maneja las peticiones HTTP relacionadas con categorías
 */
export class CategoriasController {
  private categoriasService: CategoriasService;

  constructor() {
    this.categoriasService = new CategoriasService();
  }

  /**
   * GET /api/categorias
   * Listar todas las categorías (público)
   */
  async listar(req: Request, res: Response) {
    const categorias = await this.categoriasService.listar();

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Categorías obtenidas exitosamente",
      datos: categorias,
    };

    res.json(respuesta);
  }

  /**
   * GET /api/categorias/:id
   * Obtener una categoría por ID (público)
   */
  async obtenerPorId(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    const categoria = await this.categoriasService.obtenerPorId(id);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Categoría obtenida exitosamente",
      datos: categoria,
    };

    res.json(respuesta);
  }

  /**
   * GET /api/categorias/slug/:slug
   * Obtener una categoría por slug (público)
   */
  async obtenerPorSlug(req: Request, res: Response) {
    const slug = req.params.slug;

    const categoria = await this.categoriasService.obtenerPorSlug(slug);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Categoría obtenida exitosamente",
      datos: categoria,
    };

    res.json(respuesta);
  }

  /**
   * POST /api/categorias
   * Crear una categoría (solo ADMIN)
   */
  async crear(req: AuthRequest, res: Response) {
    const datos: CrearCategoriaDTO = req.body;

    const categoria = await this.categoriasService.crear(datos);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Categoría creada exitosamente",
      datos: categoria,
    };

    res.status(201).json(respuesta);
  }

  /**
   * PUT /api/categorias/:id
   * Actualizar una categoría (solo ADMIN)
   */
  async actualizar(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    const datos: ActualizarCategoriaDTO = req.body;

    const categoria = await this.categoriasService.actualizar(id, datos);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Categoría actualizada exitosamente",
      datos: categoria,
    };

    res.json(respuesta);
  }

  /**
   * DELETE /api/categorias/:id
   * Eliminar una categoría (solo ADMIN)
   */
  async eliminar(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);

    await this.categoriasService.eliminar(id);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Categoría eliminada exitosamente",
    };

    res.json(respuesta);
  }
}
