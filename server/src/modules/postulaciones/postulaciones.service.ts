import prisma from "../../config/database";
import { ApiError } from "../../middleware/errorHandler";
import {
  CrearPostulacionDTO,
  ActualizarEstadoDTO,
  FiltrosPostulaciones,
  PostulacionesPaginadas,
} from "./postulaciones.types";

/**
 * Servicio de postulaciones
 * Contiene la lógica de negocio para gestión de postulaciones
 */
export class PostulacionesService {
  /**
   * Crear una postulación (empleado postula a un trabajo)
   */
  async crear(empleadoId: number, datos: CrearPostulacionDTO) {
    // Verificar que el trabajo existe y está activo
    const trabajo = await prisma.trabajo.findUnique({
      where: { id: datos.trabajoId },
      include: {
        empleador: true,
      },
    });

    if (!trabajo) {
      throw new ApiError(404, "Trabajo no encontrado");
    }

    if (trabajo.estado !== "ACTIVO") {
      throw new ApiError(
        400,
        "Este trabajo ya no está aceptando postulaciones"
      );
    }

    // Verificar que el empleado no sea el dueño del trabajo
    if (trabajo.empleadorId === empleadoId) {
      throw new ApiError(400, "No puedes postularte a tu propio trabajo");
    }

    // Verificar que no se haya postulado antes
    const postulacionExistente = await prisma.postulacion.findUnique({
      where: {
        trabajoId_empleadoId: {
          trabajoId: datos.trabajoId,
          empleadoId: empleadoId,
        },
      },
    });

    if (postulacionExistente) {
      throw new ApiError(409, "Ya te has postulado a este trabajo");
    }

    // Crear la postulación
    const postulacion = await prisma.postulacion.create({
      data: {
        trabajoId: datos.trabajoId,
        empleadoId: empleadoId,
        cartaPresentacion: datos.cartaPresentacion,
        estado: "PENDIENTE",
      },
      include: {
        trabajo: {
          include: {
            categoria: true,
            tipoTrabajo: true,
            empleador: {
              include: {
                perfilEmpleador: true,
              },
            },
          },
        },
        empleado: {
          include: {
            perfilEmpleado: true,
          },
        },
      },
    });

    return postulacion;
  }

  /**
   * Obtener postulaciones del empleado autenticado
   */
  async obtenerMisPostulaciones(
    empleadoId: number,
    filtros: FiltrosPostulaciones
  ): Promise<PostulacionesPaginadas> {
    const { estado, pagina = 1, limite = 10 } = filtros;

    const where: any = {
      empleadoId,
    };

    if (estado) {
      where.estado = estado;
    }

    const offset = (pagina - 1) * limite;

    const [postulaciones, total] = await Promise.all([
      prisma.postulacion.findMany({
        where,
        skip: offset,
        take: limite,
        orderBy: {
          fechaPostulacion: "desc",
        },
        include: {
          trabajo: {
            include: {
              categoria: true,
              tipoTrabajo: true,
              empleador: {
                include: {
                  perfilEmpleador: true,
                },
              },
            },
          },
        },
      }),
      prisma.postulacion.count({ where }),
    ]);

    const totalPaginas = Math.ceil(total / limite);

    return {
      postulaciones,
      total,
      pagina,
      totalPaginas,
    };
  }

  /**
   * Obtener postulaciones recibidas en los trabajos del empleador
   */
  async obtenerPostulacionesRecibidas(
    empleadorId: number,
    filtros: FiltrosPostulaciones
  ): Promise<PostulacionesPaginadas> {
    const { estado, trabajoId, pagina = 1, limite = 10 } = filtros;

    // Construir where
    const where: any = {
      trabajo: {
        empleadorId,
      },
    };

    if (estado) {
      where.estado = estado;
    }

    if (trabajoId) {
      where.trabajoId = trabajoId;
    }

    const offset = (pagina - 1) * limite;

    const [postulaciones, total] = await Promise.all([
      prisma.postulacion.findMany({
        where,
        skip: offset,
        take: limite,
        orderBy: {
          fechaPostulacion: "desc",
        },
        include: {
          trabajo: {
            include: {
              categoria: true,
              tipoTrabajo: true,
            },
          },
          empleado: {
            include: {
              perfilEmpleado: true,
            },
          },
        },
      }),
      prisma.postulacion.count({ where }),
    ]);

    const totalPaginas = Math.ceil(total / limite);

    return {
      postulaciones,
      total,
      pagina,
      totalPaginas,
    };
  }

