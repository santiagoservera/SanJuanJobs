import { PrismaClient } from "@prisma/client";

// Crear instancia única de Prisma Client
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

// Manejar desconexión cuando el proceso termina
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

// Exportar como default
export default prisma;
