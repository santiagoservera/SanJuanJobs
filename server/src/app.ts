import express, { Application } from "express";
import cors from "cors";
import { config } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

// Rutas de módulos
import authRoutes from "./modules/auth/auth.routes";
import trabajosRoutes from "./modules/trabajos/trabajos.routes";
import postulacionesRoutes from "./modules/postulaciones/postulaciones.routes";
import categoriasRoutes from "./modules/categorias/categorias.routes";
import tiposTrabajoRoutes from "./modules/tipos-trabajo/tipos-trabajo.routes";
import perfilesRoutes from "./modules/perfiles/perfiles.routes";
import departamentosRoutes from "./modules/departamentos/departamentos.routes";

/**
 * Configuración principal de la aplicación Express
 */
export const createApp = (): Application => {
  const app = express();

  // ============================================================================
  // Middlewares globales
  // ============================================================================

  // CORS - Permitir peticiones desde el frontend
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    }),
  );

  // Parser de JSON
  app.use(express.json());

  // Parser de URL encoded
  app.use(express.urlencoded({ extended: true }));

  // ============================================================================
  // Rutas
  // ============================================================================

  // Ruta de health check
  app.get("/health", (req, res) => {
    res.json({
      exito: true,
      mensaje: "Servidor funcionando correctamente",
      timestamp: new Date().toISOString(),
    });
  });

  // Rutas de autenticación
  app.use("/api/auth", authRoutes);
  // Rutas de trabajos
  app.use("/api/trabajos", trabajosRoutes);
  // Rutas de postulaciones
  app.use("/api/postulaciones", postulacionesRoutes);
  // Rutas de categorias
  app.use("/api/categorias", categoriasRoutes);
  // Rutas de tipos de trabajo
  app.use("/api/tipos-trabajo", tiposTrabajoRoutes);
  //Rutas de perfiles
  app.use("/api/perfil", perfilesRoutes);
  // Rutas de departamentos
  app.use("/api/departamentos", departamentosRoutes);

  // TODO: Agregar rutas de módulos aquí
  // app.use('/api/auth', authRoutes);
  // app.use('/api/trabajos', trabajosRoutes);
  // etc...

  // ============================================================================
  // Manejo de errores
  // ============================================================================

  // Ruta no encontrada
  app.use(notFoundHandler);

  // Manejador de errores global
  app.use(errorHandler);

  return app;
};
