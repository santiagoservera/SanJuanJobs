import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  MapPin,
  Calendar,
  Loader2,
  Trash2,
  ExternalLink,
  Building2,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useMisPostulaciones,
  useEliminarPostulacion,
} from "@/modules/postulaciones/hooks/usePostulaciones";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PostulacionesEmpleado = () => {
  const { data: postulacionesData, isLoading } = useMisPostulaciones();
  const eliminarPostulacion = useEliminarPostulacion();

  const handleEliminar = async (id: number, tituloTrabajo: string) => {
    try {
      await eliminarPostulacion.mutateAsync(id);
      toast.success(`Postulación a "${tituloTrabajo}" eliminada`);
    } catch (error: any) {
      toast.error("Error al eliminar la postulación");
    }
  };

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
            Mis Postulaciones
          </h1>
          <p className="text-muted-foreground">
            Seguí el estado de tus postulaciones a trabajos
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

        {/* Lista de postulaciones */}
        {postulaciones.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Aún no tenés postulaciones
              </h3>
              <p className="text-muted-foreground mb-6">
                Empezá a explorar trabajos disponibles y postulate a los que te
                interesen
              </p>
              <Button variant="hero" asChild>
                <Link to="/empleos">Buscar Empleos</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {postulaciones.map((postulacion) => (
              <Card
                key={postulacion.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                          <span className="text-primary-foreground font-display font-bold text-lg">
                            {postulacion.trabajo.empleador.perfilEmpleador?.nombreEmpresa?.charAt(
                              0
                            ) || "E"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-display text-lg font-semibold text-foreground">
                              {postulacion.trabajo.titulo}
                            </h3>
                            {getEstadoBadge(postulacion.estado)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              <span>
                                {postulacion.trabajo.empleador.perfilEmpleador
                                  ?.nombreEmpresa || "Empresa"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{postulacion.trabajo.ubicacion}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Postulado el{" "}
                              {formatearFecha(postulacion.fechaPostulacion)}
                            </span>
                          </div>
                          {postulacion.fechaRevision && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Revisado el{" "}
                                {formatearFecha(postulacion.fechaRevision)}
                              </span>
                            </div>
                          )}
                          {postulacion.cartaPresentacion && (
                            <div className="mt-3 p-3 bg-secondary rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">
                                  Tu mensaje:
                                </span>{" "}
                                {postulacion.cartaPresentacion}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-1 md:flex-none"
                      >
                        <Link to={`/empleo/${postulacion.trabajo.id}`}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Ver Empleo
                        </Link>
                      </Button>
                      {postulacion.estado !== "ACEPTADA" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 md:flex-none text-red-600 hover:text-red-600 hover:bg-red-50"
                              disabled={eliminarPostulacion.isPending}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Eliminar postulación?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Estás por eliminar tu postulación a "
                                {postulacion.trabajo.titulo}". Esta acción no se
                                puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleEliminar(
                                    postulacion.id,
                                    postulacion.trabajo.titulo
                                  )
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
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

export default PostulacionesEmpleado;
