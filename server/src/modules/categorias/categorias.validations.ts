import { body, param } from "express-validator";

/**
 * Validaciones para crear categoría
 */
export const validacionCrearCategoria = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre debe tener entre 3 y 100 caracteres")
    .trim(),

  body("slug")
    .notEmpty()
    .withMessage("El slug es requerido")
    .isLength({ min: 3, max: 100 })
    .withMessage("El slug debe tener entre 3 y 100 caracteres")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "El slug solo puede contener letras minúsculas, números y guiones"
    )
    .trim(),

  body("descripcion").optional().trim(),
];

/**
 * Validaciones para actualizar categoría
 */
export const validacionActualizarCategoria = [
  param("id").isInt({ min: 1 }).withMessage("ID de categoría inválido"),

  body("nombre")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre debe tener entre 3 y 100 caracteres")
    .trim(),

  body("slug")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("El slug debe tener entre 3 y 100 caracteres")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "El slug solo puede contener letras minúsculas, números y guiones"
    )
    .trim(),

  body("descripcion").optional().trim(),
];

/**
 * Validaciones para obtener por ID
 */
export const validacionObtenerCategoria = [
  param("id").isInt({ min: 1 }).withMessage("ID de categoría inválido"),
];

/**
 * Validaciones para obtener por slug
 */
export const validacionObtenerPorSlug = [
  param("slug")
    .notEmpty()
    .withMessage("El slug es requerido")
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug inválido"),
];

/**
 * Validaciones para eliminar categoría
 */
export const validacionEliminarCategoria = [
  param("id").isInt({ min: 1 }).withMessage("ID de categoría inválido"),
];
