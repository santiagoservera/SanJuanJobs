import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Plus,
  TrendingUp,
  Clock,
  Loader2,
  MapPin,
  Edit,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import {
  useMisTrabajos,
  useEstadisticasTrabajos,
} from "@/modules/trabajos/hooks/useTrabajos";
import { usePostulacionesRecibidas } from "@/modules/postulaciones/hooks/usePostulaciones";
import { PostulacionesSheet } from "@/modules/postulaciones/components/PostulacionesSheet";

const DashboardEmpleador = () => {
  const { perfil, isLoadingPerfil } = useAuth();
  const { data: trabajos, isLoading: isLoadingTrabajos } = useMisTrabajos();
  const { data: estadisticas, isLoading: isLoadingEstadisticas } =
    useEstadisticasTrabajos();
  const { data: postulacionesData, isLoading: isLoadingPostulaciones } =
    usePostulacionesRecibidas();

  // Estado para el Sheet de postulaciones
  const [sheetOpen, setSheetOpen] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState<{
    id: number;
    titulo: string;
  } | null>(null);

  const handleVerPostulaciones = (trabajo: { id: number; titulo: string }) => {
    setTrabajoSeleccionado(trabajo);
    setSheetOpen(true);
  };

  if (
    isLoadingPerfil ||
    isLoadingTrabajos ||
    isLoadingEstadisticas ||
    isLoadingPostulaciones
  ) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const trabajosRecientes = trabajos?.slice(0, 5) || [];
  const postulaciones = postulacionesData?.postulaciones || [];
  const postulacionesRecientes = postulaciones.slice(0, 5);

  const perfilCompleto =
    perfil?.perfilEmpleador?.nombreEmpresa &&
    perfil?.perfilEmpleador?.descripcionEmpresa &&
    perfil?.perfilEmpleador?.emailContacto;

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    const ahora = new Date();
    const diff = ahora.getTime() - date.getTime();
    const horas = Math.floor(diff / (1000 * 60 * 60));

    if (horas < 1) return "Hace menos de 1 hora";
    if (horas < 24) return `Hace ${horas} hora${horas > 1 ? "s" : ""}`;

    const dias = Math.floor(horas / 24);
    return `Hace ${dias} día${dias > 1 ? "s" : ""}`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header - Responsive */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            ¡Hola, {perfil?.perfilEmpleador?.nombreEmpresa || "Empresa"}! 👋
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Administrá tus publicaciones y gestioná las postulaciones recibidas.
          </p>
        </div>

        {/* Alerta de perfil incompleto - Responsive */}
        {!perfilCompleto && (
          <Card className="mb-6 sm:mb-8 border-gold bg-gold/5">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">
                    Completá el perfil de tu empresa
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                    Un perfil completo genera más confianza en los candidatos y
                    aumenta la calidad de las postulaciones.
                  </p>
                  <Button variant="gold" size="sm" asChild>
                    <Link to="/dashboard/empleador/perfil">
                      Completar Perfil
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA Publicar Trabajo - Responsive */}
        <Card className="mb-6 sm:mb-8 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-display text-lg sm:text-xl font-bold mb-2">
                  ¿Buscás nuevos talentos?
                </h3>
                <p className="text-sm sm:text-base text-primary-foreground/80 mb-4">
                  Publicá una oferta de trabajo y empezá a recibir postulaciones
                  de candidatos calificados de San Juan.
                </p>
                <Button
                  variant="gold"
                  size="sm"
                  asChild
                  className="w-full sm:w-auto sm:px-6 sm:py-3"
                >
                  <Link to="/dashboard/empleador/crear-trabajo">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Publicar Trabajo
                  </Link>
                </Button>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-primary-foreground/10 flex items-center justify-center">
                  <Briefcase className="w-12 h-12 lg:w-16 lg:h-16 text-primary-foreground/50" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link to="/dashboard/empleador/trabajos" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-foreground">
                  {estadisticas?.trabajosActivos || 0}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Trabajos Activos
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/empleador/postulaciones" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-foreground">
                  {estadisticas?.totalPostulaciones || 0}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Postulaciones
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="h-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {estadisticas?.postulacionesPendientes || 0}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Pendientes
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {estadisticas?.postulacionesRevisadas || 0}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Revisadas
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gold">
                {estadisticas?.postulacionesAceptadas || 0}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Aceptadas
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-wine/20 flex items-center justify-center">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-wine" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-wine">
                {estadisticas?.postulacionesRechazadas || 0}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Rechazadas
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenido principal - Responsive */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Trabajos Publicados */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">
                  Mis Publicaciones
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-xs sm:text-sm"
                >
                  <Link to="/dashboard/empleador/trabajos">Ver todas</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                {trabajosRecientes.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm sm:text-base text-muted-foreground mb-4">
                      Aún no tenés trabajos publicados
                    </p>
                    <Button variant="hero" asChild className="w-full sm:w-auto">
                      <Link to="/dashboard/empleador/crear-trabajo">
                        <Plus className="w-4 h-4 mr-2" />
                        Publicar Trabajo
                      </Link>
                    </Button>
                  </div>
                ) : (
                  trabajosRecientes.map((trabajo) => (
                    <div
                      key={trabajo.id}
                      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm sm:text-base font-semibold text-foreground line-clamp-1">
                            {trabajo.titulo}
                          </h4>
                          <Badge
                            variant={
                              trabajo.estado === "ACTIVO" ? "gold" : "secondary"
                            }
                            className="text-xs shrink-0"
                          >
                            {trabajo.estado === "ACTIVO" ? "Activo" : "Cerrado"}
                          </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">
                              {trabajo.departamento?.nombre ||
                                trabajo.ubicacion}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>
                              {trabajo._count?.postulaciones || 0} postulaciones
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="text-xs w-full sm:w-auto"
                          >
                            <Link
                              to={`/dashboard/empleador/editar-trabajo/${trabajo.id}`}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Editar
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs w-full sm:w-auto"
                            onClick={() =>
                              handleVerPostulaciones({
                                id: trabajo.id,
                                titulo: trabajo.titulo,
                              })
                            }
                          >
                            <Users className="w-3 h-3 mr-1" />
                            Ver Postulaciones
                            {(trabajo._count?.postulaciones || 0) > 0 && (
                              <Badge
                                variant="secondary"
                                className="ml-1 px-1.5 py-0 text-xs"
                              >
                                {trabajo._count?.postulaciones}
                              </Badge>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">
                  Postulaciones Recientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                {postulacionesRecientes.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <Users className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      No hay postulaciones recientes
                    </p>
                  </div>
                ) : (
                  <>
                    {postulacionesRecientes.map((postulacion) => (
                      <div
                        key={postulacion.id}
                        className="p-3 sm:p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <span className="text-primary-foreground font-bold text-xs sm:text-sm">
                              {postulacion.empleado.perfilEmpleado?.nombre?.charAt(
                                0,
                              ) || "U"}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-xs sm:text-sm text-foreground line-clamp-1">
                              {postulacion.empleado.perfilEmpleado?.nombre}{" "}
                              {postulacion.empleado.perfilEmpleado?.apellido}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {postulacion.trabajo.titulo}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatearFecha(postulacion.fechaPostulacion)}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            Pendiente
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full"
                      size="sm"
                      asChild
                    >
                      <Link to="/dashboard/empleador/postulaciones">
                        Ver Todas
                      </Link>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Tips para Empleadores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6 pt-0">
                <div className="flex gap-2 sm:gap-3">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Respondé rápido a las postulaciones para no perder buenos
                    candidatos
                  </p>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Completá toda la información del trabajo para atraer mejores
                    postulantes
                  </p>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Mantené tu perfil actualizado con información de contacto
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sheet de Postulaciones */}
      <PostulacionesSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        trabajo={trabajoSeleccionado}
      />
    </DashboardLayout>
  );
};

export default DashboardEmpleador;
