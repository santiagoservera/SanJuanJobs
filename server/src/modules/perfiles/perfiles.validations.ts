import { body, param } from "express-validator";

/**
 * Validaciones para actualizar perfil de empleado
 */
export const validacionActualizarPerfilEmpleado = [
  body("nombre")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres")
    .trim(),

  body("apellido")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("El apellido debe tener entre 2 y 100 caracteres")
    .trim(),

  body("domicilio")
    .optional()
    .isLength({ max: 255 })
    .withMessage("El domicilio no puede exceder 255 caracteres")
    .trim(),

  body("telefono")
    .optional()
    .isLength({ max: 50 })
    .withMessage("El teléfono no puede exceder 50 caracteres")
    .trim(),

  body("sobreMi")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("La descripción no puede exceder 1000 caracteres")
    .trim(),

  body("experiencia")
    .optional()
    .isLength({ max: 3000 })
    .withMessage("La experiencia no puede exceder 3000 caracteres")
    .trim(),

  body("educacion")
    .optional()
    .isLength({ max: 3000 })
    .withMessage("La educación no puede exceder 3000 caracteres")
    .trim(),
];

/**
 * Validaciones para actualizar perfil de empleador
 */
export const validacionActualizarPerfilEmpleador = [
  body("nombreEmpresa")
    .optional()
    .isLength({ min: 2, max: 200 })
    .withMessage("El nombre de la empresa debe tener entre 2 y 200 caracteres")
    .trim(),

  body("descripcionEmpresa")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("La descripción no puede exceder 2000 caracteres")
    .trim(),

  body("emailContacto")
    .optional()
    .isEmail()
    .withMessage("Debe proporcionar un email válido")
    .normalizeEmail(),

  body("telefonoContacto")
    .optional()
    .isLength({ max: 50 })
    .withMessage("El teléfono no puede exceder 50 caracteres")
    .trim(),

  body("sitioWeb")
    .optional()
    .isURL()
    .withMessage("Debe proporcionar una URL válida")
    .trim(),
];

/**
 * Validaciones para cambiar contraseña
 */
export const validacionCambiarContrasena = [
  body("contrasenaActual")
    .notEmpty()
    .withMessage("La contraseña actual es requerida"),

  body("contrasenaNueva")
    .isLength({ min: 6 })
    .withMessage("La nueva contraseña debe tener al menos 6 caracteres")
    .notEmpty()
    .withMessage("La nueva contraseña es requerida"),
];

/**
 * Validaciones para obtener perfil público por ID
 */
export const validacionObtenerPerfilPublico = [
  param("id").isInt({ min: 1 }).withMessage("ID de usuario inválido"),
];

/**
 * Validación para obtener perfil empleador público
 */
export const obtenerPerfilEmpleadorPublicoValidation = [
  param("empleadorId")
    .isInt({ min: 1 })
    .withMessage("El ID del empleador debe ser un número entero positivo"),
];
