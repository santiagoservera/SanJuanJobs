import { body, param, query } from "express-validator";

/**
 * Validaciones para crear una postulación
 */
export const validacionCrearPostulacion = [
  body("trabajoId")
    .isInt({ min: 1 })
    .withMessage("Debe proporcionar un ID de trabajo válido"),

  body("cartaPresentacion")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("La carta de presentación no puede exceder 1000 caracteres")
    .trim(),
];

/**
 * Validaciones para actualizar estado de postulación
 */
export const validacionActualizarEstado = [
  param("id").isInt({ min: 1 }).withMessage("ID de postulación inválido"),

  body("estado")
    .isIn(["PENDIENTE", "REVISADA", "ACEPTADA", "RECHAZADA"])
    .withMessage(
      "Estado inválido. Debe ser PENDIENTE, REVISADA, ACEPTADA o RECHAZADA"
    ),
];

/**
 * Validaciones para obtener una postulación por ID
 */
export const validacionObtenerPostulacion = [
  param("id").isInt({ min: 1 }).withMessage("ID de postulación inválido"),
];

/**
 * Validaciones para eliminar una postulación
 */
export const validacionEliminarPostulacion = [
  param("id").isInt({ min: 1 }).withMessage("ID de postulación inválido"),
];

/**
 * Validaciones para listar postulaciones (query params)
 */
export const validacionListarPostulaciones = [
  query("estado")
    .optional()
    .isIn(["PENDIENTE", "REVISADA", "ACEPTADA", "RECHAZADA"])
    .withMessage("Estado inválido"),

  query("trabajoId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("ID de trabajo inválido"),

  query("pagina")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La página debe ser un número mayor a 0"),

  query("limite")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El límite debe estar entre 1 y 100"),
];
