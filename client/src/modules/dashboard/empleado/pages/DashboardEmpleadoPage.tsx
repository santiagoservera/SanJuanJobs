import { Navbar } from "@/shared/components/layout/Navbar";
import { Footer } from "@/shared/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  Loader2,
  TrendingUp,
  Calendar,
  Building2,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useMisPostulaciones } from "@/modules/postulaciones/hooks/usePostulaciones";
import { useTrabajos } from "@/modules/trabajos/hooks/useTrabajos";
import { useEffect } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";

const DashboardEmpleado = () => {
  const navigate = useNavigate();
  const { isAuthenticated, usuario, perfil, isLoadingPerfil } = useAuth();
  const { data: postulacionesData, isLoading: isLoadingPostulaciones } =
    useMisPostulaciones();
  const { data: trabajosData, isLoading: isLoadingTrabajos } = useTrabajos({
    estado: "ACTIVO",
    limite: 3,
  });

  // Redirigir si no es empleado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (usuario?.rol !== "EMPLEADO") {
      toast.error("No tenés acceso a este dashboard");
      navigate("/");
    }
  }, [isAuthenticated, usuario, navigate]);

  if (isLoadingPerfil || isLoadingPostulaciones || isLoadingTrabajos) {
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

  const postulaciones = postulacionesData?.postulaciones || [];
  const trabajosRecientes = trabajosData?.trabajos || [];

  // Estadísticas
  const estadisticas = {
    total: postulaciones.length,
    pendientes: postulaciones.filter((p) => p.estado === "PENDIENTE").length,
    revisadas: postulaciones.filter((p) => p.estado === "REVISADA").length,
    aceptadas: postulaciones.filter((p) => p.estado === "ACEPTADA").length,
    rechazadas: postulaciones.filter((p) => p.estado === "RECHAZADA").length,
  };

  // Postulaciones recientes (últimas 3)
  const postulacionesRecientes = postulaciones.slice(0, 3);

  // Verificar si el perfil está completo
  const perfilCompleto =
    perfil?.perfilEmpleado?.nombre &&
    perfil?.perfilEmpleado?.apellido &&
    perfil?.perfilEmpleado?.telefono &&
    perfil?.perfilEmpleado?.sobreMi;

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="w-3 h-3" />
            Pendiente
          </Badge>
        );
      case "REVISADA":
        return (
          <Badge variant="default" className="gap-1">
            <Eye className="w-3 h-3" />
            Revisada
          </Badge>
        );
      case "ACEPTADA":
        return (
          <Badge variant="gold" className="gap-1">
            <CheckCircle className="w-3 h-3" />
            Aceptada
          </Badge>
        );
      case "RECHAZADA":
        return (
          <Badge variant="wine" className="gap-1">
            <XCircle className="w-3 h-3" />
            Rechazada
          </Badge>
        );
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            ¡Hola, {perfil?.perfilEmpleado?.nombre || "Usuario"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Este es tu panel de control. Acá podés ver el estado de tus
            postulaciones y encontrar nuevas oportunidades.
          </p>
        </div>

        {/* Alerta de perfil incompleto */}
        {!perfilCompleto && (
          <Card className="mb-8 border-gold bg-gold/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    Completá tu perfil para destacar
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Un perfil completo te ayuda a conseguir mejores
                    oportunidades. Los empleadores prefieren candidatos con
                    información detallada.
                  </p>
                  <Button variant="gold" size="sm" asChild>
                    <Link to="/perfil">Completar Perfil</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Link to="/mis-postulaciones">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {estadisticas.total}
                </div>
                <div className="text-sm text-muted-foreground">Total</div>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {estadisticas.pendientes}
              </div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {estadisticas.revisadas}
              </div>
              <div className="text-sm text-muted-foreground">Revisadas</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-gold" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gold">
                {estadisticas.aceptadas}
              </div>
              <div className="text-sm text-muted-foreground">Aceptadas</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-wine/20 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-wine" />
                </div>
              </div>
              <div className="text-2xl font-bold text-wine">
                {estadisticas.rechazadas}
              </div>
              <div className="text-sm text-muted-foreground">Rechazadas</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Postulaciones Recientes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Mis Postulaciones Recientes</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard/empleado/postulaciones">
                    Ver todas
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {postulacionesRecientes.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">
                      Aún no tenés postulaciones
                    </p>
                    <Button variant="hero" asChild>
                      <Link to="/empleos">Buscar Empleos</Link>
                    </Button>
                  </div>
                ) : (
                  postulacionesRecientes.map((postulacion) => (
                    <div
                      key={postulacion.id}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shrink-0">
                        <span className="text-primary-foreground font-bold">
                          {postulacion.trabajo.empleador.perfilEmpleador?.nombreEmpresa?.charAt(
                            0
                          ) || "E"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Link
                            to={`/empleo/${postulacion.trabajo.id}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {postulacion.trabajo.titulo}
                          </Link>
                          {getEstadoBadge(postulacion.estado)}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            <span className="line-clamp-1">
                              {postulacion.trabajo.empleador.perfilEmpleador
                                ?.nombreEmpresa || "Empresa"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{postulacion.trabajo.ubicacion}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Postulado el{" "}
                            {formatearFecha(postulacion.fechaPostulacion)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Trabajos Recomendados */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Trabajos Recientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trabajosRecientes.map((trabajo) => (
                  <Link
                    key={trabajo.id}
                    to={`/empleo/${trabajo.id}`}
                    className="block p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                  >
                    <h4 className="font-semibold text-foreground mb-1 line-clamp-1">
                      {trabajo.titulo}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Building2 className="w-3 h-3" />
                      <span className="line-clamp-1">
                        {trabajo.empleador.perfilEmpleador?.nombreEmpresa ||
                          "Empresa"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{trabajo.ubicacion}</span>
                    </div>
                  </Link>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/empleos">
                    Ver Todos los Empleos
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardEmpleado;
