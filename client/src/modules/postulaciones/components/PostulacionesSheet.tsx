import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  MessageCircle,
} from "lucide-react";
import {
  usePostulacionesPorTrabajo,
  useActualizarEstadoPostulacion,
} from "@/modules/postulaciones/hooks/usePostulaciones";

interface PostulacionesSheetProps {
  open: boolean;
  onClose: () => void;
  trabajo: {
    id: number;
    titulo: string;
  } | null;
}

export function PostulacionesSheet({
  open,
  onClose,
  trabajo,
}: PostulacionesSheetProps) {
  const { data, isLoading } = usePostulacionesPorTrabajo(
    open && trabajo ? trabajo.id : null,
  );
  const actualizarEstado = useActualizarEstadoPostulacion();

  const postulaciones = data?.postulaciones || [];

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
    });
  };

  // Formatear teléfono para WhatsApp (quitar espacios, guiones, etc.)
  const formatearTelefonoWhatsApp = (telefono: string) => {
    // Eliminar todo lo que no sea número
    let numero = telefono.replace(/\D/g, "");

    // Si empieza con 0, quitarlo (código de área argentino)
    if (numero.startsWith("0")) {
      numero = numero.substring(1);
    }

    // Si no tiene código de país, agregar +54 (Argentina)
    if (!numero.startsWith("54")) {
      numero = "54" + numero;
    }

    return numero;
  };

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
            <FileText className="w-3 h-3" />
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

  const handleAceptar = (postulacionId: number) => {
    actualizarEstado.mutate({ id: postulacionId, estado: "ACEPTADA" });
  };

  const handleRechazar = (postulacionId: number) => {
    actualizarEstado.mutate({ id: postulacionId, estado: "RECHAZADA" });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Postulaciones
          </SheetTitle>
          <SheetDescription className="line-clamp-2">
            {trabajo?.titulo}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : postulaciones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Aún no hay postulaciones para este trabajo
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-140px)] mt-6 pr-4">
            <div className="space-y-4">
              {postulaciones.map((postulacion: any) => (
                <div
                  key={postulacion.id}
                  className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                >
                  {/* Cabecera */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <span className="text-primary-foreground font-bold text-sm">
                          {postulacion.empleado.perfilEmpleado?.nombre?.charAt(
                            0,
                          ) || "U"}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {postulacion.empleado.perfilEmpleado?.nombre}{" "}
                          {postulacion.empleado.perfilEmpleado?.apellido}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatearFecha(postulacion.fechaPostulacion)}
                        </p>
                      </div>
                    </div>
                    {getEstadoBadge(postulacion.estado)}
                  </div>

                  {/* Información de contacto */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3 shrink-0" />
                      <a
                        href={`mailto:${postulacion.empleado.email}`}
                        className="truncate hover:text-primary"
                      >
                        {postulacion.empleado.email}
                      </a>
                    </div>
                    {postulacion.empleado.perfilEmpleado?.telefono && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3 shrink-0 text-muted-foreground" />
                        <a
                          href={`https://wa.me/${formatearTelefonoWhatsApp(
                            postulacion.empleado.perfilEmpleado.telefono,
                          )}?text=${encodeURIComponent(
                            `Hola ${postulacion.empleado.perfilEmpleado?.nombre}, te contacto por tu postulación al puesto "${trabajo?.titulo}" en SanJuanJobs.`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:underline"
                        >
                          <MessageCircle className="w-3 h-3" />
                          {postulacion.empleado.perfilEmpleado.telefono}
                        </a>
                      </div>
                    )}
                    {postulacion.empleado.perfilEmpleado?.domicilio && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {postulacion.empleado.perfilEmpleado.domicilio}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Sobre mí */}
                  {postulacion.empleado.perfilEmpleado?.sobreMi && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-foreground mb-1">
                        Sobre mí:
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {postulacion.empleado.perfilEmpleado.sobreMi}
                      </p>
                    </div>
                  )}

                  {/* Experiencia */}
                  {postulacion.empleado.perfilEmpleado?.experiencia && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-foreground mb-1">
                        Experiencia:
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {postulacion.empleado.perfilEmpleado.experiencia}
                      </p>
                    </div>
                  )}

                  {/* Carta de presentación */}
                  {postulacion.cartaPresentacion && (
                    <div className="mb-3 p-2 bg-secondary rounded">
                      <p className="text-xs font-medium text-foreground mb-1">
                        Mensaje:
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {postulacion.cartaPresentacion}
                      </p>
                    </div>
                  )}

                  {/* Botones de acción */}
                  {postulacion.estado === "PENDIENTE" && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleAceptar(postulacion.id)}
                        disabled={actualizarEstado.isPending}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Aceptar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-red-600 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleRechazar(postulacion.id)}
                        disabled={actualizarEstado.isPending}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Rechazar
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
