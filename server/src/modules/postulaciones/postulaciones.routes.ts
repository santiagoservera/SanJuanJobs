import { Router } from "express";
import { PostulacionesController } from "./postulaciones.controller";
import { validar } from "../../middleware/validateRequest";
import { autenticar, verificarRol } from "../../middleware/auth";
import {
  validacionCrearPostulacion,
  validacionActualizarEstado,
  validacionObtenerPostulacion,
  validacionEliminarPostulacion,
  validacionListarPostulaciones,
} from "./postulaciones.validations";

const router = Router();
const postulacionesController = new PostulacionesController();

// POST /api/postulaciones - Crear postulación (EMPLEADO)
router.post(
  "/",
  autenticar,
  verificarRol("EMPLEADO"),
  validar(validacionCrearPostulacion),
  async (req, res, next) => {
    try {
      await postulacionesController.crear(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/postulaciones/mis-postulaciones - Ver mis postulaciones (EMPLEADO)
router.get(
  "/mis-postulaciones",
  autenticar,
  verificarRol("EMPLEADO"),
  validar(validacionListarPostulaciones),
  async (req, res, next) => {
    try {
      await postulacionesController.misPostulaciones(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/postulaciones/recibidas - Ver postulaciones recibidas (EMPLEADOR)
router.get(
  "/recibidas",
  autenticar,
  verificarRol("EMPLEADOR"),
  validar(validacionListarPostulaciones),
  async (req, res, next) => {
    try {
      await postulacionesController.postulacionesRecibidas(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/postulaciones/estadisticas - Ver estadísticas (EMPLEADOR)
router.get(
  "/estadisticas",
  autenticar,
  verificarRol("EMPLEADOR"),
  async (req, res, next) => {
    try {
      await postulacionesController.estadisticas(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/postulaciones/:id - Ver detalle de postulación
router.get(
  "/:id",
  autenticar,
  validar(validacionObtenerPostulacion),
  async (req, res, next) => {
    try {
      await postulacionesController.obtenerPorId(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/postulaciones/:id/estado - Cambiar estado (EMPLEADOR)
router.patch(
  "/:id/estado",
  autenticar,
  verificarRol("EMPLEADOR"),
  validar(validacionActualizarEstado),
  async (req, res, next) => {
    try {
      await postulacionesController.actualizarEstado(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/postulaciones/:id - Eliminar postulación (EMPLEADO)
router.delete(
  "/:id",
  autenticar,
  verificarRol("EMPLEADO"),
  validar(validacionEliminarPostulacion),
  async (req, res, next) => {
    try {
      await postulacionesController.eliminar(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
