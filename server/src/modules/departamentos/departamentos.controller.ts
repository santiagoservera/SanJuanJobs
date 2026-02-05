import { Request, Response } from "express";
import { DepartamentosService } from "./departamentos.service";
import { ApiResponse } from "../../types";

/**
 * Controlador de departamentos
 * Maneja las peticiones HTTP relacionadas con departamentos
 */
export class DepartamentosController {
  private departamentosService: DepartamentosService;

  constructor() {
    this.departamentosService = new DepartamentosService();
  }

  /**
   * GET /api/departamentos
   * Listar todos los departamentos
   */
  async listar(req: Request, res: Response) {
    // Query param para incluir conteo de trabajos
    const incluirConteo = req.query.incluirConteo === "true";

    const departamentos = await this.departamentosService.listar(incluirConteo);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Departamentos obtenidos exitosamente",
      datos: departamentos,
    };

    res.json(respuesta);
  }

  /**
   * GET /api/departamentos/:slug
   * Obtener un departamento por slug
   */
  async obtenerPorSlug(req: Request, res: Response) {
    const { slug } = req.params;

    const departamento = await this.departamentosService.obtenerPorSlug(slug);

    if (!departamento) {
      const respuesta: ApiResponse = {
        exito: false,
        mensaje: "Departamento no encontrado",
      };
      return res.status(404).json(respuesta);
    }

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Departamento obtenido exitosamente",
      datos: departamento,
    };

    res.json(respuesta);
  }
}
