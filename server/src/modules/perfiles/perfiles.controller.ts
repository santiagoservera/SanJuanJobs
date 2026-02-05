import { Response, Request } from "express";
import { PerfilesService } from "./perfiles.service";
import { AuthRequest, ApiResponse } from "../../types";
import {
  ActualizarPerfilEmpleadoDTO,
  ActualizarPerfilEmpleadorDTO,
  CambiarContrasenaDTO,
} from "./perfiles.types";
import { validationResult } from "express-validator";
import { ApiError } from "../../middleware/errorHandler";

/**
 * Controlador de perfiles
 * Maneja las peticiones HTTP relacionadas con perfiles de usuario
 */
export class PerfilesController {
  private perfilesService: PerfilesService;

  constructor() {
    this.perfilesService = new PerfilesService();
  }

  /**
   * GET /api/perfil
   * Obtener mi perfil completo
   */
  async obtenerMiPerfil(req: AuthRequest, res: Response) {
    const usuarioId = req.usuario!.id;

    const perfil = await this.perfilesService.obtenerPerfil(usuarioId);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Perfil obtenido exitosamente",
      datos: perfil,
    };

    res.json(respuesta);
  }

  /**
   * PUT /api/perfil/empleado
   * Actualizar perfil de empleado
   */
  async actualizarPerfilEmpleado(req: AuthRequest, res: Response) {
    const usuarioId = req.usuario!.id;
    const datos: ActualizarPerfilEmpleadoDTO = req.body;

    const perfil = await this.perfilesService.actualizarPerfilEmpleado(
      usuarioId,
      datos
    );

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Perfil actualizado exitosamente",
      datos: perfil,
    };

    res.json(respuesta);
  }

  /**
   * PUT /api/perfil/empleador
   * Actualizar perfil de empleador
   */
  async actualizarPerfilEmpleador(req: AuthRequest, res: Response) {
    const usuarioId = req.usuario!.id;
    const datos: ActualizarPerfilEmpleadorDTO = req.body;

    const perfil = await this.perfilesService.actualizarPerfilEmpleador(
      usuarioId,
      datos
    );

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Perfil actualizado exitosamente",
      datos: perfil,
    };

    res.json(respuesta);
  }

  /**
   * PUT /api/perfil/contrasena
   * Cambiar contraseña
   */
  async cambiarContrasena(req: AuthRequest, res: Response) {
    const usuarioId = req.usuario!.id;
    const datos: CambiarContrasenaDTO = req.body;

    await this.perfilesService.cambiarContrasena(usuarioId, datos);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Contraseña actualizada exitosamente",
    };

    res.json(respuesta);
  }

  /**
   * GET /api/perfil/empleado/:id
   * Obtener perfil público de un empleado
   */
  async obtenerPerfilPublicoEmpleado(req: AuthRequest, res: Response) {
    const empleadoId = parseInt(req.params.id);

    const perfil = await this.perfilesService.obtenerPerfilPublicoEmpleado(
      empleadoId
    );

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Perfil obtenido exitosamente",
      datos: perfil,
    };

    res.json(respuesta);
  }

  /**
   * GET /api/perfil/empleador/:id
   * Obtener perfil público de un empleador
   */
  async obtenerPerfilPublicoEmpleador(req: AuthRequest, res: Response) {
    const empleadorId = parseInt(req.params.id);

    const perfil = await this.perfilesService.obtenerPerfilPublicoEmpleador(
      empleadorId
    );

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Perfil obtenido exitosamente",
      datos: perfil,
    };

    res.json(respuesta);
  }

  /**
   * Obtener perfil público de un empleador
   */
  async obtenerPerfilEmpleadorPublico(req: Request, res: Response) {
    try {
      // Validar entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          exito: false,
          mensaje: "Errores de validación",
          errores: errors.array(),
        });
      }

      const empleadorId = parseInt(req.params.empleadorId);

      const perfil = await this.perfilesService.obtenerPerfilEmpleadorPublico(
        empleadorId
      );

      res.json({
        exito: true,
        mensaje: "Perfil de empleador obtenido exitosamente",
        datos: perfil,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          exito: false,
          mensaje: error.message,
        });
      }

      console.error("Error al obtener perfil de empleador:", error);
      res.status(500).json({
        exito: false,
        mensaje: "Error al obtener perfil de empleador",
      });
    }
  }
}
