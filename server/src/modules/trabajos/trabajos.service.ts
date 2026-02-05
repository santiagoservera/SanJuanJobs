import prisma from "../../config/database";
import { ApiError } from "../../middleware/errorHandler";
import {
  CrearTrabajoDTO,
  ActualizarTrabajoDTO,
  FiltrosTrabajos,
  TrabajosPaginados,
} from "./trabajos.types";

/**
 * Servicio de trabajos
 * Contiene la lógica de negocio para gestión de ofertas laborales
 */
export class TrabajosService {
  /**
   * Listar trabajos con filtros y paginación
   */
  async listar(filtros: FiltrosTrabajos): Promise<TrabajosPaginados> {
    const {
      categoriaId,
      tipoTrabajoId,
      departamentoId,
      ubicacion,
      busqueda,
      estado = "ACTIVO",
      pagina = 1,
      limite = 10,
    } = filtros;

    // Construir condiciones de búsqueda
    const where: any = {
      estado,
    };

    if (categoriaId) {
      where.categoriaId = categoriaId;
    }

    if (tipoTrabajoId) {
      where.tipoTrabajoId = tipoTrabajoId;
    }

    if (departamentoId) {
      where.departamentoId = departamentoId;
    }

    if (ubicacion) {
      where.ubicacion = {
        contains: ubicacion,
      };
    }

    if (busqueda) {
      where.OR = [
        { titulo: { contains: busqueda } },
        { descripcion: { contains: busqueda } },
      ];
    }

    // Calcular offset para paginación
    const offset = (pagina - 1) * limite;

    // Ejecutar consultas en paralelo
    const [trabajos, total] = await Promise.all([
      prisma.trabajo.findMany({
        where,
        skip: offset,
        take: limite,
        orderBy: {
          fechaCreacion: "desc",
        },
        include: {
          categoria: {
            select: {
              id: true,
              nombre: true,
              slug: true,
            },
          },
          tipoTrabajo: {
            select: {
              id: true,
              nombre: true,
              slug: true,
            },
          },
          departamento: {
            select: {
              id: true,
              nombre: true,
              slug: true,
            },
          },
          empleador: {
            select: {
              id: true,
              email: true,
              perfilEmpleador: {
                select: {
                  nombreEmpresa: true,
                },
              },
            },
          },
          _count: {
            select: {
              postulaciones: true,
            },
          },
        },
      }),
      prisma.trabajo.count({ where }),
    ]);

    const totalPaginas = Math.ceil(total / limite);

    return {
      trabajos,
      total,
      pagina,
      totalPaginas,
    };
  }

