import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Save, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useActualizarTrabajo } from "@/modules/trabajos/hooks/useTrabajos";
import { useCategorias } from "@/modules/categorias/hooks/useCategorias";
import { useTiposTrabajo } from "@/modules/tipos-trabajo/hooks/useTiposTrabajo";
import { useDepartamentos } from "@/modules/departamentos/hooks/useDepartamentos";
import { MapSelector } from "@/components/MapSelector";
import { MapView } from "@/components/MapView";
import type { ActualizarTrabajoDTO } from "@/modules/trabajos/types/trabajos.types";

interface Trabajo {
  id: number;
  titulo: string;
  descripcion: string;
  ubicacion?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  paga?: number | null;
  requisitos?: string | null;
  beneficios?: string | null;
  estado: string;
  categoria: { id: number; nombre: string };
  tipoTrabajo: { id: number; nombre: string };
  departamento?: { id: number; nombre: string } | null;
}

interface EditarTrabajoSheetProps {
  open: boolean;
  onClose: () => void;
  trabajo: Trabajo | null;
  onSuccess?: () => void;
}

export function EditarTrabajoSheet({
  open,
  onClose,
  trabajo,
  onSuccess,
}: EditarTrabajoSheetProps) {
  const actualizarTrabajo = useActualizarTrabajo();
  const { data: categorias } = useCategorias();
  const { data: tiposTrabajo } = useTiposTrabajo();
  const { data: departamentos } = useDepartamentos();

  const [showMapSelector, setShowMapSelector] = useState(false);
  const [formData, setFormData] = useState<ActualizarTrabajoDTO>({
    titulo: "",
    descripcion: "",
    departamentoId: undefined,
    ubicacion: "",
    latitud: undefined,
    longitud: undefined,
    categoriaId: undefined,
    tipoTrabajoId: undefined,
    paga: undefined,
    requisitos: "",
    beneficios: "",
    estado: "ACTIVO",
  });

  // Cargar datos del trabajo cuando se abre el sheet
  useEffect(() => {
    if (trabajo && open) {
      setFormData({
        titulo: trabajo.titulo,
        descripcion: trabajo.descripcion,
        departamentoId: trabajo.departamento?.id,
        ubicacion: trabajo.ubicacion || "",
        latitud: trabajo.latitud || undefined,
        longitud: trabajo.longitud || undefined,
        categoriaId: trabajo.categoria.id,
        tipoTrabajoId: trabajo.tipoTrabajo.id,
        paga: trabajo.paga || undefined,
        requisitos: trabajo.requisitos || "",
        beneficios: trabajo.beneficios || "",
        estado: trabajo.estado as any,
      });
    }
  }, [trabajo, open]);

  const handleMapSelect = (lat: number, lng: number, address?: string) => {
    setFormData({
      ...formData,
      latitud: lat,
      longitud: lng,
      ubicacion: address || formData.ubicacion,
    });
  };

  const handleSubmit = async () => {
    if (!trabajo) return;

    if (!formData.titulo || !formData.descripcion) {
      toast.error("Completá el título y la descripción");
      return;
    }

    if (!formData.categoriaId || !formData.tipoTrabajoId) {
      toast.error("Seleccioná una categoría y tipo de trabajo");
      return;
    }

    if (!formData.departamentoId) {
      toast.error("Seleccioná un departamento");
      return;
    }

    try {
      await actualizarTrabajo.mutateAsync({
        id: trabajo.id,
        datos: formData,
      });
      toast.success("Trabajo actualizado correctamente");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      const mensaje =
        error.response?.data?.mensaje || "Error al actualizar el trabajo";
      toast.error(mensaje);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Editar Publicación</SheetTitle>
            <SheetDescription>
              Modificá los datos de tu oferta laboral
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-140px)] mt-6 pr-4">
            <div className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="titulo">
                  Título <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  placeholder="Ej: Mozo/Moza con experiencia"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="descripcion">
                  Descripción <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  rows={4}
                  placeholder="Describí las responsabilidades del puesto..."
                />
              </div>

              {/* Categoría y Tipo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Categoría <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.categoriaId?.toString() || ""}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        categoriaId: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    Tipo <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.tipoTrabajoId?.toString() || ""}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        tipoTrabajoId: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposTrabajo?.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id.toString()}>
                          {tipo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Departamento y Salario */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Departamento <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.departamentoId?.toString() || ""}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        departamentoId: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      {departamentos?.map((depto) => (
                        <SelectItem key={depto.id} value={depto.id.toString()}>
                          {depto.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paga">Salario (opcional)</Label>
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
                    placeholder="Ej: 350000"
                  />
                </div>
              </div>

              {/* Ubicación con mapa */}
              <div className="space-y-2">
                <Label>Ubicación exacta (opcional)</Label>
                {formData.latitud && formData.longitud ? (
                  <div className="space-y-3">
                    <MapView
                      lat={formData.latitud}
                      lng={formData.longitud}
                      direccion={formData.ubicacion}
                      height="150px"
                    />
                    {formData.ubicacion && (
                      <p className="text-sm text-muted-foreground">
                        📍 {formData.ubicacion}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMapSelector(true)}
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Cambiar
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
                        Quitar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-20 border-dashed"
                    onClick={() => setShowMapSelector(true)}
                  >
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <MapPin className="w-5 h-5" />
                      <span className="text-sm">Seleccionar en el mapa</span>
                    </div>
                  </Button>
                )}
              </div>

              {/* Requisitos */}
              <div className="space-y-2">
                <Label htmlFor="requisitos">Requisitos</Label>
                <Textarea
                  id="requisitos"
                  value={formData.requisitos}
                  onChange={(e) =>
                    setFormData({ ...formData, requisitos: e.target.value })
                  }
                  rows={3}
                  placeholder="Un requisito por línea..."
                />
              </div>

              {/* Beneficios */}
              <div className="space-y-2">
                <Label htmlFor="beneficios">Beneficios</Label>
                <Textarea
                  id="beneficios"
                  value={formData.beneficios}
                  onChange={(e) =>
                    setFormData({ ...formData, beneficios: e.target.value })
                  }
                  rows={3}
                  placeholder="Un beneficio por línea..."
                />
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, estado: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVO">Activo</SelectItem>
                    <SelectItem value="CERRADO">Cerrado</SelectItem>
                    <SelectItem value="BORRADOR">Borrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Botón Guardar */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                  disabled={actualizarTrabajo.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={actualizarTrabajo.isPending}
                >
                  {actualizarTrabajo.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Modal del mapa */}
      <MapSelector
        open={showMapSelector}
        onClose={() => setShowMapSelector(false)}
        onSelect={handleMapSelect}
        initialLat={formData.latitud}
        initialLng={formData.longitud}
      />
    </>
  );
}
