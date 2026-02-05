import { body, param, query } from "express-validator";

/**
 * Validaciones para crear un trabajo
 */
export const validacionCrearTrabajo = [
  body("titulo")
    .notEmpty()
    .withMessage("El título es requerido")
    .isLength({ min: 5, max: 255 })
    .withMessage("El título debe tener entre 5 y 255 caracteres")
    .trim(),

  body("descripcion")
    .notEmpty()
    .withMessage("La descripción es requerida")
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener al menos 20 caracteres")
    .trim(),

  body("departamentoId")
    .isInt({ min: 1 })
    .withMessage("Debe proporcionar un ID de departamento válido"),

  body("ubicacion")
    .optional()
    .isLength({ max: 200 })
    .withMessage("La ubicación específica no puede exceder 200 caracteres")
    .trim(),

  body("googleMapsUrl")
    .optional()
    .trim()
    .isURL()
    .withMessage("Debe ser una URL válida")
    .custom((value) => {
      if (
        value &&
        !value.includes("google.com/maps") &&
        !value.includes("goo.gl/maps")
      ) {
        throw new Error("Debe ser una URL de Google Maps");
      }
      return true;
    }),

  body("latitud")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitud debe estar entre -90 y 90"),

  body("longitud")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitud debe estar entre -180 y 180"),

  body("categoriaId")
    .isInt({ min: 1 })
    .withMessage("Debe proporcionar un ID de categoría válido"),

  body("tipoTrabajoId")
    .isInt({ min: 1 })
    .withMessage("Debe proporcionar un ID de tipo de trabajo válido"),

  body("paga")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("La paga debe ser un número positivo"),

  body("requisitos").optional().trim(),

  body("beneficios").optional().trim(),

  body("estado")
    .optional()
    .isIn(["ACTIVO", "CERRADO", "BORRADOR"])
    .withMessage("Estado inválido. Debe ser ACTIVO, CERRADO o BORRADOR"),
];

/**
 * Validaciones para actualizar un trabajo
 */
export const validacionActualizarTrabajo = [
  param("id").isInt({ min: 1 }).withMessage("ID de trabajo inválido"),

  body("titulo")
    .optional()
    .isLength({ min: 5, max: 255 })
    .withMessage("El título debe tener entre 5 y 255 caracteres")
    .trim(),

  body("descripcion")
    .optional()
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener al menos 20 caracteres")
    .trim(),

  body("departamentoId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Debe proporcionar un ID de departamento válido"),

  body("googleMapsUrl")
    .optional()
    .trim()
    .isURL()
    .withMessage("Debe ser una URL válida")
    .custom((value) => {
      if (
        value &&
        !value.includes("google.com/maps") &&
        !value.includes("goo.gl/maps")
      ) {
        throw new Error("Debe ser una URL de Google Maps");
      }
      return true;
    }),

  body("latitud")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitud debe estar entre -90 y 90"),

  body("longitud")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitud debe estar entre -180 y 180"),

  body("ubicacion")
    .optional()
    .isLength({ max: 200 })
    .withMessage("La ubicación específica no puede exceder 200 caracteres")
    .trim(),

  body("categoriaId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Debe proporcionar un ID de categoría válido"),

  body("tipoTrabajoId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Debe proporcionar un ID de tipo de trabajo válido"),

  body("paga")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("La paga debe ser un número positivo"),

  body("requisitos").optional().trim(),

  body("beneficios").optional().trim(),

  body("estado")
    .optional()
    .isIn(["ACTIVO", "CERRADO", "BORRADOR"])
    .withMessage("Estado inválido. Debe ser ACTIVO, CERRADO o BORRADOR"),
];

/**
 * Validaciones para obtener un trabajo por ID
 */
export const validacionObtenerTrabajo = [
  param("id").isInt({ min: 1 }).withMessage("ID de trabajo inválido"),
];

/**
 * Validaciones para eliminar un trabajo
 */
export const validacionEliminarTrabajo = [
  param("id").isInt({ min: 1 }).withMessage("ID de trabajo inválido"),
];

/**
 * Validaciones para listar trabajos (query params)
 */
export const validacionListarTrabajos = [
  query("categoriaId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("ID de categoría inválido"),

  query("tipoTrabajoId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("ID de tipo de trabajo inválido"),

  query("departamentoId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("ID de departamento inválido"),

  query("ubicacion").optional().trim(),

  query("busqueda").optional().trim(),

  query("estado")
    .optional()
    .isIn(["ACTIVO", "CERRADO", "BORRADOR"])
    .withMessage("Estado inválido"),

  query("pagina")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La página debe ser un número mayor a 0"),

  query("limite")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El límite debe estar entre 1 y 100"),
];
