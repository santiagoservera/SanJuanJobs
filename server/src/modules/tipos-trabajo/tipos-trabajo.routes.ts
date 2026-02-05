import { Router } from "express";
import { TiposTrabajoController } from "./tipos-trabajo.controller";
import { validar } from "../../middleware/validateRequest";
import { autenticar, verificarRol } from "../../middleware/auth";
import {
  validacionCrearTipoTrabajo,
  validacionActualizarTipoTrabajo,
  validacionObtenerTipoTrabajo,
  validacionObtenerPorSlug,
  validacionEliminarTipoTrabajo,
} from "./tipos-trabajo.validations";

const router = Router();
const tiposTrabajoController = new TiposTrabajoController();

// GET /api/tipos-trabajo - Listar todos (público)
router.get("/", async (req, res, next) => {
  try {
    await tiposTrabajoController.listar(req, res);
  } catch (error) {
    next(error);
  }
});

// GET /api/tipos-trabajo/slug/:slug - Obtener por slug (público)
router.get(
  "/slug/:slug",
  validar(validacionObtenerPorSlug),
  async (req, res, next) => {
    try {
      await tiposTrabajoController.obtenerPorSlug(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/tipos-trabajo/:id - Obtener por ID (público)
router.get(
  "/:id",
  validar(validacionObtenerTipoTrabajo),
  async (req, res, next) => {
    try {
      await tiposTrabajoController.obtenerPorId(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/tipos-trabajo - Crear (solo ADMIN)
router.post(
  "/",
  autenticar,
  verificarRol("ADMIN"),
  validar(validacionCrearTipoTrabajo),
  async (req, res, next) => {
    try {
      await tiposTrabajoController.crear(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/tipos-trabajo/:id - Actualizar (solo ADMIN)
router.put(
  "/:id",
  autenticar,
  verificarRol("ADMIN"),
  validar(validacionActualizarTipoTrabajo),
  async (req, res, next) => {
    try {
      await tiposTrabajoController.actualizar(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/tipos-trabajo/:id - Eliminar (solo ADMIN)
router.delete(
  "/:id",
  autenticar,
  verificarRol("ADMIN"),
  validar(validacionEliminarTipoTrabajo),
  async (req, res, next) => {
    try {
      await tiposTrabajoController.eliminar(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
