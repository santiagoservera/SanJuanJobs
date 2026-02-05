import { Request, Response } from "express";
import { TiposTrabajoService } from "./tipos-trabajo.service";
import { AuthRequest, ApiResponse } from "../../types";
import {
  CrearTipoTrabajoDTO,
  ActualizarTipoTrabajoDTO,
} from "./tipos-trabajo.types";

/**
 * Controlador de tipos de trabajo
 * Maneja las peticiones HTTP relacionadas con tipos de trabajo
 */
export class TiposTrabajoController {
  private tiposTrabajoService: TiposTrabajoService;

  constructor() {
    this.tiposTrabajoService = new TiposTrabajoService();
  }

  /**
   * GET /api/tipos-trabajo
   * Listar todos los tipos de trabajo (público)
   */
  async listar(req: Request, res: Response) {
    const tipos = await this.tiposTrabajoService.listar();

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Tipos de trabajo obtenidos exitosamente",
      datos: tipos,
    };

    res.json(respuesta);
  }

  /**
   * GET /api/tipos-trabajo/:id
   * Obtener un tipo de trabajo por ID (público)
   */
  async obtenerPorId(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    const tipo = await this.tiposTrabajoService.obtenerPorId(id);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Tipo de trabajo obtenido exitosamente",
      datos: tipo,
    };

    res.json(respuesta);
  }

  /**
   * GET /api/tipos-trabajo/slug/:slug
   * Obtener un tipo de trabajo por slug (público)
   */
  async obtenerPorSlug(req: Request, res: Response) {
    const slug = req.params.slug;

    const tipo = await this.tiposTrabajoService.obtenerPorSlug(slug);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Tipo de trabajo obtenido exitosamente",
      datos: tipo,
    };

    res.json(respuesta);
  }

  /**
   * POST /api/tipos-trabajo
   * Crear un tipo de trabajo (solo ADMIN)
   */
  async crear(req: AuthRequest, res: Response) {
    const datos: CrearTipoTrabajoDTO = req.body;

    const tipo = await this.tiposTrabajoService.crear(datos);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Tipo de trabajo creado exitosamente",
      datos: tipo,
    };

    res.status(201).json(respuesta);
  }

  /**
   * PUT /api/tipos-trabajo/:id
   * Actualizar un tipo de trabajo (solo ADMIN)
   */
  async actualizar(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    const datos: ActualizarTipoTrabajoDTO = req.body;

    const tipo = await this.tiposTrabajoService.actualizar(id, datos);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Tipo de trabajo actualizado exitosamente",
      datos: tipo,
    };

    res.json(respuesta);
  }

  /**
   * DELETE /api/tipos-trabajo/:id
   * Eliminar un tipo de trabajo (solo ADMIN)
   */
  async eliminar(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);

    await this.tiposTrabajoService.eliminar(id);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Tipo de trabajo eliminado exitosamente",
    };

    res.json(respuesta);
  }
}
