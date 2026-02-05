import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapView } from "@/components/MapView";
import { MapSelector } from "@/components/MapSelector";
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
import { ArrowLeft, Loader2, Save, MapPin } from "lucide-react";

import { toast } from "sonner";

import {
  useTrabajo,
  useActualizarTrabajo,
} from "@/modules/trabajos/hooks/useTrabajos";
import { useCategorias } from "@/modules/categorias/hooks/useCategorias";
import { useTiposTrabajo } from "@/modules/tipos-trabajo/hooks/useTiposTrabajo";
import type { ActualizarTrabajoDTO } from "@/modules/trabajos/types/trabajos.types";
import { useDepartamentos } from "@/modules/departamentos/hooks/useDepartamentos";

const EditarTrabajo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const trabajoId = parseInt(id || "0");

  const { data: trabajo, isLoading: isLoadingTrabajo } = useTrabajo(trabajoId);
  const actualizarTrabajo = useActualizarTrabajo();
  const { data: categoriasData } = useCategorias();
  const { data: tiposTrabajoData } = useTiposTrabajo();
  const { data: departamentosData } = useDepartamentos();

  const departamentos = departamentosData || [];
  const categorias = categoriasData || [];
  const tiposTrabajo = tiposTrabajoData || [];

  const [showMapSelector, setShowMapSelector] = useState(false);
  const [formData, setFormData] = useState<ActualizarTrabajoDTO>({
    titulo: "",
    descripcion: "",
    departamentoId: 0,
    ubicacion: "",
    latitud: undefined,
    longitud: undefined,
    categoriaId: 0,
    tipoTrabajoId: 0,
    paga: undefined,
    requisitos: "",
    beneficios: "",
    estado: "ACTIVO",
  });

  useEffect(() => {
    if (trabajo) {
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
  }, [trabajo]);

  const handleMapSelect = (lat: number, lng: number, address?: string) => {
    setFormData({
      ...formData,
      latitud: lat,
      longitud: lng,
      ubicacion: address || formData.ubicacion,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo || !formData.descripcion) {
      toast.error("Completá todos los campos obligatorios");
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
        id: trabajoId,
        datos: formData,
      });
      navigate("/dashboard/empleador/trabajos");
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };

  if (isLoadingTrabajo) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!trabajo) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Trabajo no encontrado
          </h2>
          <Button variant="hero" asChild>
            <Link to="/dashboard/empleador/trabajos">
              Volver a Mis Trabajos
            </Link>
          </Button>
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
            Editar Trabajo
          </h1>
          <p className="text-muted-foreground">
            Actualizá la información de la oferta laboral
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Información Básica */}
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    required
                  />
                </div>

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
                    rows={6}
                    placeholder="Describí las responsabilidades y el rol..."
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoriaId">
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
                        <SelectValue placeholder="Seleccioná una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipoTrabajoId">
                      Tipo de Trabajo <span className="text-red-500">*</span>
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
                        <SelectValue placeholder="Seleccioná el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposTrabajo.map((tipo: any) => (
                          <SelectItem key={tipo.id} value={tipo.id.toString()}>
                            {tipo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
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
              </CardContent>
            </Card>

            {/* Ubicación */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="departamentoId">
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
                      <SelectValue placeholder="Seleccioná el departamento" />
                    </SelectTrigger>
                    <SelectContent>
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
              </CardContent>
            </Card>

            {/* Detalles Adicionales */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles Adicionales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="requisitos">Requisitos</Label>
                  <Textarea
                    id="requisitos"
                    value={formData.requisitos}
                    onChange={(e) =>
                      setFormData({ ...formData, requisitos: e.target.value })
                    }
                    rows={4}
                    placeholder="Lista los requisitos del puesto..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beneficios">Beneficios</Label>
                  <Textarea
                    id="beneficios"
                    value={formData.beneficios}
                    onChange={(e) =>
                      setFormData({ ...formData, beneficios: e.target.value })
                    }
                    rows={4}
                    placeholder="Describí los beneficios que ofrecés..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Botones */}
            <div className="flex items-center gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/empleador/trabajos")}
                disabled={actualizarTrabajo.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="hero"
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
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Modal del mapa */}
        <MapSelector
          open={showMapSelector}
          onClose={() => setShowMapSelector(false)}
          onSelect={handleMapSelect}
          initialLat={formData.latitud}
          initialLng={formData.longitud}
        />
      </div>
    </DashboardLayout>
  );
};

export default EditarTrabajo;
