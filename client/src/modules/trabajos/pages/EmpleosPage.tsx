import { Navbar } from "@/shared/components/layout/Navbar";
import { Footer } from "@/shared/components/layout/Footer";
import { SearchBar } from "@/components/SearchBar";
import { JobCard, type Job } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X, Loader2, MapPin } from "lucide-react";
import { useTrabajos } from "@/modules/trabajos/hooks/useTrabajos";
import { useCategorias } from "@/modules/categorias/hooks/useCategorias";
import { useDepartamentos } from "@/modules/departamentos/hooks/useDepartamentos";
import { CategoryIcon, getCategoryIcon } from "@/lib/categoryIcons";

// Tipos de trabajo
const jobTypes = [
  { value: "", label: "Todos" },
  { value: "tiempo-completo", label: "Tiempo Completo" },
  { value: "medio-tiempo", label: "Medio Tiempo" },
  { value: "temporal", label: "Temporal" },
  { value: "pasantia", label: "Pasantía" },
];

const Empleos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // Obtener parámetros de la URL
  const tipoSlug = searchParams.get("tipo") || "";
  const categoriaSlug = searchParams.get("categoria") || "";
  const departamentoSlug = searchParams.get("departamento") || "";
  const busqueda = searchParams.get("busqueda") || "";
  const ubicacion = searchParams.get("ubicacion") || "";

  // Obtener categorías y departamentos
  const { data: categorias, isLoading: isLoadingCategorias } = useCategorias();
  const { data: departamentos, isLoading: isLoadingDepartamentos } =
    useDepartamentos(true);

  // Convertir slugs a IDs
  const categoriaId = categorias?.find((c) => c.slug === categoriaSlug)?.id;
  const departamentoId = departamentos?.find(
    (d) => d.slug === departamentoSlug,
  )?.id;

  // Obtener trabajos con filtros
  const { data: trabajosData, isLoading: isLoadingTrabajos } = useTrabajos({
    categoriaId,
    departamentoId,
    busqueda: busqueda || undefined,
    ubicacion: ubicacion || undefined,
    estado: "ACTIVO",
    limite: 50,
  });

  // Filtrar por tipo en el cliente
  const trabajosFiltrados =
    trabajosData?.trabajos.filter((trabajo) => {
      if (!tipoSlug) return true;
      return trabajo.tipoTrabajo.slug === tipoSlug;
    }) || [];

  const handleTypeChange = (slug: string) => {
    if (slug) {
      searchParams.set("tipo", slug);
    } else {
      searchParams.delete("tipo");
    }
    setSearchParams(searchParams);
  };

  const handleCategoryChange = (slug: string | null) => {
    if (slug) {
      searchParams.set("categoria", slug);
    } else {
      searchParams.delete("categoria");
    }
    setSearchParams(searchParams);
  };

  const handleDepartamentoChange = (slug: string | null) => {
    if (slug) {
      searchParams.set("departamento", slug);
    } else {
      searchParams.delete("departamento");
    }
    setSearchParams(searchParams);
  };

  const handleSearch = (query: string, location: string) => {
    if (query) searchParams.set("busqueda", query);
    else searchParams.delete("busqueda");

    if (location) searchParams.set("ubicacion", location);
    else searchParams.delete("ubicacion");

    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters =
    tipoSlug || categoriaSlug || departamentoSlug || busqueda || ubicacion;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-8 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Encontrá tu empleo ideal en San Juan
            </h1>
            <p className="text-muted-foreground">
              {isLoadingTrabajos
                ? "Cargando empleos..."
                : `${trabajosFiltrados.length} oportunidades disponibles`}
            </p>
          </div>
          <SearchBar
            className="max-w-4xl mx-auto"
            onSearch={handleSearch}
            initialQuery={busqueda}
            initialLocation={ubicacion}
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 shrink-0">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  {/* Departamentos */}
                  <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Departamento
                  </h3>
                  {isLoadingDepartamentos ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      <button
                        onClick={() => handleDepartamentoChange(null)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          !departamentoSlug
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        Todos
                      </button>
                      {departamentos?.map((depto) => (
                        <button
                          key={depto.slug}
                          onClick={() =>
                            handleDepartamentoChange(
                              departamentoSlug === depto.slug
                                ? null
                                : depto.slug,
                            )
                          }
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                            departamentoSlug === depto.slug
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-secondary"
                          }`}
                        >
                          <span>{depto.nombre}</span>
                          <span className="text-xs opacity-70">
                            {depto._count?.trabajos || 0}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-border my-6" />

                  {/* Tipo de Empleo */}
                  <h3 className="font-display font-semibold text-foreground mb-4">
                    Tipo de Empleo
                  </h3>
                  <div className="space-y-2">
                    {jobTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => handleTypeChange(type.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          tipoSlug === type.value
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-border my-6" />

                  {/* Categorías */}
                  <h3 className="font-display font-semibold text-foreground mb-4">
                    Categorías
                  </h3>
                  {isLoadingCategorias ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {categorias?.map((category) => (
                        <button
                          key={category.slug}
                          onClick={() =>
                            handleCategoryChange(
                              categoriaSlug === category.slug
                                ? null
                                : category.slug,
                            )
                          }
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                            categoriaSlug === category.slug
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-secondary"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <CategoryIcon
                              slug={category.slug}
                              className="w-4 h-4"
                            />
                            {category.nombre}
                          </span>
                          <span className="text-xs opacity-70">
                            {category._count?.trabajos || 0}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </aside>

            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                </span>
                {hasActiveFilters && (
                  <Badge variant="default" className="ml-2">
                    {
                      [
                        tipoSlug,
                        categoriaSlug,
                        departamentoSlug,
                        busqueda,
                        ubicacion,
                      ].filter(Boolean).length
                    }
                  </Badge>
                )}
              </Button>

              {showFilters && (
                <Card className="mt-4 animate-fade-in">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Filtros</h3>
                      <button onClick={() => setShowFilters(false)}>
                        <X className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>

                    {/* Departamentos - Mobile */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Departamento
                      </h4>
                      {isLoadingDepartamentos ? (
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant={
                              !departamentoSlug ? "default" : "secondary"
                            }
                            className="cursor-pointer"
                            onClick={() => handleDepartamentoChange(null)}
                          >
                            Todos
                          </Badge>
                          {departamentos?.map((depto) => (
                            <Badge
                              key={depto.slug}
                              variant={
                                departamentoSlug === depto.slug
                                  ? "default"
                                  : "secondary"
                              }
                              className="cursor-pointer"
                              onClick={() =>
                                handleDepartamentoChange(
                                  departamentoSlug === depto.slug
                                    ? null
                                    : depto.slug,
                                )
                              }
                            >
                              {depto.nombre}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tipo de Empleo - Mobile */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">
                        Tipo de Empleo
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {jobTypes.map((type) => (
                          <Badge
                            key={type.value}
                            variant={
                              tipoSlug === type.value ? "default" : "secondary"
                            }
                            className="cursor-pointer"
                            onClick={() => handleTypeChange(type.value)}
                          >
                            {type.label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Categorías - Mobile */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Categorías</h4>
                      {isLoadingCategorias ? (
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {categorias?.map((category) => (
                            <Badge
                              key={category.slug}
                              variant={
                                categoriaSlug === category.slug
                                  ? "default"
                                  : "secondary"
                              }
                              className="cursor-pointer"
                              onClick={() =>
                                handleCategoryChange(
                                  categoriaSlug === category.slug
                                    ? null
                                    : category.slug,
                                )
                              }
                            >
                              <CategoryIcon
                                slug={category.slug}
                                className="w-3 h-3 mr-1"
                              />
                              {category.nombre}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Job Listings */}
            <div className="flex-1">
              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-sm text-muted-foreground">
                    Filtros activos:
                  </span>
                  {departamentoSlug && (
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => handleDepartamentoChange(null)}
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      {
                        departamentos?.find((d) => d.slug === departamentoSlug)
                          ?.nombre
                      }
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  {tipoSlug && (
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => handleTypeChange("")}
                    >
                      {jobTypes.find((t) => t.value === tipoSlug)?.label}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  {categoriaSlug && (
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => handleCategoryChange(null)}
                    >
                      {
                        categorias?.find((c) => c.slug === categoriaSlug)
                          ?.nombre
                      }
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  {busqueda && (
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => {
                        searchParams.delete("busqueda");
                        setSearchParams(searchParams);
                      }}
                    >
                      Búsqueda: {busqueda}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  {ubicacion && (
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => {
                        searchParams.delete("ubicacion");
                        setSearchParams(searchParams);
                      }}
                    >
                      Ubicación: {ubicacion}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="ml-auto"
                  >
                    Limpiar todo
                  </Button>
                </div>
              )}

              {isLoadingTrabajos ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : trabajosFiltrados.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {trabajosFiltrados.map((trabajo) => (
                    <JobCard key={trabajo.id} job={mapTrabajoToJob(trabajo)} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      No encontramos empleos con esos filtros.
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Limpiar filtros
                    </Button>
                  </CardContent>
                </Card>
              )}
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
    location: trabajo.departamento?.nombre || trabajo.ubicacion,
    type: mapTipoTrabajoToType(trabajo.tipoTrabajo.slug),
    salary: trabajo.paga
      ? `$${trabajo.paga.toLocaleString("es-AR")}`
      : undefined,
    postedAt,
    description: trabajo.descripcion,
    tags: [trabajo.categoria.nombre, trabajo.tipoTrabajo.nombre],
    featured: false,
  };
}

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

export default Empleos;
