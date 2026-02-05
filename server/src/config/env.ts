import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

/**
 * Configuración de variables de entorno
 * Centraliza todas las variables de entorno en un solo lugar
 */
export const config = {
  // Configuración del servidor
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",

  // Configuración de la base de datos
  databaseUrl: process.env.DATABASE_URL,

  // Configuración JWT
  jwtSecret: process.env.JWT_SECRET || "default-secret-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  // Configuración CORS
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};

// Validar que las variables críticas existan
if (!config.databaseUrl) {
  throw new Error(
    "❌ DATABASE_URL no está definida en las variables de entorno"
  );
}

if (
  config.nodeEnv === "production" &&
  config.jwtSecret === "default-secret-change-in-production"
) {
  throw new Error("❌ JWT_SECRET debe ser cambiado en producción");
}
