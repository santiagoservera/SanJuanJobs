import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Plus,
  Loader2,
  MapPin,
  Users,
  Edit,
  Trash2,
  Eye,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useMisTrabajos,
  useEliminarTrabajo,
} from "@/modules/trabajos/hooks/useTrabajos";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { PostulacionesSheet } from "@/modules/postulaciones/components/PostulacionesSheet";

const TrabajosEmpleador = () => {
  const { data: trabajos, isLoading } = useMisTrabajos();
  const eliminarTrabajo = useEliminarTrabajo();
  const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");

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

  const handleEliminar = async (id: number) => {
    try {
      await eliminarTrabajo.mutateAsync(id);
    } catch (error) {
      // El error ya se maneja en el hook
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

  const trabajosFiltrados =
    filtroEstado === "TODOS"
      ? trabajos || []
      : trabajos?.filter((t) => t.estado === filtroEstado) || [];

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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Mis Trabajos Publicados
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Administrá todas tus ofertas de trabajo
            </p>
          </div>
          <Button variant="hero" asChild className="w-full sm:w-auto">
            <Link to="/dashboard/empleador/crear-trabajo">
              <Plus className="w-4 h-4 mr-2" />
              Publicar Trabajo
            </Link>
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Filtrar por estado:
              </span>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos</SelectItem>
                  <SelectItem value="ACTIVO">Activos</SelectItem>
                  <SelectItem value="CERRADO">Cerrados</SelectItem>
                  <SelectItem value="BORRADOR">Borradores</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                {trabajosFiltrados.length} trabajo
                {trabajosFiltrados.length !== 1 ? "s" : ""}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Lista de trabajos */}
        {trabajosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="p-8 sm:p-12 text-center">
              <Briefcase className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-2">
                {filtroEstado === "TODOS"
                  ? "Aún no tenés trabajos publicados"
                  : `No tenés trabajos ${filtroEstado.toLowerCase()}`}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                Publicá tu primera oferta de trabajo para empezar a recibir
                postulaciones
              </p>
              <Button variant="hero" asChild className="w-full sm:w-auto">
                <Link to="/dashboard/empleador/crear-trabajo">
                  <Plus className="w-4 h-4 mr-2" />
                  Publicar Trabajo
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {trabajosFiltrados.map((trabajo) => (
              <Card
                key={trabajo.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Avatar */}
                    <div className="hidden sm:flex w-16 h-16 rounded-xl bg-primary items-center justify-center shrink-0">
                      <Briefcase className="w-8 h-8 text-primary-foreground" />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0 w-full">
                      {/* Cabecera */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="sm:hidden w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
                              <Briefcase className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-1 line-clamp-2">
                                {trabajo.titulo}
                              </h3>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                              <span className="truncate">
                                {trabajo.departamento?.nombre ||
                                  trabajo.ubicacion}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                              <span>
                                {trabajo._count?.postulaciones || 0}{" "}
                                postulaciones
                              </span>
                            </div>
                            <div className="hidden md:flex items-center gap-1">
                              <Calendar className="w-4 h-4 shrink-0" />
                              <span>
                                Publicado el{" "}
                                {formatearFecha(trabajo.fechaCreacion)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Badge
                          variant={
                            trabajo.estado === "ACTIVO"
                              ? "gold"
                              : trabajo.estado === "CERRADO"
                                ? "wine"
                                : "secondary"
                          }
                          className="self-start"
                        >
                          {trabajo.estado === "ACTIVO"
                            ? "Activo"
                            : trabajo.estado === "CERRADO"
                              ? "Cerrado"
                              : "Borrador"}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground text-xs sm:text-sm mb-4 line-clamp-2">
                        {trabajo.descripcion}
                      </p>

                      {/* Botones de acción */}
                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="text-xs sm:text-sm"
                          onClick={() =>
                            handleVerPostulaciones({
                              id: trabajo.id,
                              titulo: trabajo.titulo,
                            })
                          }
                        >
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Ver</span>{" "}
                          Postulaciones
                          {(trabajo._count?.postulaciones || 0) > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-1 px-1.5 py-0 text-xs"
                            >
                              {trabajo._count?.postulaciones}
                            </Badge>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="text-xs sm:text-sm"
                        >
                          <Link
                            to={`/dashboard/empleador/editar-trabajo/${trabajo.id}`}
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                            Editar
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="text-xs sm:text-sm"
                        >
                          <Link to={`/empleo/${trabajo.id}`} target="_blank">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                            Ver{" "}
                            <span className="hidden sm:inline">
                              Publicación
                            </span>
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-600 hover:bg-red-50 text-xs sm:text-sm"
                              disabled={eliminarTrabajo.isPending}
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Eliminar trabajo?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Estás por eliminar "{trabajo.titulo}". Esta
                                acción no se puede deshacer y se eliminarán
                                todas las postulaciones asociadas.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="w-full sm:w-auto">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleEliminar(trabajo.id)}
                                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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

export default TrabajosEmpleador;
