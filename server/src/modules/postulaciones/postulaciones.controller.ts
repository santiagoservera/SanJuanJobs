import { Response } from "express";
import { PostulacionesService } from "./postulaciones.service";
import { AuthRequest, ApiResponse } from "../../types";
import {
  CrearPostulacionDTO,
  ActualizarEstadoDTO,
  FiltrosPostulaciones,
} from "./postulaciones.types";
import { ApiError } from "../../middleware/errorHandler";

/**
 * Controlador de postulaciones
 * Maneja las peticiones HTTP relacionadas con postulaciones
 */
export class PostulacionesController {
  private postulacionesService: PostulacionesService;

  constructor() {
    this.postulacionesService = new PostulacionesService();
  }

  /**
   * POST /api/postulaciones
   * Crear una postulación (solo EMPLEADO)
   */
  async crear(req: AuthRequest, res: Response) {
    const datos: CrearPostulacionDTO = req.body;
    const empleadoId = req.usuario!.id;

    const postulacion = await this.postulacionesService.crear(
      empleadoId,
      datos
    );

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Postulación enviada exitosamente",
      datos: postulacion,
    };

    res.status(201).json(respuesta);
  }

  /**
   * GET /api/postulaciones/mis-postulaciones
   * Obtener postulaciones del empleado autenticado
   */
  async misPostulaciones(req: AuthRequest, res: Response) {
    const empleadoId = req.usuario!.id;

    const filtros: FiltrosPostulaciones = {
      estado: req.query.estado as any,
      pagina: req.query.pagina ? parseInt(req.query.pagina as string) : 1,
      limite: req.query.limite ? parseInt(req.query.limite as string) : 10,
    };

    const resultado = await this.postulacionesService.obtenerMisPostulaciones(
      empleadoId,
      filtros
    );

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Postulaciones obtenidas exitosamente",
      datos: resultado,
    };

    res.json(respuesta);
  }

  /**
   * GET /api/postulaciones/recibidas
   * Obtener postulaciones recibidas en trabajos del empleador
   */
  async postulacionesRecibidas(req: AuthRequest, res: Response) {
    const empleadorId = req.usuario!.id;

    const filtros: FiltrosPostulaciones = {
      estado: req.query.estado as any,
      trabajoId: req.query.trabajoId
        ? parseInt(req.query.trabajoId as string)
        : undefined,
      pagina: req.query.pagina ? parseInt(req.query.pagina as string) : 1,
      limite: req.query.limite ? parseInt(req.query.limite as string) : 10,
    };

    const resultado =
      await this.postulacionesService.obtenerPostulacionesRecibidas(
        empleadorId,
        filtros
      );

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Postulaciones recibidas obtenidas exitosamente",
      datos: resultado,
    };

    res.json(respuesta);
  }

  /**
   * GET /api/postulaciones/:id
   * Obtener una postulación por ID
   */
  async obtenerPorId(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    const usuarioId = req.usuario!.id;
    const rol = req.usuario!.rol;

    const postulacion = await this.postulacionesService.obtenerPorId(
      id,
      usuarioId,
      rol
    );

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Postulación obtenida exitosamente",
      datos: postulacion,
    };

    res.json(respuesta);
  }

  /**
   * PATCH /api/postulaciones/:id/estado
   * Actualizar estado de una postulación (solo EMPLEADOR)
   */
  async actualizarEstado(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    const empleadorId = req.usuario!.id;
    const datos: ActualizarEstadoDTO = req.body;

    const postulacion = await this.postulacionesService.actualizarEstado(
      id,
      empleadorId,
      datos
    );

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Estado de postulación actualizado exitosamente",
      datos: postulacion,
    };

    res.json(respuesta);
  }

  /**
   * DELETE /api/postulaciones/:id
   * Eliminar una postulación (solo EMPLEADO que la creó)
   */
  async eliminar(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    const empleadoId = req.usuario!.id;

    await this.postulacionesService.eliminar(id, empleadoId);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Postulación eliminada exitosamente",
    };

    res.json(respuesta);
  }

  /**
   * GET /api/postulaciones/estadisticas
   * Obtener estadísticas de postulaciones (solo EMPLEADOR)
   */
  async estadisticas(req: AuthRequest, res: Response) {
    const empleadorId = req.usuario!.id;

    const estadisticas = await this.postulacionesService.obtenerEstadisticas(
      empleadorId
    );

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Estadísticas obtenidas exitosamente",
      datos: estadisticas,
    };

    res.json(respuesta);
  }
}
