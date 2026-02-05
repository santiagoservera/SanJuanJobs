import { body } from "express-validator";

/**
 * Validaciones para el registro de usuarios
 */
export const validacionRegistro = [
  body("email")
    .isEmail()
    .withMessage("Debe proporcionar un email válido")
    .normalizeEmail(),

  body("contrasena")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("rol")
    .isIn(["EMPLEADO", "EMPLEADOR", "ADMIN"])
    .withMessage("Rol inválido. Debe ser EMPLEADO, EMPLEADOR o ADMIN"),

  // Validaciones condicionales según el rol
  body("nombre")
    .if(body("rol").equals("EMPLEADO"))
    .notEmpty()
    .withMessage("El nombre es requerido para empleados")
    .trim(),

  body("apellido")
    .if(body("rol").equals("EMPLEADO"))
    .notEmpty()
    .withMessage("El apellido es requerido para empleados")
    .trim(),

  body("nombreEmpresa")
    .if(body("rol").equals("EMPLEADOR"))
    .notEmpty()
    .withMessage("El nombre de la empresa es requerido para empleadores")
    .trim(),
];

/**
 * Validaciones para el login
 */
export const validacionLogin = [
  body("email")
    .isEmail()
    .withMessage("Debe proporcionar un email válido")
    .normalizeEmail(),

  body("contrasena").notEmpty().withMessage("La contraseña es requerida"),
];
