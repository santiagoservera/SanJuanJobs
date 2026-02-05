import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validar } from "../../middleware/validateRequest";
import { validacionRegistro, validacionLogin } from "./auth.validations";
import { autenticar } from "../../middleware/auth";

/**
 * Rutas de autenticación
 */
const router = Router();
const authController = new AuthController();

/**
 * POST /api/auth/registro
 * Registrar un nuevo usuario
 */
router.post(
  "/registro",
  validar(validacionRegistro),
  async (req, res, next) => {
    try {
      await authController.registro(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post("/login", validar(validacionLogin), async (req, res, next) => {
  try {
    await authController.login(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Obtener información del usuario autenticado
 * Requiere autenticación
 */
router.get("/me", autenticar, async (req, res, next) => {
  try {
    await authController.obtenerPerfil(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
