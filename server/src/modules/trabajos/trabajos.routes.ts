import { Router } from "express";
import { TrabajosController } from "./trabajos.controller";
import { validar } from "../../middleware/validateRequest";
import { autenticar, verificarRol } from "../../middleware/auth";
import {
  validacionCrearTrabajo,
  validacionActualizarTrabajo,
  validacionObtenerTrabajo,
  validacionEliminarTrabajo,
  validacionListarTrabajos,
} from "./trabajos.validations";

/**
 * Rutas de trabajos
 */
const router = Router();
const trabajosController = new TrabajosController();

/**
 * GET /api/trabajos
 * Listar trabajos con filtros (público)
 */
router.get("/", validar(validacionListarTrabajos), async (req, res, next) => {
  try {
    await trabajosController.listar(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/trabajos/mis-publicaciones
 * Obtener trabajos del empleador autenticado
 * IMPORTANTE: Esta ruta debe ir ANTES de /:id para no confundirla
 */
router.get(
  "/mis-publicaciones",
  autenticar,
  verificarRol("EMPLEADOR"),
  async (req, res, next) => {
    try {
      await trabajosController.misPublicaciones(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/trabajos/estadisticas
 * Obtener estadísticas (empleador)
 */
router.get(
  "/estadisticas",
  autenticar,
  verificarRol("EMPLEADOR"),
  async (req, res, next) => {
    try {
      await trabajosController.obtenerEstadisticas(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/trabajos/sugerencias
 * Buscar sugerencias de trabajos (solo títulos únicos)
 */
router.get("/sugerencias", async (req, res, next) => {
  try {
    await trabajosController.buscarSugerencias(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/trabajos/:id
 * Obtener un trabajo por ID (público)
 */
router.get(
  "/:id",
  validar(validacionObtenerTrabajo),
  async (req, res, next) => {
    try {
      await trabajosController.obtenerPorId(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/trabajos
 * Crear un nuevo trabajo (solo EMPLEADOR)
 */
router.post(
  "/",
  autenticar,
  verificarRol("EMPLEADOR"),
  validar(validacionCrearTrabajo),
  async (req, res, next) => {
    try {
      await trabajosController.crear(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/trabajos/:id
 * Actualizar un trabajo (solo dueño)
 */
router.put(
  "/:id",
  autenticar,
  verificarRol("EMPLEADOR"),
  validar(validacionActualizarTrabajo),
  async (req, res, next) => {
    try {
      await trabajosController.actualizar(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/trabajos/:id
 * Eliminar un trabajo (solo dueño)
 */
router.delete(
  "/:id",
  autenticar,
  verificarRol("EMPLEADOR"),
  validar(validacionEliminarTrabajo),
  async (req, res, next) => {
    try {
      await trabajosController.eliminar(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
