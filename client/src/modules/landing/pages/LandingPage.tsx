import { Navbar } from "@/shared/components/layout/Navbar";
import { Footer } from "@/shared/components/layout/Footer";
import { SearchBar } from "@/components/SearchBar";
import { JobCard, type Job } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Users,
  Building2,
  Briefcase,
  Shield,
  Mountain,
  Grape,
  Loader2,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useCategorias } from "@/modules/categorias/hooks/useCategorias";
import { useTrabajos } from "@/modules/trabajos/hooks/useTrabajos";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Obtener categorías desde el backend
  const { data: categorias, isLoading: isLoadingCategorias } = useCategorias();

  // Obtener trabajos activos (primeros 6 para featured/recent)
  const { data: trabajosData, isLoading: isLoadingTrabajos } = useTrabajos({
    estado: "ACTIVO",
    limite: 6,
  });

  // Separar trabajos destacados y recientes
  const featuredJobs = trabajosData?.trabajos.slice(0, 2) || [];
  const recentJobs = trabajosData?.trabajos.slice(2, 6) || [];

  // Manejar búsqueda
  const handleSearch = (query: string, location: string) => {
    setSearchQuery(query);
    setSearchLocation(location);

    // Navegar a la página de empleos con los filtros
    const params = new URLSearchParams();
    if (query) params.append("busqueda", query);
    if (location) params.append("ubicacion", location);

    navigate(`/empleos?${params.toString()}`);
  };

  // Mapear categorías al formato que espera el componente
  const mappedCategories =
    categorias?.map((cat) => ({
      name: cat.nombre,
      count: cat._count?.trabajos || 0,
      icon: getCategoryIcon(cat.slug),
      slug: cat.slug,
    })) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-background" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 opacity-10">
          <Mountain className="w-64 h-64 text-primary-foreground" />
        </div>
        <div className="absolute bottom-40 left-20 opacity-10">
          <Grape className="w-48 h-48 text-primary-foreground" />
        </div>

        <div className="container mx-auto px-4 relative z-[5] pt-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge
              variant="gold"
              className="mb-6 animate-fade-up px-4 py-2 text-sm"
            >
              🍇 La plataforma de empleo de San Juan
            </Badge>

            <h1
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              Encontrá tu próximo{" "}
              <span
                className="text-gradient bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, hsl(16 65% 65%), hsl(42 85% 65%))",
                }}
              >
                trabajo
              </span>{" "}
              en San Juan
            </h1>

            <p
              className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              La primera plataforma profesional de búsqueda de empleo enfocada
              100% en nuestra provincia. Sin ruido, sin estafas, solo
              oportunidades reales.
            </p>

            <div
              className="animate-fade-up relative z-[9999]"
              style={{ animationDelay: "0.3s" }}
            >
              <SearchBar onSearch={handleSearch} />
            </div>

            <div
              className="flex flex-wrap justify-center gap-4 mt-8 animate-fade-up relative z-1"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <Briefcase className="w-4 h-4" />
                <span>{trabajosData?.total || 0} empleos activos</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <Building2 className="w-4 h-4" />
                <span>+200 empresas locales</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <Users className="w-4 h-4" />
                <span>+5.000 sanjuaninos conectados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explorá por categoría
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Desde viñedos hasta oficinas, encontrá el trabajo que mejor se
              adapte a vos
            </p>
          </div>

          {isLoadingCategorias ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mappedCategories.map((category, index) => (
                <Link
                  key={category.slug}
                  to={`/empleos?categoriaSlug=${category.slug}`}
                >
                  <Card
                    className="group cursor-pointer hover:scale-[1.02] transition-all duration-300 animate-fade-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="p-6 text-center">
                      <span className="text-4xl mb-3 block">
                        {category.icon}
                      </span>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.count} empleos
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Empleos Destacados
              </h2>
              <p className="text-muted-foreground">
                Las mejores oportunidades de la semana
              </p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link to="/empleos">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {isLoadingTrabajos ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {featuredJobs.map((trabajo) => (
                <JobCard key={trabajo.id} job={mapTrabajoToJob(trabajo)} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Button variant="hero" asChild>
              <Link to="/empleos">
                Ver todos los empleos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Publicados Recientemente
              </h2>
              <p className="text-muted-foreground">
                Las últimas oportunidades en San Juan
              </p>
            </div>
          </div>

          {isLoadingTrabajos ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentJobs.map((trabajo) => (
                <JobCard key={trabajo.id} job={mapTrabajoToJob(trabajo)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 bg-foreground text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              ¿Por qué SanJuanJobs?
            </h2>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto">
              Nacimos de la necesidad de ordenar la búsqueda de empleo en San
              Juan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                Basta de grupos de Facebook
              </h3>
              <p className="text-primary-foreground/70">
                La búsqueda laboral en San Juan está dispersa en grupos que no
                fueron pensados para eso. Acá, el empleo tiene su propio lugar.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mx-auto mb-4">
                <Grape className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                El portal de empleo de San Juan
              </h3>
              <p className="text-primary-foreground/70">
                No había una plataforma pensada exclusivamente para el mercado
                laboral sanjuanino. SanJuanJobs nace para cubrir esa necesidad.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-wine/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-wine" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                Orden, claridad y confianza
              </h3>
              <p className="text-primary-foreground/70">
                Ofertas reales, empresas visibles y procesos claros. Sin avisos
                perdidos, sin mensajes privados dudosos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
              ¿Tenés una empresa en San Juan?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Publicá tus búsquedas y encontrá el talento local que necesitás.
              La primera publicación es gratis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gold" size="xl" asChild>
                <Link to="/registro">
                  Publicar Gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="heroOutline"
                size="xl"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link to="/empresas">Conocer más</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// ============================================================================
// Funciones auxiliares
// ============================================================================

/**
 * Mapear trabajo del backend al formato que espera JobCard
 */
function mapTrabajoToJob(trabajo: any): Job {
  const timeDiff = Date.now() - new Date(trabajo.fechaCreacion).getTime();
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  let postedAt = "";
  if (hours < 24) {
    postedAt =
      hours === 0
        ? "Hace menos de 1 hora"
        : `Hace ${hours} hora${hours > 1 ? "s" : ""}`;
  } else {
    postedAt = `Hace ${days} día${days > 1 ? "s" : ""}`;
  }

  return {
    id: trabajo.id.toString(),
    title: trabajo.titulo,
    company: trabajo.empleador.perfilEmpleador?.nombreEmpresa || "Empresa",
    location: trabajo.ubicacion,
    type: mapTipoTrabajoToType(trabajo.tipoTrabajo.slug),
    salary: trabajo.paga
      ? `$${trabajo.paga.toLocaleString("es-AR")}`
      : undefined,
    postedAt,
    description: trabajo.descripcion,
    tags: [trabajo.categoria.nombre, trabajo.tipoTrabajo.nombre],
    featured: false, // Podrías agregar lógica para destacados
  };
}

/**
 * Mapear tipo de trabajo del backend al formato esperado por JobCard
 */
function mapTipoTrabajoToType(slug: string): Job["type"] {
  const mapping: Record<string, Job["type"]> = {
    "tiempo-completo": "full-time",
    "medio-tiempo": "part-time",
    temporal: "temporal",
    pasantia: "pasantia",
    todos: "full-time",
  };
  return mapping[slug] || "full-time";
}

/**
 * Obtener icono de categoría
 */
function getCategoryIcon(slug: string): string {
  const icons: Record<string, string> = {
    gastronomia: "🍷",
    comercio: "🛒",
    agricultura: "🍇",
    construccion: "🏗️",
    turismo: "🏔️",
    oficios: "🔧",
  };
  return icons[slug] || "📋";
}

export default Index;
