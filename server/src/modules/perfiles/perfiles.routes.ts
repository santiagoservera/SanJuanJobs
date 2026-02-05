import { Router } from "express";
import { PerfilesController } from "./perfiles.controller";
import { validar } from "../../middleware/validateRequest";
import { autenticar, verificarRol } from "../../middleware/auth";
import {
  obtenerPerfilEmpleadorPublicoValidation,
  validacionActualizarPerfilEmpleado,
  validacionActualizarPerfilEmpleador,
  validacionCambiarContrasena,
  validacionObtenerPerfilPublico,
} from "./perfiles.validations";

const router = Router();
const perfilesController = new PerfilesController();
// GET /api/perfil/empleador/:empleadorId/publico - Obtener perfil público de empleador por ID
router.get(
  "/empleador/:empleadorId/publico",
  obtenerPerfilEmpleadorPublicoValidation,
  perfilesController.obtenerPerfilEmpleadorPublico.bind(perfilesController)
);

// GET /api/perfil - Obtener mi perfil completo
router.get("/", autenticar, async (req, res, next) => {
  try {
    await perfilesController.obtenerMiPerfil(req, res);
  } catch (error) {
    next(error);
  }
});

// PUT /api/perfil/empleado - Actualizar mi perfil de empleado
router.put(
  "/empleado",
  autenticar,
  verificarRol("EMPLEADO"),
  validar(validacionActualizarPerfilEmpleado),
  async (req, res, next) => {
    try {
      await perfilesController.actualizarPerfilEmpleado(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/perfil/empleador - Actualizar mi perfil de empleador
router.put(
  "/empleador",
  autenticar,
  verificarRol("EMPLEADOR"),
  validar(validacionActualizarPerfilEmpleador),
  async (req, res, next) => {
    try {
      await perfilesController.actualizarPerfilEmpleador(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/perfil/contrasena - Cambiar contraseña
router.put(
  "/contrasena",
  autenticar,
  validar(validacionCambiarContrasena),
  async (req, res, next) => {
    try {
      await perfilesController.cambiarContrasena(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/perfil/empleado/:id - Ver perfil público de empleado
router.get(
  "/empleado/:id",
  autenticar,
  validar(validacionObtenerPerfilPublico),
  async (req, res, next) => {
    try {
      await perfilesController.obtenerPerfilPublicoEmpleado(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/perfil/empleador/:id - Ver perfil público de empleador
router.get(
  "/empleador/:id",
  autenticar,
  validar(validacionObtenerPerfilPublico),
  async (req, res, next) => {
    try {
      await perfilesController.obtenerPerfilPublicoEmpleador(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
