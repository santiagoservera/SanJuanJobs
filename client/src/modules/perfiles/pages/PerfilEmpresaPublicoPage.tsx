import { Navbar } from "@/shared/components/layout/Navbar";
import { Footer } from "@/shared/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Building2,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Users,
  ArrowLeft,
  Loader2,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { usePerfilEmpleadorPublico } from "@/modules/perfiles/hooks/usePerfiles";

const PerfilEmpresaPublico = () => {
  const { empleadorId } = useParams();
  const { data: perfil, isLoading } = usePerfilEmpleadorPublico(
    parseInt(empleadorId || "0")
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">
            Empresa no encontrada
          </h1>
          <Button variant="hero" asChild>
            <Link to="/empleos">Ver todos los empleos</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            to="/empleos"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a empleos
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                      <span className="text-primary-foreground font-display font-bold text-2xl sm:text-3xl md:text-4xl">
                        {perfil.perfilEmpleador?.nombreEmpresa?.charAt(0) ||
                          "E"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
                        {perfil.perfilEmpleador?.nombreEmpresa || "Empresa"}
                      </h1>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="gold" className="text-xs sm:text-sm">
                          {perfil.estadisticas.trabajosActivos} trabajos activos
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs sm:text-sm"
                        >
                          {perfil.estadisticas.totalTrabajos} publicaciones
                          totales
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  {perfil.perfilEmpleador?.descripcionEmpresa && (
                    <div className="mb-6 pb-6 border-b border-border">
                      <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-3">
                        Sobre la empresa
                      </h2>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {perfil.perfilEmpleador.descripcionEmpresa}
                      </p>
                    </div>
                  )}

                  {/* Información de contacto */}
                  <div>
                    <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-4">
                      Información de contacto
                    </h2>
                    <div className="space-y-3">
                      {perfil.perfilEmpleador?.emailContacto && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Email
                            </p>
                            <a
                              href={`mailto:${perfil.perfilEmpleador.emailContacto}`}
                              className="text-sm sm:text-base text-foreground hover:text-primary transition-colors break-all"
                            >
                              {perfil.perfilEmpleador.emailContacto}
                            </a>
                          </div>
                        </div>
                      )}

                      {perfil.perfilEmpleador?.telefonoContacto && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Teléfono
                            </p>
                            <a
                              href={`tel:${perfil.perfilEmpleador.telefonoContacto}`}
                              className="text-sm sm:text-base text-foreground hover:text-primary transition-colors"
                            >
                              {perfil.perfilEmpleador.telefonoContacto}
                            </a>
                          </div>
                        </div>
                      )}

                      {perfil.perfilEmpleador?.sitioWeb && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Sitio web
                            </p>
                            <a
                              href={perfil.perfilEmpleador.sitioWeb}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm sm:text-base text-foreground hover:text-primary transition-colors inline-flex items-center gap-1 break-all"
                            >
                              {perfil.perfilEmpleador.sitioWeb}
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trabajos activos */}
              <Card>
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
                    Trabajos activos ({perfil.trabajos.length})
                  </h2>

                  {perfil.trabajos.length === 0 ? (
                    <div className="text-center py-6 sm:py-8">
                      <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm sm:text-base text-muted-foreground">
                        No hay trabajos activos en este momento
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {perfil.trabajos.map((trabajo: any) => (
                        <Link
                          key={trabajo.id}
                          to={`/empleo/${trabajo.id}`}
                          className="block"
                        >
                          <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-border hover:bg-secondary/50 hover:border-primary/50 transition-all">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary flex items-center justify-center shrink-0">
                              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="text-sm sm:text-base font-semibold text-foreground line-clamp-2">
                                  {trabajo.titulo}
                                </h3>
                                <Badge
                                  variant={
                                    trabajo.tipoTrabajo.slug ===
                                    "tiempo-completo"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="text-xs shrink-0"
                                >
                                  {trabajo.tipoTrabajo.nombre}
                                </Badge>
                              </div>

                              <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mb-2">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="truncate">
                                    {trabajo.ubicacion}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span>
                                    {trabajo._count.postulaciones} postulaciones
                                  </span>
                                </div>
                                <div className="hidden sm:flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {formatearFecha(trabajo.fechaCreacion)}
                                  </span>
                                </div>
                              </div>

                              <Badge variant="secondary" className="text-xs">
                                {trabajo.categoria.nombre}
                              </Badge>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Estadísticas */}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-display text-base sm:text-lg font-semibold text-foreground mb-4">
                    Estadísticas
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Trabajos Activos
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-foreground">
                          {perfil.estadisticas.trabajosActivos}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Total Publicaciones
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-foreground">
                          {perfil.estadisticas.totalTrabajos}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-primary-foreground/80" />
                  <h3 className="font-display text-base sm:text-lg font-semibold mb-2">
                    ¿Te interesa trabajar aquí?
                  </h3>
                  <p className="text-xs sm:text-sm text-primary-foreground/80 mb-4">
                    Explorá las oportunidades laborales que ofrece esta empresa
                  </p>
                  <Button variant="gold" className="w-full" asChild>
                    <Link to="/empleos">Ver todos los empleos</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PerfilEmpresaPublico;
