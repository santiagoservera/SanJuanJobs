import prisma from "../../config/database";

/**
 * Servicio de departamentos
 * Contiene la lógica de negocio para gestión de departamentos de San Juan
 */
export class DepartamentosService {
  /**
   * Listar todos los departamentos
   * Opcionalmente incluye el conteo de trabajos activos
   */
  async listar(incluirConteo: boolean = false) {
    const departamentos = await prisma.departamento.findMany({
      orderBy: {
        nombre: "asc",
      },
      include: incluirConteo
        ? {
            _count: {
              select: {
                trabajos: {
                  where: {
                    estado: "ACTIVO",
                  },
                },
              },
            },
          }
        : undefined,
    });

    return departamentos;
  }

  /**
   * Obtener un departamento por slug
   */
  async obtenerPorSlug(slug: string) {
    const departamento = await prisma.departamento.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            trabajos: {
              where: {
                estado: "ACTIVO",
              },
            },
          },
        },
      },
    });

    return departamento;
  }

  /**
   * Obtener un departamento por ID
   */
  async obtenerPorId(id: number) {
    const departamento = await prisma.departamento.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            trabajos: {
              where: {
                estado: "ACTIVO",
              },
            },
          },
        },
      },
    });

    return departamento;
  }
}
