import { Router } from "express";
import { DepartamentosController } from "./departamentos.controller";

/**
 * Rutas de departamentos
 */
const router = Router();
const departamentosController = new DepartamentosController();

/**
 * GET /api/departamentos
 * Listar todos los departamentos (público)
 * Query params:
 *   - incluirConteo: "true" para incluir cantidad de trabajos activos
 */
router.get("/", async (req, res, next) => {
  try {
    await departamentosController.listar(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/departamentos/:slug
 * Obtener un departamento por slug (público)
 */
router.get("/:slug", async (req, res, next) => {
  try {
    await departamentosController.obtenerPorSlug(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
