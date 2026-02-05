import prisma from "../../config/database";
import { ApiError } from "../../middleware/errorHandler";
import { CrearCategoriaDTO, ActualizarCategoriaDTO } from "./categorias.types";

/**
 * Servicio de categorías
 * Contiene la lógica de negocio para gestión de categorías
 */
export class CategoriasService {
  /**
   * Listar todas las categorías
   */
  async listar() {
    const categorias = await prisma.categoria.findMany({
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

    return categorias;
  }

  /**
   * Obtener una categoría por ID
   */
  async obtenerPorId(id: number) {
    const categoria = await prisma.categoria.findUnique({
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

    if (!categoria) {
      throw new ApiError(404, "Categoría no encontrada");
    }

    return categoria;
  }

  /**
   * Obtener una categoría por slug
   */
  async obtenerPorSlug(slug: string) {
    const categoria = await prisma.categoria.findUnique({
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

    if (!categoria) {
      throw new ApiError(404, "Categoría no encontrada");
    }

    return categoria;
  }

  /**
   * Crear una categoría (solo admin)
   */
  async crear(datos: CrearCategoriaDTO) {
    // Verificar que el slug no exista
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { slug: datos.slug },
    });

    if (categoriaExistente) {
      throw new ApiError(409, "Ya existe una categoría con ese slug");
    }

    const categoria = await prisma.categoria.create({
      data: datos,
    });

    return categoria;
  }

  /**
   * Actualizar una categoría (solo admin)
   */
  async actualizar(id: number, datos: ActualizarCategoriaDTO) {
    const categoria = await prisma.categoria.findUnique({
      where: { id },
    });

    if (!categoria) {
      throw new ApiError(404, "Categoría no encontrada");
    }

    // Si se cambia el slug, verificar que no exista
    if (datos.slug && datos.slug !== categoria.slug) {
      const categoriaConSlug = await prisma.categoria.findUnique({
        where: { slug: datos.slug },
      });

      if (categoriaConSlug) {
        throw new ApiError(409, "Ya existe una categoría con ese slug");
      }
    }

    const categoriaActualizada = await prisma.categoria.update({
      where: { id },
      data: datos,
    });

    return categoriaActualizada;
  }

  /**
   * Eliminar una categoría (solo admin)
   */
  async eliminar(id: number) {
    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            trabajos: true,
          },
        },
      },
    });

    if (!categoria) {
      throw new ApiError(404, "Categoría no encontrada");
    }

    // No permitir eliminar si tiene trabajos asociados
    if (categoria._count.trabajos > 0) {
      throw new ApiError(
        400,
        `No se puede eliminar la categoría porque tiene ${categoria._count.trabajos} trabajo(s) asociado(s)`
      );
    }

    await prisma.categoria.delete({
      where: { id },
    });

    return { mensaje: "Categoría eliminada exitosamente" };
  }
}
