import prisma from "../../config/database";
import { ApiError } from "../../middleware/errorHandler";
import {
  CrearTipoTrabajoDTO,
  ActualizarTipoTrabajoDTO,
} from "./tipos-trabajo.types";

/**
 * Servicio de tipos de trabajo
 * Contiene la lógica de negocio para gestión de tipos de trabajo
 */
export class TiposTrabajoService {
  /**
   * Listar todos los tipos de trabajo
   */
  async listar() {
    const tipos = await prisma.tipoTrabajo.findMany({
      orderBy: {
        nombre: "asc",
      },
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

    return tipos;
  }

  /**
   * Obtener un tipo de trabajo por ID
   */
  async obtenerPorId(id: number) {
    const tipo = await prisma.tipoTrabajo.findUnique({
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

    if (!tipo) {
      throw new ApiError(404, "Tipo de trabajo no encontrado");
    }

    return tipo;
  }

  /**
   * Obtener un tipo de trabajo por slug
   */
  async obtenerPorSlug(slug: string) {
    const tipo = await prisma.tipoTrabajo.findUnique({
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

    if (!tipo) {
      throw new ApiError(404, "Tipo de trabajo no encontrado");
    }

    return tipo;
  }

  /**
   * Crear un tipo de trabajo (solo admin)
   */
  async crear(datos: CrearTipoTrabajoDTO) {
    // Verificar que el slug no exista
    const tipoExistente = await prisma.tipoTrabajo.findUnique({
      where: { slug: datos.slug },
    });

    if (tipoExistente) {
      throw new ApiError(409, "Ya existe un tipo de trabajo con ese slug");
    }

    const tipo = await prisma.tipoTrabajo.create({
      data: datos,
    });

    return tipo;
  }

  /**
   * Actualizar un tipo de trabajo (solo admin)
   */
  async actualizar(id: number, datos: ActualizarTipoTrabajoDTO) {
    const tipo = await prisma.tipoTrabajo.findUnique({
      where: { id },
    });

    if (!tipo) {
      throw new ApiError(404, "Tipo de trabajo no encontrado");
    }

    // Si se cambia el slug, verificar que no exista
    if (datos.slug && datos.slug !== tipo.slug) {
      const tipoConSlug = await prisma.tipoTrabajo.findUnique({
        where: { slug: datos.slug },
      });

      if (tipoConSlug) {
        throw new ApiError(409, "Ya existe un tipo de trabajo con ese slug");
      }
    }

    const tipoActualizado = await prisma.tipoTrabajo.update({
      where: { id },
      data: datos,
    });

    return tipoActualizado;
  }

  /**
   * Eliminar un tipo de trabajo (solo admin)
   */
  async eliminar(id: number) {
    const tipo = await prisma.tipoTrabajo.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            trabajos: true,
          },
        },
      },
    });

    if (!tipo) {
      throw new ApiError(404, "Tipo de trabajo no encontrado");
    }

    // No permitir eliminar si tiene trabajos asociados
    if (tipo._count.trabajos > 0) {
      throw new ApiError(
        400,
        `No se puede eliminar el tipo de trabajo porque tiene ${tipo._count.trabajos} trabajo(s) asociado(s)`
      );
    }

    await prisma.tipoTrabajo.delete({
      where: { id },
    });

    return { mensaje: "Tipo de trabajo eliminado exitosamente" };
  }
}
