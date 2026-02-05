import { body, param } from "express-validator";

/**
 * Validaciones para crear tipo de trabajo
 */
export const validacionCrearTipoTrabajo = [
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
];

/**
 * Validaciones para actualizar tipo de trabajo
 */
export const validacionActualizarTipoTrabajo = [
  param("id").isInt({ min: 1 }).withMessage("ID de tipo de trabajo inválido"),

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
];

/**
 * Validaciones para obtener por ID
 */
export const validacionObtenerTipoTrabajo = [
  param("id").isInt({ min: 1 }).withMessage("ID de tipo de trabajo inválido"),
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
 * Validaciones para eliminar tipo de trabajo
 */
export const validacionEliminarTipoTrabajo = [
  param("id").isInt({ min: 1 }).withMessage("ID de tipo de trabajo inválido"),
];
