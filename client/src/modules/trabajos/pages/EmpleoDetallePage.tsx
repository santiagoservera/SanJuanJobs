import { useState, useEffect } from "react";
import { Navbar } from "@/shared/components/layout/Navbar";
import { Footer } from "@/shared/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Building2,
  Banknote,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle,
  Users,
  Calendar,
  Loader2,
  ExternalLink,
  Pencil,
  X,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import {
  useTrabajo,
  useActualizarTrabajo,
} from "@/modules/trabajos/hooks/useTrabajos";
import { useCategorias } from "@/modules/categorias/hooks/useCategorias";
import { useTiposTrabajo } from "@/modules/tipos-trabajo/hooks/useTiposTrabajo";
import { useDepartamentos } from "@/modules/departamentos/hooks/useDepartamentos";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import {
  useCrearPostulacion,
  useYaPostulado,
} from "@/modules/postulaciones/hooks/usePostulaciones";
import { MapView } from "@/components/MapView";
import { MapSelector } from "@/components/MapSelector";

const EmpleoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, usuario } = useAuth();

  // Estado de edición
  const [modoEdicion, setModoEdicion] = useState(false);
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    departamentoId: 0,
    ubicacion: "",
    latitud: undefined as number | undefined,
    longitud: undefined as number | undefined,
    categoriaId: 0,
    tipoTrabajoId: 0,
    paga: undefined as number | undefined,
    requisitos: "",
    beneficios: "",
    estado: "ACTIVO" as "ACTIVO" | "CERRADO" | "BORRADOR",
  });

  const { data: trabajo, isLoading } = useTrabajo(parseInt(id || "0"));
  const actualizarTrabajo = useActualizarTrabajo();
  const crearPostulacion = useCrearPostulacion();

  // Datos para los selects
  const { data: categorias } = useCategorias();
  const { data: tiposTrabajo } = useTiposTrabajo();
  const { data: departamentos } = useDepartamentos();

  // Verificar si ya se postuló
  const { data: yaPostulado, isLoading: isLoadingPostulacion } = useYaPostulado(
    isAuthenticated && usuario?.rol === "EMPLEADO" ? parseInt(id || "0") : 0,
  );

  // Cargar datos del trabajo en el formulario cuando entra en modo edición
  useEffect(() => {
    if (trabajo && modoEdicion) {
      setFormData({
        titulo: trabajo.titulo,
        descripcion: trabajo.descripcion,
        departamentoId: trabajo.departamento?.id || 0,
        ubicacion: trabajo.ubicacion || "",
        latitud: trabajo.latitud || undefined,
        longitud: trabajo.longitud || undefined,
        categoriaId: trabajo.categoria.id,
        tipoTrabajoId: trabajo.tipoTrabajo.id,
        paga: trabajo.paga || undefined,
        requisitos: trabajo.requisitos || "",
        beneficios: trabajo.beneficios || "",
        estado: trabajo.estado,
      });
    }
  }, [trabajo, modoEdicion]);

  const handleMapSelect = (lat: number, lng: number, address?: string) => {
    setFormData({
      ...formData,
      latitud: lat,
      longitud: lng,
      ubicacion: address || formData.ubicacion,
    });
  };

  const handleGuardar = async () => {
    if (!trabajo) return;

    if (!formData.titulo || !formData.descripcion) {
      toast.error("Completá el título y la descripción");
      return;
    }

    try {
      await actualizarTrabajo.mutateAsync({
        id: trabajo.id,
        datos: formData,
      });
      toast.success("Trabajo actualizado correctamente");
      setModoEdicion(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.mensaje || "Error al actualizar el trabajo",
      );
    }
  };

  const handleCancelar = () => {
    setModoEdicion(false);
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error("Necesitás iniciar sesión para postularte");
      navigate("/login");
      return;
    }

    if (usuario?.rol !== "EMPLEADO") {
      toast.error("Solo los empleados pueden postularse a trabajos");
      return;
    }

    if (yaPostulado) {
      toast.info("Ya te postulaste a este trabajo");
      return;
    }

    if (!trabajo) return;

    try {
      await crearPostulacion.mutateAsync({
        trabajoId: trabajo.id,
      });

      toast.success("¡Postulación enviada!", {
        description: "La empresa recibirá tu perfil y te contactará pronto.",
      });
    } catch (error: any) {
      toast.error(
        error.response?.data?.mensaje || "Error al enviar la postulación",
      );
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copiado al portapapeles");
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error("Necesitás iniciar sesión para guardar empleos");
      navigate("/login");
      return;
    }
    toast.success("Empleo guardado en favoritos");
  };

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

  if (!trabajo) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">
            Empleo no encontrado
          </h1>
          <Button variant="hero" asChild>
            <Link to="/empleos">Ver todos los empleos</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const esElEmpleador = usuario?.id === trabajo.empleador.id;
  const puedePostularse =
    isAuthenticated &&
    usuario?.rol === "EMPLEADO" &&
    !esElEmpleador &&
    !yaPostulado;

  // Calcular tiempo desde publicación
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

  // Construir texto de ubicación
  const ubicacionTexto = modoEdicion
    ? [
        departamentos?.find((d) => d.id === formData.departamentoId)?.nombre,
        formData.ubicacion,
      ]
        .filter(Boolean)
        .join(" - ")
    : [trabajo.departamento?.nombre, trabajo.ubicacion]
        .filter(Boolean)
        .join(" - ");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Barra de edición flotante */}
      {modoEdicion && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-primary text-primary-foreground shadow-lg">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              <span className="font-medium">Modo edición</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelar}
                disabled={actualizarTrabajo.isPending}
                className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleGuardar}
                disabled={actualizarTrabajo.isPending}
              >
                {actualizarTrabajo.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    Guardar cambios
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className={`pt-24 pb-16 ${modoEdicion ? "mt-12" : ""}`}>
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
              <Card className={modoEdicion ? "ring-2 ring-primary" : ""}>
                <CardContent className="p-8">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div className="flex-1">
                      {modoEdicion ? (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Select
                              value={formData.tipoTrabajoId?.toString() || ""}
                              onValueChange={(value) =>
                                setFormData({
                                  ...formData,
                                  tipoTrabajoId: parseInt(value),
                                })
                              }
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                {tiposTrabajo?.map((tipo) => (
                                  <SelectItem
                                    key={tipo.id}
                                    value={tipo.id.toString()}
                                  >
                                    {tipo.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={formData.estado}
                              onValueChange={(value) =>
                                setFormData({
                                  ...formData,
                                  estado: value as
                                    | "ACTIVO"
                                    | "CERRADO"
                                    | "BORRADOR",
                                })
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ACTIVO">Activo</SelectItem>
                                <SelectItem value="CERRADO">Cerrado</SelectItem>
                                <SelectItem value="BORRADOR">
                                  Borrador
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Input
                            value={formData.titulo}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                titulo: e.target.value,
                              })
                            }
                            className="text-2xl font-bold font-display"
                            placeholder="Título del trabajo"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={
                                trabajo.tipoTrabajo.slug === "tiempo-completo"
                                  ? "default"
                                  : trabajo.tipoTrabajo.slug === "medio-tiempo"
                                    ? "secondary"
                                    : trabajo.tipoTrabajo.slug === "temporal"
                                      ? "gold"
                                      : "wine"
                              }
                            >
                              {trabajo.tipoTrabajo.nombre}
                            </Badge>
                            {trabajo.estado === "ACTIVO" && (
                              <Badge variant="gold">Activo</Badge>
                            )}
                          </div>
                          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                            {trabajo.titulo}
                          </h1>
                        </>
                      )}
                    </div>
                    {!modoEdicion && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleShare}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleSave}
                        >
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Company Info */}
                  <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b border-border">
                    <div className="flex items-center gap-2 text-foreground">
                      <Building2 className="w-5 h-5 text-primary" />
                      <span className="font-medium">
                        {trabajo.empleador.perfilEmpleador?.nombreEmpresa ||
                          "Empresa"}
                      </span>
                    </div>

                    {modoEdicion ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        <Select
                          value={formData.departamentoId?.toString() || ""}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              departamentoId: parseInt(value),
                            })
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Departamento" />
                          </SelectTrigger>
                          <SelectContent className="z-[9999]">
                            {departamentos?.map((depto) => (
                              <SelectItem
                                key={depto.id}
                                value={depto.id.toString()}
                              >
                                {depto.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span>{ubicacionTexto || "San Juan"}</span>
                      </div>
                    )}

                    {modoEdicion ? (
                      <div className="flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-primary" />
                        <Input
                          type="number"
                          value={formData.paga || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paga: e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
                            })
                          }
                          className="w-32"
                          placeholder="Salario"
                        />
                      </div>
                    ) : (
                      trabajo.paga && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Banknote className="w-5 h-5 text-primary" />
                          <span>${trabajo.paga.toLocaleString("es-AR")}</span>
                        </div>
                      )
                    )}

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-5 h-5 text-primary" />
                      <span>{postedAt}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                        Descripción del puesto
                      </h2>
                      {modoEdicion ? (
                        <Textarea
                          value={formData.descripcion}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              descripcion: e.target.value,
                            })
                          }
                          rows={6}
                          placeholder="Describí las responsabilidades del puesto..."
                        />
                      ) : (
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {trabajo.descripcion}
                        </p>
                      )}
                    </div>

                    {/* Ubicación con mapa */}
                    {modoEdicion ? (
                      <div>
                        <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                          Ubicación exacta
                        </h2>
                        <div className="space-y-3">
                          <Input
                            value={formData.ubicacion}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                ubicacion: e.target.value,
                              })
                            }
                            placeholder="Dirección específica (ej: Av. San Martín 456)"
                          />
                          {formData.latitud && formData.longitud ? (
                            <div className="space-y-2">
                              <MapView
                                lat={formData.latitud}
                                lng={formData.longitud}
                                direccion={formData.ubicacion}
                                height="200px"
                              />
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowMapSelector(true)}
                                >
                                  <MapPin className="w-4 h-4 mr-1" />
                                  Cambiar ubicación
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setFormData({
                                      ...formData,
                                      latitud: undefined,
                                      longitud: undefined,
                                    })
                                  }
                                >
                                  Quitar mapa
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowMapSelector(true)}
                            >
                              <MapPin className="w-4 h-4 mr-2" />
                              Seleccionar en el mapa
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      trabajo.latitud &&
                      trabajo.longitud && (
                        <div>
                          <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                            Ubicación
                          </h2>
                          <div className="space-y-3">
                            {ubicacionTexto && (
                              <p className="text-muted-foreground flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                {ubicacionTexto}
                              </p>
                            )}
                            <MapView
                              lat={trabajo.latitud}
                              lng={trabajo.longitud}
                              titulo={trabajo.titulo}
                              direccion={ubicacionTexto}
                              height="250px"
                            />
                            <a
                              href={`https://www.google.com/maps?q=${trabajo.latitud},${trabajo.longitud}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                              Abrir en Google Maps
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      )
                    )}

                    {/* Requisitos */}
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                        Requisitos
                      </h2>
                      {modoEdicion ? (
                        <Textarea
                          value={formData.requisitos}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              requisitos: e.target.value,
                            })
                          }
                          rows={4}
                          placeholder="Un requisito por línea..."
                        />
                      ) : trabajo.requisitos ? (
                        <div className="text-muted-foreground leading-relaxed">
                          {trabajo.requisitos.split("\n").map((req, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 mb-2"
                            >
                              <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          No se especificaron requisitos
                        </p>
                      )}
                    </div>

                    {/* Beneficios */}
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                        Beneficios
                      </h2>
                      {modoEdicion ? (
                        <Textarea
                          value={formData.beneficios}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              beneficios: e.target.value,
                            })
                          }
                          rows={4}
                          placeholder="Un beneficio por línea..."
                        />
                      ) : trabajo.beneficios ? (
                        <div className="text-muted-foreground leading-relaxed">
                          {trabajo.beneficios.split("\n").map((ben, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 mb-2"
                            >
                              <CheckCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                              <span>{ben}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          No se especificaron beneficios
                        </p>
                      )}
                    </div>

                    {/* Categoría */}
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                        Categoría
                      </h2>
                      {modoEdicion ? (
                        <Select
                          value={formData.categoriaId?.toString() || ""}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              categoriaId: parseInt(value),
                            })
                          }
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {categorias?.map((cat) => (
                              <SelectItem
                                key={cat.id}
                                value={cat.id.toString()}
                              >
                                {cat.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">
                            {trabajo.categoria.nombre}
                          </Badge>
                          <Badge variant="secondary">
                            {trabajo.tipoTrabajo.nombre}
                          </Badge>
                          {trabajo.departamento && (
                            <Badge variant="secondary">
                              {trabajo.departamento.nombre}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  {esElEmpleador ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-4">
                        Esta es tu publicación
                      </p>
                      {modoEdicion ? (
                        <p className="text-sm text-primary">
                          Editando publicación...
                        </p>
                      ) : (
                        <Button
                          variant="hero"
                          size="lg"
                          className="w-full"
                          onClick={() => setModoEdicion(true)}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Editar Publicación
                        </Button>
                      )}
                    </div>
                  ) : yaPostulado ? (
                    <div className="text-center py-4">
                      <Badge variant="gold" className="mb-4">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Ya te postulaste
                      </Badge>
                      <p className="text-sm text-muted-foreground mb-4">
                        La empresa revisará tu perfil y te contactará pronto
                      </p>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        asChild
                      >
                        <Link to="/dashboard/empleado/postulaciones">
                          Ver mis postulaciones
                        </Link>
                      </Button>
                    </div>
                  ) : puedePostularse ? (
                    <>
                      <Button
                        variant="hero"
                        size="xl"
                        className="w-full mb-4"
                        onClick={handleApply}
                        disabled={
                          crearPostulacion.isPending || isLoadingPostulacion
                        }
                      >
                        {crearPostulacion.isPending || isLoadingPostulacion ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {isLoadingPostulacion
                              ? "Verificando..."
                              : "Enviando..."}
                          </>
                        ) : (
                          "Postularme ahora"
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        Tu perfil será enviado al empleador
                      </p>
                    </>
                  ) : !isAuthenticated ? (
                    <>
                      <Button
                        variant="hero"
                        size="xl"
                        className="w-full mb-4"
                        asChild
                      >
                        <Link to="/login">Iniciar sesión para postularme</Link>
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        Necesitás una cuenta para postularte
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">
                        Solo los empleados pueden postularse a trabajos
                      </p>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-border space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Postulantes
                        </p>
                        <p className="font-semibold text-foreground">
                          {trabajo._count?.postulaciones || 0} persona
                          {trabajo._count?.postulaciones !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Publicado
                        </p>
                        <p className="font-semibold text-foreground">
                          {postedAt}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-display font-bold text-xl">
                        {trabajo.empleador.perfilEmpleador?.nombreEmpresa?.charAt(
                          0,
                        ) || "E"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">
                        {trabajo.empleador.perfilEmpleador?.nombreEmpresa ||
                          "Empresa"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {trabajo.departamento?.nombre || "San Juan"}
                      </p>
                    </div>
                  </div>
                  {trabajo.empleador.perfilEmpleador?.descripcionEmpresa && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {trabajo.empleador.perfilEmpleador.descripcionEmpresa}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link to={`/empresa/${trabajo.empleador.id}`}>
                      Ver perfil de empresa
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal del mapa */}
      <MapSelector
        open={showMapSelector}
        onClose={() => setShowMapSelector(false)}
        onSelect={handleMapSelect}
        initialLat={formData.latitud}
        initialLng={formData.longitud}
      />
    </div>
  );
};

export default EmpleoDetalle;
