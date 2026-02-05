import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Briefcase,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { usePostulacionesRecibidas } from "@/modules/postulaciones/hooks/usePostulaciones";
import { useState } from "react";

const PostulacionesEmpleador = () => {
  const { data: postulacionesData, isLoading } = usePostulacionesRecibidas();
  const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");
  const [filtroTrabajo, setFiltroTrabajo] = useState<string>("TODOS");

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const postulaciones = postulacionesData?.postulaciones || [];

  // Obtener lista única de trabajos
  const trabajosUnicos = Array.from(
    new Set(postulaciones.map((p) => p.trabajo.titulo))
  );

  // Filtrar postulaciones
  const postulacionesFiltradas = postulaciones.filter((p) => {
    const cumpleEstado = filtroEstado === "TODOS" || p.estado === filtroEstado;
    const cumpleTrabajo =
      filtroTrabajo === "TODOS" || p.trabajo.titulo === filtroTrabajo;
    return cumpleEstado && cumpleTrabajo;
  });

  const estadisticas = {
    total: postulaciones.length,
    pendientes: postulaciones.filter((p) => p.estado === "PENDIENTE").length,
    revisadas: postulaciones.filter((p) => p.estado === "REVISADA").length,
    aceptadas: postulaciones.filter((p) => p.estado === "ACEPTADA").length,
    rechazadas: postulaciones.filter((p) => p.estado === "RECHAZADA").length,
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return <Badge variant="secondary">Pendiente</Badge>;
      case "REVISADA":
        return <Badge variant="default">Revisada</Badge>;
      case "ACEPTADA":
        return <Badge variant="gold">Aceptada</Badge>;
      case "RECHAZADA":
        return <Badge variant="wine">Rechazada</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Postulaciones Recibidas
          </h1>
          <p className="text-muted-foreground">
            Gestioná las postulaciones a tus trabajos publicados
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {estadisticas.total}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {estadisticas.pendientes}
              </div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {estadisticas.revisadas}
              </div>
              <div className="text-sm text-muted-foreground">Revisadas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gold">
                {estadisticas.aceptadas}
              </div>
              <div className="text-sm text-muted-foreground">Aceptadas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-wine">
                {estadisticas.rechazadas}
              </div>
              <div className="text-sm text-muted-foreground">Rechazadas</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Filtrar por estado
                </label>
                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todos</SelectItem>
                    <SelectItem value="PENDIENTE">Pendientes</SelectItem>
                    <SelectItem value="REVISADA">Revisadas</SelectItem>
                    <SelectItem value="ACEPTADA">Aceptadas</SelectItem>
                    <SelectItem value="RECHAZADA">Rechazadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Filtrar por trabajo
                </label>
                <Select value={filtroTrabajo} onValueChange={setFiltroTrabajo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todos los trabajos</SelectItem>
                    {trabajosUnicos.map((titulo) => (
                      <SelectItem key={titulo} value={titulo}>
                        {titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {postulacionesFiltradas.length} postulación
                  {postulacionesFiltradas.length !== 1 ? "es" : ""}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de postulaciones */}
        {postulacionesFiltradas.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No hay postulaciones
              </h3>
              <p className="text-muted-foreground mb-6">
                {filtroEstado !== "TODOS" || filtroTrabajo !== "TODOS"
                  ? "No hay postulaciones que coincidan con los filtros seleccionados"
                  : "Aún no recibiste postulaciones a tus trabajos"}
              </p>
              {postulaciones.length === 0 && (
                <Button variant="hero" asChild>
                  <Link to="/dashboard/empleador/crear-trabajo">
                    Publicar Trabajo
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {postulacionesFiltradas.map((postulacion) => (
              <Card
                key={postulacion.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-primary-foreground font-display font-bold text-xl">
                        {postulacion.empleado.perfilEmpleado?.nombre?.charAt(
                          0
                        ) || "U"}
                      </span>
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      {/* Cabecera */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                            {postulacion.empleado.perfilEmpleado?.nombre}{" "}
                            {postulacion.empleado.perfilEmpleado?.apellido}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Briefcase className="w-4 h-4" />
                            <span>
                              Postulado a: {postulacion.trabajo.titulo}
                            </span>
                          </div>
                        </div>
                        {getEstadoBadge(postulacion.estado)}
                      </div>

                      {/* Información de contacto */}
                      <div className="grid md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span>{postulacion.empleado.email}</span>
                        </div>
                        {postulacion.empleado.perfilEmpleado?.telefono && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>
                              {postulacion.empleado.perfilEmpleado.telefono}
                            </span>
                          </div>
                        )}
                        {postulacion.empleado.perfilEmpleado?.domicilio && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {postulacion.empleado.perfilEmpleado.domicilio}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatearFecha(postulacion.fechaPostulacion)}
                          </span>
                        </div>
                      </div>

                      {/* Carta de presentación */}
                      {postulacion.cartaPresentacion && (
                        <div className="mb-4 p-4 bg-secondary rounded-lg">
                          <div className="flex items-start gap-2 mb-2">
                            <FileText className="w-4 h-4 text-primary mt-0.5" />
                            <span className="text-sm font-medium text-foreground">
                              Carta de presentación:
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {postulacion.cartaPresentacion}
                          </p>
                        </div>
                      )}

                      {/* Experiencia y educación */}
                      {(postulacion.empleado.perfilEmpleado?.experiencia ||
                        postulacion.empleado.perfilEmpleado?.educacion) && (
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          {postulacion.empleado.perfilEmpleado.experiencia && (
                            <div>
                              <h4 className="text-sm font-medium text-foreground mb-1">
                                Experiencia:
                              </h4>
                              <p className="text-sm text-muted-foreground whitespace-pre-line">
                                {
                                  postulacion.empleado.perfilEmpleado
                                    .experiencia
                                }
                              </p>
                            </div>
                          )}
                          {postulacion.empleado.perfilEmpleado.educacion && (
                            <div>
                              <h4 className="text-sm font-medium text-foreground mb-1">
                                Educación:
                              </h4>
                              <p className="text-sm text-muted-foreground whitespace-pre-line">
                                {postulacion.empleado.perfilEmpleado.educacion}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Botones de acción */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="default" size="sm" asChild>
                          <Link to={`/empleo/${postulacion.trabajo.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Publicación
                          </Link>
                        </Button>
                        {/* TODO: Agregar botones de Aceptar/Rechazar cuando implementes el endpoint */}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PostulacionesEmpleador;
