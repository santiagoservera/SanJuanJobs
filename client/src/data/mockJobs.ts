import type { Job } from "@/components/JobCard";

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Vendedor/a para Vinoteca",
    company: "Viñas del Sol",
    location: "Capital, San Juan",
    type: "full-time",
    salary: "$350.000 - $450.000",
    postedAt: "Hace 2 horas",
    description:
      "Buscamos vendedor/a con experiencia en atención al cliente para nuestra vinoteca en el centro de San Juan. Valoramos conocimientos en vinos regionales.",
    tags: ["Ventas", "Atención al Cliente", "Vinos"],
    featured: true,
  },
  {
    id: "2",
    title: "Electricista Industrial",
    company: "Metalúrgica San Juan",
    location: "Rawson, San Juan",
    type: "full-time",
    salary: "$500.000 - $650.000",
    postedAt: "Hace 5 horas",
    description:
      "Empresa metalúrgica busca electricista industrial con experiencia en mantenimiento de maquinaria pesada. Matrícula al día requerida.",
    tags: ["Electricidad", "Industrial", "Mantenimiento"],
    featured: true,
  },
  {
    id: "3",
    title: "Pasante de Marketing Digital",
    company: "Agencia Creativa SJ",
    location: "Capital, San Juan",
    type: "pasantia",
    salary: "$150.000",
    postedAt: "Hace 1 día",
    description:
      "Pasantía para estudiantes de Marketing o Comunicación. Aprenderás sobre redes sociales, campañas digitales y diseño gráfico básico.",
    tags: ["Marketing", "Redes Sociales", "Pasantía"],
  },
  {
    id: "4",
    title: "Mozo/a para Restaurante",
    company: "La Parrilla del Valle",
    location: "Pocito, San Juan",
    type: "part-time",
    salary: "$200.000",
    postedAt: "Hace 1 día",
    description:
      "Restaurante familiar busca mozo/a para fines de semana. Experiencia previa valorada pero no excluyente. Ambiente de trabajo agradable.",
    tags: ["Gastronomía", "Atención", "Fin de Semana"],
  },
  {
    id: "5",
    title: "Cosechador/a de Uvas",
    company: "Bodega Valle Fértil",
    location: "Caucete, San Juan",
    type: "temporal",
    salary: "A convenir",
    postedAt: "Hace 2 días",
    description:
      "Trabajo temporal durante la temporada de cosecha (febrero-marzo). Se ofrece transporte desde Capital. Experiencia previa es un plus.",
    tags: ["Agricultura", "Temporal", "Campo"],
  },
  {
    id: "6",
    title: "Recepcionista de Hotel",
    company: "Hotel Montaña Andina",
    location: "Capital, San Juan",
    type: "full-time",
    salary: "$380.000 - $420.000",
    postedAt: "Hace 2 días",
    description:
      "Hotel 4 estrellas busca recepcionista con inglés intermedio. Turnos rotativos. Excelente presencia y trato con el público.",
    tags: ["Hotelería", "Recepción", "Inglés"],
  },
  {
    id: "7",
    title: "Mecánico Automotriz",
    company: "Taller Los Andes",
    location: "Rivadavia, San Juan",
    type: "full-time",
    salary: "$450.000 - $550.000",
    postedAt: "Hace 3 días",
    description:
      "Taller mecánico busca mecánico con experiencia en inyección electrónica y diagnóstico computarizado. Herramientas propias es un plus.",
    tags: ["Mecánica", "Automotriz", "Diagnóstico"],
  },
  {
    id: "8",
    title: "Asistente Administrativo/a",
    company: "Constructora del Oeste",
    location: "Capital, San Juan",
    type: "full-time",
    salary: "$320.000 - $380.000",
    postedAt: "Hace 3 días",
    description:
      "Buscamos asistente administrativo/a con manejo de Excel avanzado, facturación y atención a proveedores. Lunes a viernes.",
    tags: ["Administración", "Excel", "Facturación"],
  },
];

export const jobCategories = [
  { name: "Gastronomía", count: 45, icon: "🍷" },
  { name: "Comercio", count: 38, icon: "🛒" },
  { name: "Agricultura", count: 32, icon: "🍇" },
  { name: "Construcción", count: 28, icon: "🏗️" },
  { name: "Turismo", count: 24, icon: "🏔️" },
  { name: "Oficios", count: 21, icon: "🔧" },
  { name: "Administración", count: 19, icon: "📋" },
  { name: "Tecnología", count: 15, icon: "💻" },
];
