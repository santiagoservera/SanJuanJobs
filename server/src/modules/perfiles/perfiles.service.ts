import bcrypt from "bcryptjs";
import prisma from "../../config/database";
import { ApiError } from "../../middleware/errorHandler";
import {
  ActualizarPerfilEmpleadoDTO,
  ActualizarPerfilEmpleadorDTO,
  CambiarContrasenaDTO,
  PerfilEmpleadorPublicoResponse,
} from "./perfiles.types";

/**
 * Servicio de perfiles
 * Contiene la lógica de negocio para gestión de perfiles de usuario
 */
export class PerfilesService {
  /**
   * Obtener perfil completo del usuario
   */
  async obtenerPerfil(usuarioId: number) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        email: true,
        rol: true,
        fechaCreacion: true,
        perfilEmpleado: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            domicilio: true,
            telefono: true,
            sobreMi: true,
            experiencia: true,
            educacion: true,
          },
        },
        perfilEmpleador: {
          select: {
            id: true,
            nombreEmpresa: true,
            descripcionEmpresa: true,
            emailContacto: true,
            telefonoContacto: true,
            sitioWeb: true,
          },
        },
      },
    });

    if (!usuario) {
      throw new ApiError(404, "Usuario no encontrado");
    }

    return usuario;
  }

  /**
   * Actualizar perfil de empleado
   */
  async actualizarPerfilEmpleado(
    usuarioId: number,
    datos: ActualizarPerfilEmpleadoDTO,
  ) {
    // Verificar que el usuario sea empleado y tenga perfil
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: { perfilEmpleado: true },
    });

    if (!usuario) {
      throw new ApiError(404, "Usuario no encontrado");
    }

    if (usuario.rol !== "EMPLEADO") {
      throw new ApiError(
        403,
        "Solo los empleados pueden actualizar este perfil",
      );
    }

    if (!usuario.perfilEmpleado) {
      throw new ApiError(404, "Perfil de empleado no encontrado");
    }

    // Actualizar perfil
    const perfilActualizado = await prisma.perfilEmpleado.update({
      where: { usuarioId },
      data: datos,
    });

    return perfilActualizado;
  }

  /**
   * Actualizar perfil de empleador
   */
  async actualizarPerfilEmpleador(
    usuarioId: number,
    datos: ActualizarPerfilEmpleadorDTO,
  ) {
    // Verificar que el usuario sea empleador y tenga perfil
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: { perfilEmpleador: true },
    });

    if (!usuario) {
      throw new ApiError(404, "Usuario no encontrado");
    }

    if (usuario.rol !== "EMPLEADOR") {
      throw new ApiError(
        403,
        "Solo los empleadores pueden actualizar este perfil",
      );
    }

    if (!usuario.perfilEmpleador) {
      throw new ApiError(404, "Perfil de empleador no encontrado");
    }

    // Actualizar perfil
    const perfilActualizado = await prisma.perfilEmpleador.update({
      where: { usuarioId },
      data: datos,
    });

    return perfilActualizado;
  }

  /**
   * Cambiar contraseña
   */
  async cambiarContrasena(usuarioId: number, datos: CambiarContrasenaDTO) {
    // Obtener usuario con contraseña
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        contrasena: true,
      },
    });

    if (!usuario) {
      throw new ApiError(404, "Usuario no encontrado");
    }

    // Verificar contraseña actual
    const contrasenaValida = await bcrypt.compare(
      datos.contrasenaActual,
      usuario.contrasena,
    );

    if (!contrasenaValida) {
      throw new ApiError(401, "La contraseña actual es incorrecta");
    }

    // Validar que la nueva contraseña sea diferente
    const mismaContrasena = await bcrypt.compare(
      datos.contrasenaNueva,
      usuario.contrasena,
    );

    if (mismaContrasena) {
      throw new ApiError(
        400,
        "La nueva contraseña debe ser diferente a la actual",
      );
    }

    // Hashear nueva contraseña
    const nuevaContrasenaHasheada = await bcrypt.hash(
      datos.contrasenaNueva,
      10,
    );

    // Actualizar contraseña
    await prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        contrasena: nuevaContrasenaHasheada,
      },
    });

    return { mensaje: "Contraseña actualizada exitosamente" };
  }

  /**
   * Obtener perfil público de un empleado (para empleadores)
   */
  async obtenerPerfilPublicoEmpleado(empleadoId: number) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: empleadoId },
      select: {
        id: true,
        email: true,
        rol: true,
        fechaCreacion: true,
        perfilEmpleado: {
          select: {
            nombre: true,
            apellido: true,
            telefono: true,
            sobreMi: true,
            experiencia: true,
            educacion: true,
          },
        },
      },
    });

    if (!usuario) {
      throw new ApiError(404, "Usuario no encontrado");
    }

    if (usuario.rol !== "EMPLEADO") {
      throw new ApiError(400, "El usuario no es un empleado");
    }

    if (!usuario.perfilEmpleado) {
      throw new ApiError(404, "Perfil de empleado no encontrado");
    }

    return usuario;
  }

  /**
   * Obtener perfil público de un empleador (para empleados)
   */
  async obtenerPerfilPublicoEmpleador(empleadorId: number) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: empleadorId },
      select: {
        id: true,
        rol: true,
        fechaCreacion: true,
        perfilEmpleador: {
          select: {
            nombreEmpresa: true,
            descripcionEmpresa: true,
            emailContacto: true,
            telefonoContacto: true,
            sitioWeb: true,
          },
        },
        _count: {
          select: {
            trabajosPublicados: {
              where: {
                estado: "ACTIVO",
              },
            },
          },
        },
      },
    });

    if (!usuario) {
      throw new ApiError(404, "Usuario no encontrado");
    }

    if (usuario.rol !== "EMPLEADOR") {
      throw new ApiError(400, "El usuario no es un empleador");
    }

    if (!usuario.perfilEmpleador) {
      throw new ApiError(404, "Perfil de empleador no encontrado");
    }

    return usuario;
  }

  /**
   * Obtener perfil público de un empleador
   */
  async obtenerPerfilEmpleadorPublico(
    empleadorId: number,
  ): Promise<PerfilEmpleadorPublicoResponse> {
    // Obtener empleador con perfil
    const empleador = await prisma.usuario.findUnique({
      where: {
        id: empleadorId,
        rol: "EMPLEADOR",
      },
      include: {
        perfilEmpleador: true,
      },
    });

    if (!empleador || !empleador.perfilEmpleador) {
      throw new ApiError(404, "Empleador no encontrado");
    }

    // Obtener trabajos activos
    const trabajos = await prisma.trabajo.findMany({
      where: {
        empleadorId,
        estado: "ACTIVO",
      },
      select: {
        id: true,
        titulo: true,
        ubicacion: true,
        fechaCreacion: true,
        tipoTrabajo: {
          select: {
            nombre: true,
            slug: true,
          },
        },
        categoria: {
          select: {
            nombre: true,
          },
        },
        _count: {
          select: {
            postulaciones: true,
          },
        },
      },
      orderBy: {
        fechaCreacion: "desc",
      },
    });

    // Calcular estadísticas
    const totalTrabajos = await prisma.trabajo.count({
      where: { empleadorId },
    });

    const trabajosActivos = await prisma.trabajo.count({
      where: {
        empleadorId,
        estado: "ACTIVO",
      },
    });

    // Construir respuesta tipada
    const response: PerfilEmpleadorPublicoResponse = {
      id: empleador.id,
      perfilEmpleador: {
        nombreEmpresa: empleador.perfilEmpleador.nombreEmpresa,
        descripcionEmpresa: empleador.perfilEmpleador.descripcionEmpresa,
        emailContacto: empleador.perfilEmpleador.emailContacto,
        telefonoContacto: empleador.perfilEmpleador.telefonoContacto,
        sitioWeb: empleador.perfilEmpleador.sitioWeb,
      },
      trabajos: trabajos.map((t) => ({
        ...t,
        ubicacion: t.ubicacion ?? "",
      })),
      estadisticas: {
        totalTrabajos,
        trabajosActivos,
      },
    };

    return response;
  }
}
