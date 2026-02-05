import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/database";
import { config } from "../../config/env";
import { ApiError } from "../../middleware/errorHandler";
import { RegistroDTO, LoginDTO, AuthResponse, JWTPayload } from "./auth.types";
import { ROLES_USUARIO } from "../../types";

/**
 * Servicio de autenticación
 * Contiene la lógica de negocio para registro, login y generación de tokens
 */
export class AuthService {
  /**
   * Registrar un nuevo usuario
   */
  async registrar(datos: RegistroDTO): Promise<AuthResponse> {
    // Validar que el rol sea válido
    if (!ROLES_USUARIO.includes(datos.rol)) {
      throw new ApiError(400, "Rol inválido");
    }

    // Verificar si el email ya está registrado
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: datos.email },
    });

    if (usuarioExistente) {
      throw new ApiError(409, "El email ya está registrado");
    }

    // Hashear la contraseña
    const contrasenaHasheada = await bcrypt.hash(datos.contrasena, 10);

    // Crear el usuario con su perfil según el rol
    let usuario;

    if (datos.rol === "EMPLEADO") {
      // Validar que tenga nombre y apellido
      if (!datos.nombre || !datos.apellido) {
        throw new ApiError(
          400,
          "Los empleados deben proporcionar nombre y apellido"
        );
      }

      usuario = await prisma.usuario.create({
        data: {
          email: datos.email,
          contrasena: contrasenaHasheada,
          rol: datos.rol,
          perfilEmpleado: {
            create: {
              nombre: datos.nombre,
              apellido: datos.apellido,
            },
          },
        },
        select: {
          id: true,
          email: true,
          rol: true,
        },
      });
    } else if (datos.rol === "EMPLEADOR") {
      // Validar que tenga nombre de empresa
      if (!datos.nombreEmpresa) {
        throw new ApiError(
          400,
          "Los empleadores deben proporcionar el nombre de la empresa"
        );
      }

      usuario = await prisma.usuario.create({
        data: {
          email: datos.email,
          contrasena: contrasenaHasheada,
          rol: datos.rol,
          perfilEmpleador: {
            create: {
              nombreEmpresa: datos.nombreEmpresa,
            },
          },
        },
        select: {
          id: true,
          email: true,
          rol: true,
        },
      });
    } else {
      // ADMIN - sin perfil adicional
      usuario = await prisma.usuario.create({
        data: {
          email: datos.email,
          contrasena: contrasenaHasheada,
          rol: datos.rol,
        },
        select: {
          id: true,
          email: true,
          rol: true,
        },
      });
    }

    // Generar token JWT
    const token = this.generarToken({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol as any,
    });

    return {
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol as any,
      },
    };
  }

  /**
   * Iniciar sesión
   */
  async login(datos: LoginDTO): Promise<AuthResponse> {
    // Buscar usuario por email
    const usuario = await prisma.usuario.findUnique({
      where: { email: datos.email },
      select: {
        id: true,
        email: true,
        contrasena: true,
        rol: true,
      },
    });

    if (!usuario) {
      throw new ApiError(401, "Credenciales inválidas");
    }

    // Verificar contraseña
    const contrasenaValida = await bcrypt.compare(
      datos.contrasena,
      usuario.contrasena
    );

    if (!contrasenaValida) {
      throw new ApiError(401, "Credenciales inválidas");
    }

    // Generar token JWT
    const token = this.generarToken({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol as any,
    });

    return {
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol as any,
      },
    };
  }

  /**
   * Obtener información del usuario autenticado
   */
  async obtenerUsuario(id: number) {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
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
            domicilio: true,
            sobreMi: true,
            experiencia: true,
            educacion: true,
          },
        },
        perfilEmpleador: {
          select: {
            nombreEmpresa: true,
            emailContacto: true,
            telefonoContacto: true,
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
   * Generar token JWT
   */
  private generarToken(payload: JWTPayload): string {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    } as jwt.SignOptions);
  }

  /**
   * Verificar token JWT
   */
  verificarToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.jwtSecret) as JWTPayload;
    } catch (error) {
      throw new ApiError(401, "Token inválido o expirado");
    }
  }
}
