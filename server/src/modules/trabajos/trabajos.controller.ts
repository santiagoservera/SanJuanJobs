import { Response, Request } from "express";
import { TrabajosService } from "./trabajos.service";
import { AuthRequest, ApiResponse } from "../../types";
import {
  CrearTrabajoDTO,
  ActualizarTrabajoDTO,
  FiltrosTrabajos,
} from "./trabajos.types";
import { ApiError } from "../../middleware/errorHandler";

/**
 * Controlador de trabajos
 * Maneja las peticiones HTTP relacionadas con ofertas laborales
 */
export class TrabajosController {
  private trabajosService: TrabajosService;

  constructor() {
    this.trabajosService = new TrabajosService();
  }

  /**
   * GET /api/trabajos
   * Listar trabajos con filtros
   */
  async listar(req: AuthRequest, res: Response) {
    const filtros: FiltrosTrabajos = {
      categoriaId: req.query.categoriaId
        ? parseInt(req.query.categoriaId as string)
        : undefined,
      tipoTrabajoId: req.query.tipoTrabajoId
        ? parseInt(req.query.tipoTrabajoId as string)
        : undefined,
      departamentoId: req.query.departamentoId
        ? parseInt(req.query.departamentoId as string)
        : undefined,
      ubicacion: req.query.ubicacion as string,
      busqueda: req.query.busqueda as string,
      estado: req.query.estado as any,
      pagina: req.query.pagina ? parseInt(req.query.pagina as string) : 1,
      limite: req.query.limite ? parseInt(req.query.limite as string) : 10,
    };

    const resultado = await this.trabajosService.listar(filtros);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Trabajos obtenidos exitosamente",
      datos: resultado,
    };

    res.json(respuesta);
  }

  /**
   * GET /api/trabajos/:id
   * Obtener un trabajo por ID
   */
  async obtenerPorId(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);

    const trabajo = await this.trabajosService.obtenerPorId(id);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Trabajo obtenido exitosamente",
      datos: trabajo,
    };

    res.json(respuesta);
  }

  /**
   * POST /api/trabajos
   * Crear un nuevo trabajo (solo EMPLEADOR)
   */
  async crear(req: AuthRequest, res: Response) {
    // Verificar que el usuario es empleador
    if (req.usuario!.rol !== "EMPLEADOR") {
      throw new ApiError(403, "Solo los empleadores pueden crear trabajos");
    }

    const datos: CrearTrabajoDTO = req.body;
    const empleadorId = req.usuario!.id;

    const trabajo = await this.trabajosService.crear(empleadorId, datos);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Trabajo creado exitosamente",
      datos: trabajo,
    };

    res.status(201).json(respuesta);
  }

  /**
   * PUT /api/trabajos/:id
   * Actualizar un trabajo
   */
  async actualizar(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    const datos: ActualizarTrabajoDTO = req.body;
    const empleadorId = req.usuario!.id;

    const trabajo = await this.trabajosService.actualizar(
      id,
      empleadorId,
      datos
    );

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Trabajo actualizado exitosamente",
      datos: trabajo,
    };

    res.json(respuesta);
  }

  /**
   * DELETE /api/trabajos/:id
   * Eliminar un trabajo
   */
  async eliminar(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    const empleadorId = req.usuario!.id;

    await this.trabajosService.eliminar(id, empleadorId);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Trabajo eliminado exitosamente",
    };

    res.json(respuesta);
  }

  /**
   * GET /api/trabajos/mis-publicaciones
   * Obtener trabajos del empleador autenticado
   */
  async misPublicaciones(req: AuthRequest, res: Response) {
    const empleadorId = req.usuario!.id;

    const trabajos = await this.trabajosService.obtenerMisPublicaciones(
      empleadorId
    );

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Publicaciones obtenidas exitosamente",
      datos: trabajos,
    };

    res.json(respuesta);
  }

  /**
   * GET /api/trabajos/estadisticas
   * Obtener estadísticas de mis trabajos
   */
  async obtenerEstadisticas(req: AuthRequest, res: Response) {
    const empleadorId = req.usuario!.id;
    const estadisticas = await this.trabajosService.obtenerEstadisticas(
      empleadorId
    );

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Estadísticas obtenidas exitosamente",
      datos: estadisticas,
    };

    res.json(respuesta);
  }

  /**
   * GET /api/trabajos/sugerencias
   * Buscar sugerencias de trabajos
   */
  async buscarSugerencias(req: Request, res: Response) {
    const query = (req.query.q as string) || "";

    if (!query || query.length < 2) {
      return res.json({
        exito: true,
        mensaje: "Sugerencias obtenidas",
        datos: [],
      });
    }

    const sugerencias = await this.trabajosService.buscarSugerencias(query);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Sugerencias obtenidas exitosamente",
      datos: sugerencias,
    };

    res.json(respuesta);
  }
}
