import { query } from "express-validator";

query("departamentoId")
  .optional()
  .isInt({ min: 1 })
  .withMessage("departamentoId debe ser un número entero positivo")
  .toInt();