  /**
   * Obtener un trabajo por ID
   */
  async obtenerPorId(id: number) {
    const trabajo = await prisma.trabajo.findUnique({
      where: { id },
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
            slug: true,
          },
        },
        tipoTrabajo: {
          select: {
            id: true,
            nombre: true,
            slug: true,
          },
        },
        departamento: {
          select: {
            id: true,
            nombre: true,
            slug: true,
          },
        },
        empleador: {
          select: {
            id: true,
            email: true,
            perfilEmpleador: {
              select: {
                nombreEmpresa: true,
                emailContacto: true,
                telefonoContacto: true,
                sitioWeb: true,
              },
            },
          },
        },
        _count: {
          select: {
            postulaciones: true,
          },
        },
      },
    });

    if (!trabajo) {
      throw new ApiError(404, "Trabajo no encontrado");
    }

    return trabajo;
  }

  /**
   * Crear un nuevo trabajo
   */
  async crear(empleadorId: number, datos: CrearTrabajoDTO) {
    // Verificar que la categoría existe
    const categoria = await prisma.categoria.findUnique({
      where: { id: datos.categoriaId },
    });

    if (!categoria) {
      throw new ApiError(404, "Categoría no encontrada");
    }

    // Verificar que el tipo de trabajo existe
    const tipoTrabajo = await prisma.tipoTrabajo.findUnique({
      where: { id: datos.tipoTrabajoId },
    });

    if (!tipoTrabajo) {
      throw new ApiError(404, "Tipo de trabajo no encontrado");
    }

    // Verificar que el departamento existe
    const departamento = await prisma.departamento.findUnique({
      where: { id: datos.departamentoId },
    });

    if (!departamento) {
      throw new ApiError(404, "Departamento no encontrado");
    }

    // Crear el trabajo
    const trabajo = await prisma.trabajo.create({
      data: {
        empleadorId,
        titulo: datos.titulo,
        descripcion: datos.descripcion,
        departamentoId: datos.departamentoId,
        ubicacion: datos.ubicacion,
        googleMapsUrl: datos.googleMapsUrl,
        latitud: datos.latitud,
        longitud: datos.longitud,
        categoriaId: datos.categoriaId,
        tipoTrabajoId: datos.tipoTrabajoId,
        paga: datos.paga,
        requisitos: datos.requisitos,
        beneficios: datos.beneficios,
        estado: datos.estado || "ACTIVO",
      },
      include: {
        categoria: true,
        tipoTrabajo: true,
        departamento: true,
      },
    });

    return trabajo;
  }

  /**
   * Actualizar un trabajo
   */
  async actualizar(
    id: number,
    empleadorId: number,
    datos: ActualizarTrabajoDTO,
  ) {
    // Verificar que el trabajo existe y pertenece al empleador
    const trabajoExistente = await prisma.trabajo.findUnique({
      where: { id },
    });

    if (!trabajoExistente) {
      throw new ApiError(404, "Trabajo no encontrado");
    }

    if (trabajoExistente.empleadorId !== empleadorId) {
      throw new ApiError(403, "No tienes permiso para editar este trabajo");
    }

    // Si se cambia la categoría, verificar que existe
    if (datos.categoriaId) {
      const categoria = await prisma.categoria.findUnique({
        where: { id: datos.categoriaId },
      });

      if (!categoria) {
        throw new ApiError(404, "Categoría no encontrada");
      }
    }

    // Si se cambia el tipo de trabajo, verificar que existe
    if (datos.tipoTrabajoId) {
      const tipoTrabajo = await prisma.tipoTrabajo.findUnique({
        where: { id: datos.tipoTrabajoId },
      });

      if (!tipoTrabajo) {
        throw new ApiError(404, "Tipo de trabajo no encontrado");
      }
    }

    // Si se cambia el departamento, verificar que existe
    if (datos.departamentoId) {
      const departamento = await prisma.departamento.findUnique({
        where: { id: datos.departamentoId },
      });

      if (!departamento) {
        throw new ApiError(404, "Departamento no encontrado");
      }
    }

    // Actualizar el trabajo
    const trabajoActualizado = await prisma.trabajo.update({
      where: { id },
      data: datos,
      include: {
        categoria: true,
        tipoTrabajo: true,
        departamento: true,
      },
    });

    return trabajoActualizado;
  }

  /**
   * Eliminar un trabajo
   */
  async eliminar(id: number, empleadorId: number) {
    // Verificar que el trabajo existe y pertenece al empleador
    const trabajo = await prisma.trabajo.findUnique({
      where: { id },
    });

    if (!trabajo) {
      throw new ApiError(404, "Trabajo no encontrado");
    }

    if (trabajo.empleadorId !== empleadorId) {
      throw new ApiError(403, "No tienes permiso para eliminar este trabajo");
    }

    // Eliminar el trabajo (las postulaciones se eliminan en cascada)
    await prisma.trabajo.delete({
      where: { id },
    });

    return { mensaje: "Trabajo eliminado exitosamente" };
  }

  /**
   * Obtener trabajos publicados por el empleador autenticado
   */
  async obtenerMisPublicaciones(empleadorId: number) {
    const trabajos = await prisma.trabajo.findMany({
      where: {
        empleadorId,
      },
      orderBy: {
        fechaCreacion: "desc",
      },
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
            slug: true,
          },
        },
        tipoTrabajo: {
          select: {
            id: true,
            nombre: true,
            slug: true,
          },
        },
        departamento: {
          select: {
            id: true,
            nombre: true,
            slug: true,
          },
        },
        _count: {
          select: {
            postulaciones: true,
          },
        },
      },
    });

    return trabajos;
  }

  /**
   * Obtener estadísticas de trabajos del empleador
   */
  async obtenerEstadisticas(empleadorId: number) {
    const [trabajosActivos, trabajosCerrados, totalPostulaciones] =
      await Promise.all([
        prisma.trabajo.count({
          where: {
            empleadorId,
            estado: "ACTIVO",
          },
        }),
        prisma.trabajo.count({
          where: {
            empleadorId,
            estado: "CERRADO",
          },
        }),
        prisma.postulacion.count({
          where: {
            trabajo: {
              empleadorId,
            },
          },
        }),
      ]);

    const postulacionesPorEstado = await prisma.postulacion.groupBy({
      by: ["estado"],
      where: {
        trabajo: {
          empleadorId,
        },
      },
      _count: true,
    });

    const estadisticas = {
      trabajosActivos,
      trabajosCerrados,
      totalPostulaciones,
      postulacionesPendientes:
        postulacionesPorEstado.find((p) => p.estado === "PENDIENTE")?._count ||
        0,
      postulacionesRevisadas:
        postulacionesPorEstado.find((p) => p.estado === "REVISADA")?._count ||
        0,
      postulacionesAceptadas:
        postulacionesPorEstado.find((p) => p.estado === "ACEPTADA")?._count ||
        0,
      postulacionesRechazadas:
        postulacionesPorEstado.find((p) => p.estado === "RECHAZADA")?._count ||
        0,
    };

    return estadisticas;
  }

  /**
   * Buscar sugerencias de títulos de trabajos
   */
  async buscarSugerencias(query: string): Promise<string[]> {
    const trabajos = await prisma.trabajo.findMany({
      where: {
        estado: "ACTIVO",
        titulo: {
          contains: query,
        },
      },
      select: {
        titulo: true,
      },
      distinct: ["titulo"],
      take: 10,
      orderBy: {
        fechaCreacion: "desc",
      },
    });

    // Devolver solo los títulos únicos
    return [...new Set(trabajos.map((t) => t.titulo))];
  }
}
