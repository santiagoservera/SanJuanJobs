import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Loader2,
  Save,
  ArrowRight,
  Check,
  Plus,
  X,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCrearTrabajo } from "@/modules/trabajos/hooks/useTrabajos";
import { useCategorias } from "@/modules/categorias/hooks/useCategorias";
import { useTiposTrabajo } from "@/modules/tipos-trabajo/hooks/useTiposTrabajo";
import { useDepartamentos } from "@/modules/departamentos/hooks/useDepartamentos";
import type { CrearTrabajoDTO } from "@/modules/trabajos/types/trabajos.types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MapSelector } from "@/components/MapSelector";
import { MapView } from "@/components/MapView";

const PASOS = [
  { id: 1, nombre: "Información Básica" },
  { id: 2, nombre: "Detalles del Puesto" },
  { id: 3, nombre: "Ubicación y Salario" },
  { id: 4, nombre: "Requisitos y Beneficios" },
];

const CrearTrabajo = () => {
  const navigate = useNavigate();
  const crearTrabajo = useCrearTrabajo();
  const { data: categoriasData, isLoading: isLoadingCategorias } =
    useCategorias();
  const { data: tiposTrabajoData, isLoading: isLoadingTipos } =
    useTiposTrabajo();
  const { data: departamentosData, isLoading: isLoadingDepartamentos } =
    useDepartamentos();

  const [pasoActual, setPasoActual] = useState(1);
  const [formData, setFormData] = useState<CrearTrabajoDTO>({
    titulo: "",
    descripcion: "",
    departamentoId: 0,
    ubicacion: "",
    googleMapsUrl: "",
    latitud: undefined,
    longitud: undefined,
    categoriaId: 0,
    tipoTrabajoId: 0,
    paga: undefined,
    requisitos: "",
    beneficios: "",
    estado: "ACTIVO",
  });

  // Estados para requisitos y beneficios individuales
  const [requisitos, setRequisitos] = useState<string[]>([]);
  const [nuevoRequisito, setNuevoRequisito] = useState("");
  const [beneficios, setBeneficios] = useState<string[]>([]);
  const [nuevoBeneficio, setNuevoBeneficio] = useState("");

  // Agregar estado para el modal del mapa
  const [showMapSelector, setShowMapSelector] = useState(false);

  const categorias = categoriasData || [];
  const tiposTrabajo = tiposTrabajoData || [];
  const departamentos = departamentosData || [];

  const agregarRequisito = () => {
    if (nuevoRequisito.trim()) {
      setRequisitos([...requisitos, nuevoRequisito.trim()]);
      setNuevoRequisito("");
    }
  };

  const eliminarRequisito = (index: number) => {
    setRequisitos(requisitos.filter((_, i) => i !== index));
  };

  const agregarBeneficio = () => {
    if (nuevoBeneficio.trim()) {
      setBeneficios([...beneficios, nuevoBeneficio.trim()]);
      setNuevoBeneficio("");
    }
  };

  const eliminarBeneficio = (index: number) => {
    setBeneficios(beneficios.filter((_, i) => i !== index));
  };

  // Handler para cuando se selecciona ubicación en el mapa
  const handleMapSelect = (lat: number, lng: number, address?: string) => {
    setFormData({
      ...formData,
      latitud: lat,
      longitud: lng,
      ubicacion: address || formData.ubicacion,
    });
  };

  // Validar URL de Google Maps
  const validarGoogleMapsUrl = (url: string): boolean => {
    if (!url) return true; // Es opcional
    return url.includes("google.com/maps") || url.includes("goo.gl/maps");
  };

  const validarPaso = (paso: number): boolean => {
    switch (paso) {
      case 1:
        if (!formData.titulo || formData.titulo.length < 5) {
          toast.error("El título debe tener al menos 5 caracteres");
          return false;
        }
        if (!formData.descripcion || formData.descripcion.length < 20) {
          toast.error("La descripción debe tener al menos 20 caracteres");
          return false;
        }
        return true;
      case 2:
        if (!formData.categoriaId) {
          toast.error("Seleccioná una categoría");
          return false;
        }
        if (!formData.tipoTrabajoId) {
          toast.error("Seleccioná un tipo de trabajo");
          return false;
        }
        return true;
      case 3:
        if (!formData.departamentoId) {
          toast.error("Seleccioná un departamento");
          return false;
        }
        if (
          formData.googleMapsUrl &&
          !validarGoogleMapsUrl(formData.googleMapsUrl)
        ) {
          toast.error("La URL debe ser de Google Maps");
          return false;
        }
        if (!formData.latitud || !formData.longitud) {
          toast.error("Seleccioná una ubicación en el mapa");
          return false;
        }
        return true;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const siguientePaso = () => {
    if (validarPaso(pasoActual)) {
      setPasoActual((prev) => Math.min(prev + 1, PASOS.length));
    }
  };

  const pasoAnterior = () => {
    setPasoActual((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (asDraft = false) => {
    if (!asDraft && !validarPaso(4)) {
      return;
    }

    // Convertir arrays a strings separados por saltos de línea
    const requisitosString = requisitos.join("\n");
    const beneficiosString = beneficios.join("\n");

    try {
      await crearTrabajo.mutateAsync({
        ...formData,
        ubicacion: formData.ubicacion || undefined,
        googleMapsUrl: formData.googleMapsUrl || undefined,
        requisitos: requisitosString || undefined,
        beneficios: beneficiosString || undefined,
        estado: asDraft ? "BORRADOR" : "ACTIVO",
      });
      navigate("/dashboard/empleador/trabajos");
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };

  if (isLoadingCategorias || isLoadingTipos || isLoadingDepartamentos) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/dashboard/empleador/trabajos">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Mis Trabajos
            </Link>
          </Button>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Publicar Nuevo Trabajo
          </h1>
          <p className="text-muted-foreground">
            Completá los datos paso a paso
          </p>
        </div>

        {/* Indicador de pasos */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {PASOS.map((paso, index) => (
              <div key={paso.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                      pasoActual > paso.id
                        ? "bg-primary text-primary-foreground"
                        : pasoActual === paso.id
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {pasoActual > paso.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      paso.id
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-2 text-center font-medium",
                      pasoActual >= paso.id
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {paso.nombre}
                  </span>
                </div>
                {index < PASOS.length - 1 && (
                  <div
                    className={cn(
                      "h-1 flex-1 mx-2 rounded transition-colors",
                      pasoActual > paso.id ? "bg-primary" : "bg-secondary",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contenido de cada paso */}
        <Card>
          <CardHeader>
            <CardTitle>{PASOS[pasoActual - 1].nombre}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Paso 1: Información Básica */}
            {pasoActual === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="titulo">
                    Título del Trabajo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData({ ...formData, titulo: e.target.value })
                    }
                    placeholder="Ej: Desarrollador Full Stack"
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    Mínimo 5 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">
                    Descripción del Trabajo{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    rows={8}
                    placeholder="Describí las responsabilidades principales, el ambiente de trabajo, y lo que esperás del candidato ideal..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Mínimo 20 caracteres - Sé detallado para atraer mejores
                    candidatos
                  </p>
                </div>
              </>
            )}

            {/* Paso 2: Detalles del Puesto */}
            {pasoActual === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="categoriaId">
                    Categoría <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={
                      formData.categoriaId
                        ? formData.categoriaId.toString()
                        : ""
                    }
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        categoriaId: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccioná una categoría" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5}>
                      {categorias.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Elegí la categoría que mejor describe el puesto
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipoTrabajoId">
                    Tipo de Trabajo <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={
                      formData.tipoTrabajoId
                        ? formData.tipoTrabajoId.toString()
                        : ""
                    }
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        tipoTrabajoId: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccioná el tipo de trabajo" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5}>
                      {tiposTrabajo.map((tipo: any) => (
                        <SelectItem key={tipo.id} value={tipo.id.toString()}>
                          {tipo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Tiempo completo, medio tiempo, remoto, etc.
                  </p>
                </div>
              </>
            )}

            {/* Paso 3: Ubicación y Salario */}
            {pasoActual === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="departamentoId">
                    Departamento <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={
                      formData.departamentoId
                        ? formData.departamentoId.toString()
                        : ""
                    }
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        departamentoId: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccioná el departamento" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      sideOffset={5}
                      className="z-[9999]"
                    >
                      {departamentos.map((depto: any) => (
                        <SelectItem key={depto.id} value={depto.id.toString()}>
                          {depto.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Departamento de San Juan donde se realizará el trabajo
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Ubicación exacta (opcional)</Label>

                  {formData.latitud && formData.longitud ? (
                    <div className="space-y-3">
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
                          <MapPin className="w-4 h-4 mr-2" />
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
                              ubicacion: "",
                            })
                          }
                        >
                          Quitar ubicación
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-32 border-dashed"
                      onClick={() => setShowMapSelector(true)}
                    >
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <MapPin className="w-8 h-8" />
                        <span>Seleccionar ubicación en el mapa</span>
                      </div>
                    </Button>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Marcá la ubicación exacta del trabajo para que los
                    postulantes puedan encontrarlo fácilmente
                  </p>
                </div>

                <div className="border-t border-border my-4" />

                <div className="space-y-2">
                  <Label htmlFor="paga">Salario mensual (opcional)</Label>
                  <Input
                    id="paga"
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
                    placeholder="Ej: 500000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Podés dejarlo vacío si preferís no mostrar el salario
                  </p>
                </div>

                {/* Modal del mapa */}
                <MapSelector
                  open={showMapSelector}
                  onClose={() => setShowMapSelector(false)}
                  onSelect={handleMapSelect}
                  initialLat={formData.latitud}
                  initialLng={formData.longitud}
                />
              </>
            )}

            {/* Paso 4: Requisitos y Beneficios */}
            {pasoActual === 4 && (
              <>
                {/* Requisitos */}
                <div className="space-y-3">
                  <Label>Requisitos (opcional)</Label>

                  <div className="flex gap-2">
                    <Input
                      value={nuevoRequisito}
                      onChange={(e) => setNuevoRequisito(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          agregarRequisito();
                        }
                      }}
                      placeholder="Ej: Experiencia en JavaScript"
                      autoFocus
                    />
                    <Button
                      type="button"
                      onClick={agregarRequisito}
                      disabled={!nuevoRequisito.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {requisitos.length > 0 && (
                    <div className="space-y-2">
                      {requisitos.map((req, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-secondary rounded-lg"
                        >
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span className="flex-1 text-sm">{req}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => eliminarRequisito(index)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Agregá los requisitos uno por uno. Presioná Enter o el botón
                    + para agregar cada uno.
                  </p>
                </div>

                {/* Beneficios */}
                <div className="space-y-3">
                  <Label>Beneficios (opcional)</Label>

                  <div className="flex gap-2">
                    <Input
                      value={nuevoBeneficio}
                      onChange={(e) => setNuevoBeneficio(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          agregarBeneficio();
                        }
                      }}
                      placeholder="Ej: Obra social"
                    />
                    <Button
                      type="button"
                      onClick={agregarBeneficio}
                      disabled={!nuevoBeneficio.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {beneficios.length > 0 && (
                    <div className="space-y-2">
                      {beneficios.map((ben, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-secondary rounded-lg"
                        >
                          <Check className="w-4 h-4 text-gold shrink-0" />
                          <span className="flex-1 text-sm">{ben}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => eliminarBeneficio(index)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Agregá los beneficios uno por uno. Presioná Enter o el botón
                    + para agregar cada uno.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Botones de navegación */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            {pasoActual > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={pasoAnterior}
                disabled={crearTrabajo.isPending}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {pasoActual < PASOS.length ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSubmit(true)}
                  disabled={crearTrabajo.isPending}
                >
                  Guardar Borrador
                </Button>
                <Button
                  type="button"
                  variant="hero"
                  onClick={siguientePaso}
                  disabled={crearTrabajo.isPending}
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSubmit(true)}
                  disabled={crearTrabajo.isPending}
                >
                  Guardar como Borrador
                </Button>
                <Button
                  type="button"
                  variant="hero"
                  onClick={() => handleSubmit(false)}
                  disabled={crearTrabajo.isPending}
                >
                  {crearTrabajo.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Publicar Trabajo
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CrearTrabajo;
