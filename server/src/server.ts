import { createApp } from "./app";
import { config } from "./config/env";
import prisma from "./config/database";

/**
 * Iniciar el servidor
 */
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    console.log("🔌 Conectando a la base de datos...");
    await prisma.$connect();
    console.log("✅ Conexión a la base de datos exitosa");

    // Crear aplicación Express
    const app = createApp();

    // Iniciar servidor
    const server = app.listen(config.port, () => {
      console.log("\n🚀 Servidor iniciado correctamente");
      console.log(`📍 Entorno: ${config.nodeEnv}`);
      console.log(`🌐 URL: http://localhost:${config.port}`);
      console.log(`🔗 Health check: http://localhost:${config.port}/health`);
      console.log("\n⌨️  Presiona CTRL+C para detener el servidor\n");
    });

    // Manejo de señales de terminación
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n⚠️  Señal ${signal} recibida. Cerrando servidor...`);

      server.close(async () => {
        console.log("🔌 Desconectando de la base de datos...");
        await prisma.$disconnect();
        console.log("👋 Servidor cerrado correctamente");
        process.exit(0);
      });
    };

    // Escuchar señales de terminación
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Iniciar servidor
startServer();
