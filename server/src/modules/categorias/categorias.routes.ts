import { Router } from "express";
import { CategoriasController } from "./categorias.controller";
import { validar } from "../../middleware/validateRequest";
import { autenticar, verificarRol } from "../../middleware/auth";
import {
  validacionCrearCategoria,
  validacionActualizarCategoria,
  validacionObtenerCategoria,
  validacionObtenerPorSlug,
  validacionEliminarCategoria,
} from "./categorias.validations";

const router = Router();
const categoriasController = new CategoriasController();

// GET /api/categorias - Listar todas (público)
router.get("/", async (req, res, next) => {
  try {
    await categoriasController.listar(req, res);
  } catch (error) {
    next(error);
  }
});

// GET /api/categorias/slug/:slug - Obtener por slug (público)
router.get(
  "/slug/:slug",
  validar(validacionObtenerPorSlug),
  async (req, res, next) => {
    try {
      await categoriasController.obtenerPorSlug(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/categorias/:id - Obtener por ID (público)
router.get(
  "/:id",
  validar(validacionObtenerCategoria),
  async (req, res, next) => {
    try {
      await categoriasController.obtenerPorId(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/categorias - Crear (solo ADMIN)
router.post(
  "/",
  autenticar,
  verificarRol("ADMIN"),
  validar(validacionCrearCategoria),
  async (req, res, next) => {
    try {
      await categoriasController.crear(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/categorias/:id - Actualizar (solo ADMIN)
router.put(
  "/:id",
  autenticar,
  verificarRol("ADMIN"),
  validar(validacionActualizarCategoria),
  async (req, res, next) => {
    try {
      await categoriasController.actualizar(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/categorias/:id - Eliminar (solo ADMIN)
router.delete(
  "/:id",
  autenticar,
  verificarRol("ADMIN"),
  validar(validacionEliminarCategoria),
  async (req, res, next) => {
    try {
      await categoriasController.eliminar(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