  /**
   * Obtener una postulación por ID
   */
  async obtenerPorId(id: number, usuarioId: number, rol: string) {
    const postulacion = await prisma.postulacion.findUnique({
      where: { id },
      include: {
        trabajo: {
          include: {
            categoria: true,
            tipoTrabajo: true,
            empleador: {
              include: {
                perfilEmpleador: true,
              },
            },
          },
        },
        empleado: {
          include: {
            perfilEmpleado: true,
          },
        },
      },
    });

    if (!postulacion) {
      throw new ApiError(404, "Postulación no encontrada");
    }

    // Verificar permisos: solo el empleado o el empleador pueden ver la postulación
    const esEmpleado = postulacion.empleadoId === usuarioId;
    const esEmpleador = postulacion.trabajo.empleadorId === usuarioId;
    const esAdmin = rol === "ADMIN";

    if (!esEmpleado && !esEmpleador && !esAdmin) {
      throw new ApiError(403, "No tienes permiso para ver esta postulación");
    }

    return postulacion;
  }

  /**
   * Actualizar el estado de una postulación (solo empleador)
   */
  async actualizarEstado(
    id: number,
    empleadorId: number,
    datos: ActualizarEstadoDTO
  ) {
    // Verificar que la postulación existe y pertenece a un trabajo del empleador
    const postulacion = await prisma.postulacion.findUnique({
      where: { id },
      include: {
        trabajo: true,
      },
    });

    if (!postulacion) {
      throw new ApiError(404, "Postulación no encontrada");
    }

    if (postulacion.trabajo.empleadorId !== empleadorId) {
      throw new ApiError(
        403,
        "No tienes permiso para modificar esta postulación"
      );
    }

    // Actualizar estado
    const postulacionActualizada = await prisma.postulacion.update({
      where: { id },
      data: {
        estado: datos.estado,
        fechaRevision: datos.estado !== "PENDIENTE" ? new Date() : null,
      },
      include: {
        trabajo: {
          include: {
            categoria: true,
            tipoTrabajo: true,
          },
        },
        empleado: {
          include: {
            perfilEmpleado: true,
          },
        },
      },
    });

    return postulacionActualizada;
  }

  /**
   * Eliminar una postulación (solo el empleado que la creó)
   */
  async eliminar(id: number, empleadoId: number) {
    // Verificar que la postulación existe y pertenece al empleado
    const postulacion = await prisma.postulacion.findUnique({
      where: { id },
    });

    if (!postulacion) {
      throw new ApiError(404, "Postulación no encontrada");
    }

    if (postulacion.empleadoId !== empleadoId) {
      throw new ApiError(
        403,
        "No tienes permiso para eliminar esta postulación"
      );
    }

    // No permitir eliminar si ya fue revisada o aceptada
    if (postulacion.estado === "ACEPTADA") {
      throw new ApiError(400, "No puedes eliminar una postulación aceptada");
    }

    // Eliminar la postulación
    await prisma.postulacion.delete({
      where: { id },
    });

    return { mensaje: "Postulación eliminada exitosamente" };
  }

  /**
   * Obtener estadísticas de postulaciones del empleador
   */
  async obtenerEstadisticas(empleadorId: number) {
    const estadisticas = await prisma.postulacion.groupBy({
      by: ["estado"],
      where: {
        trabajo: {
          empleadorId,
        },
      },
      _count: {
        estado: true,
      },
    });

    const total = await prisma.postulacion.count({
      where: {
        trabajo: {
          empleadorId,
        },
      },
    });

    return {
      total,
      porEstado: estadisticas.reduce((acc, curr) => {
        acc[curr.estado] = curr._count.estado;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
