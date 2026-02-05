import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // ============================================================================
  // Crear categorías de trabajo
  // ============================================================================
  console.log("📁 Creando categorías...");

  console.log("📁 Creando categorías...");

  const categorias = [
    // Categorías principales
    {
      nombre: "Gastronomía",
      slug: "gastronomia",
      descripcion: "Restaurantes, bares, confiterías, cocina y delivery",
    },
    {
      nombre: "Comercio",
      slug: "comercio",
      descripcion: "Ventas, atención al cliente, retail y supermercados",
    },
    {
      nombre: "Agricultura",
      slug: "agricultura",
      descripcion:
        "Trabajos del campo, vitivinicultura, olivicultura y cosecha",
    },
    {
      nombre: "Construcción",
      slug: "construccion",
      descripcion: "Obras, albañilería, construcción y mantenimiento edilicio",
    },
    {
      nombre: "Turismo",
      slug: "turismo",
      descripcion: "Hotelería, guías turísticos, agencias y recreación",
    },
    {
      nombre: "Oficios",
      slug: "oficios",
      descripcion: "Plomería, electricidad, carpintería, herrería y pintura",
    },
    // Nuevas categorías
    {
      nombre: "Tecnología",
      slug: "tecnologia",
      descripcion: "Informática, programación, soporte técnico y redes",
    },
    {
      nombre: "Salud",
      slug: "salud",
      descripcion:
        "Enfermería, cuidado de personas, farmacias y asistencia médica",
    },
    {
      nombre: "Educación",
      slug: "educacion",
      descripcion: "Docencia, tutorías, capacitación y cuidado infantil",
    },
    {
      nombre: "Transporte",
      slug: "transporte",
      descripcion: "Choferes, delivery, logística y mudanzas",
    },
    {
      nombre: "Limpieza",
      slug: "limpieza",
      descripcion: "Limpieza de hogares, oficinas, edificios y mantenimiento",
    },
    {
      nombre: "Seguridad",
      slug: "seguridad",
      descripcion: "Vigilancia, seguridad privada y monitoreo",
    },
    {
      nombre: "Administración",
      slug: "administracion",
      descripcion: "Secretaría, recepción, contabilidad y recursos humanos",
    },
    {
      nombre: "Belleza",
      slug: "belleza",
      descripcion: "Peluquería, estética, manicuría y spa",
    },
    {
      nombre: "Automotriz",
      slug: "automotriz",
      descripcion: "Mecánica, chapa y pintura, gomería y lavaderos",
    },
    {
      nombre: "Minería",
      slug: "mineria",
      descripcion: "Trabajos en minería, canteras y extracción",
    },
    {
      nombre: "Textil",
      slug: "textil",
      descripcion: "Costura, confección, modistería y arreglos",
    },
    {
      nombre: "Servicio Doméstico",
      slug: "domestico",
      descripcion: "Empleadas domésticas, niñeras, cuidadores y jardinería",
    },
  ];

  for (const categoria of categorias) {
    await prisma.categoria.upsert({
      where: { slug: categoria.slug },
      update: {
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
      },
      create: categoria,
    });
  }
  console.log(`✅ ${categorias.length} categorías creadas/actualizadas`);

  // ============================================================================
  // Crear tipos de trabajo
  // ============================================================================
  console.log("🏷️  Creando tipos de trabajo...");

  const tiposTrabajo = [
    { nombre: "Todos", slug: "todos" },
    { nombre: "Tiempo Completo", slug: "tiempo-completo" },
    { nombre: "Medio Tiempo", slug: "medio-tiempo" },
    { nombre: "Temporal", slug: "temporal" },
    { nombre: "Pasantía", slug: "pasantia" },
  ];

  for (const tipo of tiposTrabajo) {
    await prisma.tipoTrabajo.upsert({
      where: { slug: tipo.slug },
      update: {},
      create: tipo,
    });
  }
  console.log(`✅ ${tiposTrabajo.length} tipos de trabajo creados`);

  // ============================================================================
  // Crear departamentos de San Juan
  // ============================================================================
  console.log("📍 Creando departamentos de San Juan...");

  const departamentos = [
    { nombre: "Capital", slug: "capital", codigo: "5400" },
    { nombre: "Rawson", slug: "rawson", codigo: "5425" },
    { nombre: "Chimbas", slug: "chimbas", codigo: "5413" },
    { nombre: "Rivadavia", slug: "rivadavia", codigo: "5419" },
    { nombre: "Santa Lucía", slug: "santa-lucia", codigo: "5411" },
    { nombre: "Pocito", slug: "pocito", codigo: "5427" },
    { nombre: "Angaco", slug: "angaco", codigo: "5449" },
    { nombre: "Albardón", slug: "albardon", codigo: "5419" },
    { nombre: "25 de Mayo", slug: "25-de-mayo", codigo: "5436" },
    { nombre: "9 de Julio", slug: "9-de-julio", codigo: "5435" },
    { nombre: "Caucete", slug: "caucete", codigo: "5442" },
    { nombre: "Jáchal", slug: "jachal", codigo: "5460" },
    { nombre: "Valle Fértil", slug: "valle-fertil", codigo: "5449" },
    { nombre: "Zonda", slug: "zonda", codigo: "5413" },
    { nombre: "Ullum", slug: "ullum", codigo: "5409" },
    { nombre: "Sarmiento", slug: "sarmiento", codigo: "5413" },
    { nombre: "Calingasta", slug: "calingasta", codigo: "5405" },
    { nombre: "Iglesia", slug: "iglesia", codigo: "5405" },
    { nombre: "San Martín", slug: "san-martin", codigo: "5570" },
  ];

  for (const depto of departamentos) {
    await prisma.departamento.upsert({
      where: { slug: depto.slug },
      update: {},
      create: depto,
    });
  }
  console.log(`✅ ${departamentos.length} departamentos creados`);

  // ============================================================================
  // Crear usuario administrador
  // ============================================================================
  console.log("👤 Creando usuario administrador...");

  const contrasenaHasheada = await bcrypt.hash("admin123", 10);

  await prisma.usuario.upsert({
    where: { email: "admin@trabajolocal.com" },
    update: {},
    create: {
      email: "admin@trabajolocal.com",
      contrasena: contrasenaHasheada,
      rol: "ADMIN",
    },
  });
  console.log(
    "✅ Usuario admin creado (email: admin@trabajolocal.com, contraseña: admin123)",
  );

  // ============================================================================
  // Crear usuario empleador de ejemplo
  // ============================================================================
  console.log("🏢 Creando empleador de ejemplo...");

  const contrasenaEmpleador = await bcrypt.hash("empleador123", 10);

  await prisma.usuario.upsert({
    where: { email: "empleador@ejemplo.com" },
    update: {},
    create: {
      email: "empleador@ejemplo.com",
      contrasena: contrasenaEmpleador,
      rol: "EMPLEADOR",
      perfilEmpleador: {
        create: {
          nombreEmpresa: "Restaurante El Buen Sabor",
          descripcionEmpresa:
            "Restaurante familiar con más de 20 años de trayectoria en San Juan",
          emailContacto: "contacto@buensabor.com",
          telefonoContacto: "+54 264 123-4567",
          sitioWeb: "https://buensabor.com",
        },
      },
    },
  });
  console.log("✅ Empleador de ejemplo creado");

  // ============================================================================
  // Crear usuario empleado de ejemplo
  // ============================================================================
  console.log("👨‍💼 Creando empleado de ejemplo...");

  const contrasenaEmpleado = await bcrypt.hash("empleado123", 10);

  await prisma.usuario.upsert({
    where: { email: "empleado@ejemplo.com" },
    update: {},
    create: {
      email: "empleado@ejemplo.com",
      contrasena: contrasenaEmpleado,
      rol: "EMPLEADO",
      perfilEmpleado: {
        create: {
          nombre: "Juan",
          apellido: "Pérez",
          domicilio: "Av. Libertador 123, Capital",
          telefono: "+54 264 987-6543",
          sobreMi: "Profesional responsable con ganas de crecer laboralmente",
          experiencia: "Experiencia en atención al cliente y ventas",
          educacion: "Secundario completo",
        },
      },
    },
  });
  console.log("✅ Empleado de ejemplo creado");

  console.log("\n🎉 Seed completado exitosamente!\n");
  console.log("📋 Usuarios creados:");
  console.log("   - Admin: admin@trabajolocal.com (contraseña: admin123)");
  console.log(
    "   - Empleador: empleador@ejemplo.com (contraseña: empleador123)",
  );
  console.log("   - Empleado: empleado@ejemplo.com (contraseña: empleado123)");

  // ============================================================================
  // Crear trabajos de ejemplo
  // ============================================================================
  console.log("💼 Creando trabajos de ejemplo...");

  // Obtener IDs necesarios
  const empleador = await prisma.usuario.findUnique({
    where: { email: "empleador@ejemplo.com" },
  });

  const categoriaGastronomia = await prisma.categoria.findUnique({
    where: { slug: "gastronomia" },
  });

  const categoriaComercio = await prisma.categoria.findUnique({
    where: { slug: "comercio" },
  });

  const tipoTiempoCompleto = await prisma.tipoTrabajo.findUnique({
    where: { slug: "tiempo-completo" },
  });

  const tipoMedioTiempo = await prisma.tipoTrabajo.findUnique({
    where: { slug: "medio-tiempo" },
  });

  const deptoCapital = await prisma.departamento.findUnique({
    where: { slug: "capital" },
  });

  const deptoRawson = await prisma.departamento.findUnique({
    where: { slug: "rawson" },
  });

  if (
    empleador &&
    categoriaGastronomia &&
    categoriaComercio &&
    tipoTiempoCompleto &&
    tipoMedioTiempo &&
    deptoCapital &&
    deptoRawson
  ) {
    // Trabajo 1: Mozo
    await prisma.trabajo.create({
      data: {
        empleadorId: empleador.id,
        categoriaId: categoriaGastronomia.id,
        tipoTrabajoId: tipoTiempoCompleto.id,
        departamentoId: deptoCapital.id,
        titulo: "Mozo/Moza con experiencia",
        descripcion:
          "Buscamos personal para atención al cliente en nuestro restaurante. Trabajo de lunes a sábados en horario de almuerzo y cena.",
        ubicacion: "Av. San Martín 456, Capital",
        paga: 350000,
        requisitos:
          "Experiencia mínima de 1 año en atención al público\nBuena presencia\nDisponibilidad horaria\nSecundario completo",
        beneficios:
          "Propinas\nComida incluida\nDía libre entre semana\nAmbiente laboral agradable",
        estado: "ACTIVO",
      },
    });

    // Trabajo 2: Cajero
    await prisma.trabajo.create({
      data: {
        empleadorId: empleador.id,
        categoriaId: categoriaComercio.id,
        tipoTrabajoId: tipoMedioTiempo.id,
        departamentoId: deptoRawson.id,
        titulo: "Cajero/a para supermercado",
        descripcion:
          "Importante cadena de supermercados busca cajeros para turno tarde. Medio tiempo de 14 a 20hs.",
        ubicacion: "Shopping Rawson Mall",
        paga: 250000,
        requisitos:
          "Manejo de caja registradora\nExperiencia en atención al cliente\nResponsabilidad y puntualidad",
        beneficios: "Descuentos en productos\nAguinaldo\nObra social",
        estado: "ACTIVO",
      },
    });

    // Trabajo 3: Ayudante de cocina
    await prisma.trabajo.create({
      data: {
        empleadorId: empleador.id,
        categoriaId: categoriaGastronomia.id,
        tipoTrabajoId: tipoTiempoCompleto.id,
        departamentoId: deptoCapital.id,
        titulo: "Ayudante de cocina",
        descripcion:
          "Restaurante busca ayudante de cocina para preparación de comidas y limpieza de cocina.",
        ubicacion: "Av. San Martín 456, Capital",
        paga: 320000,
        requisitos:
          "No se requiere experiencia previa\nDisponibilidad inmediata\nGanas de aprender",
        beneficios:
          "Comida incluida\nCapacitación en cocina\nPosibilidad de crecimiento",
        estado: "ACTIVO",
      },
    });

    console.log("✅ 3 trabajos de ejemplo creados");
  } else {
    console.log("⚠️  No se pudieron crear trabajos de ejemplo (faltan datos)");
  }

  console.log("\n🎉 Seed completado exitosamente!\n");
  console.log("📋 Usuarios creados:");
  console.log("   - Admin: admin@trabajolocal.com (contraseña: admin123)");
  console.log(
    "   - Empleador: empleador@ejemplo.com (contraseña: empleador123)",
  );
  console.log("   - Empleado: empleado@ejemplo.com (contraseña: empleado123)");
  console.log("\n💼 3 trabajos de ejemplo creados en Capital y Rawson");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
