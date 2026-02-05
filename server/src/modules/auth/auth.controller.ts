import { Response } from "express";
import { AuthService } from "./auth.service";
import { AuthRequest, ApiResponse } from "../../types";
import { RegistroDTO, LoginDTO } from "./auth.types";

/**
 * Controlador de autenticación
 * Maneja las peticiones HTTP relacionadas con autenticación
 */
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * POST /api/auth/registro
   * Registrar un nuevo usuario
   */
  async registro(req: AuthRequest, res: Response) {
    const datos: RegistroDTO = req.body;

    const resultado = await this.authService.registrar(datos);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Usuario registrado exitosamente",
      datos: resultado,
    };

    res.status(201).json(respuesta);
  }

  /**
   * POST /api/auth/login
   * Iniciar sesión
   */
  async login(req: AuthRequest, res: Response) {
    const datos: LoginDTO = req.body;

    const resultado = await this.authService.login(datos);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Inicio de sesión exitoso",
      datos: resultado,
    };

    res.json(respuesta);
  }

  /**
   * GET /api/auth/me
   * Obtener información del usuario autenticado
   */
  async obtenerPerfil(req: AuthRequest, res: Response) {
    // El usuario viene del middleware de autenticación
    const usuarioId = req.usuario!.id;

    const usuario = await this.authService.obtenerUsuario(usuarioId);

    const respuesta: ApiResponse = {
      exito: true,
      mensaje: "Usuario obtenido exitosamente",
      datos: usuario,
    };

    res.json(respuesta);
  }
}
