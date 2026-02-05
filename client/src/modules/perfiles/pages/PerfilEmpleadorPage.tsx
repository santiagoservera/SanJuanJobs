import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  Loader2,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useActualizarPerfilEmpleador } from "@/modules/perfiles/hooks/usePerfiles";
import { toast } from "sonner";

const PerfilEmpleador = () => {
  const { perfil, isLoadingPerfil } = useAuth();
  const actualizarPerfil = useActualizarPerfilEmpleador();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombreEmpresa: perfil?.perfilEmpleador?.nombreEmpresa || "",
    descripcionEmpresa: perfil?.perfilEmpleador?.descripcionEmpresa || "",
    emailContacto: perfil?.perfilEmpleador?.emailContacto || "",
    telefonoContacto: perfil?.perfilEmpleador?.telefonoContacto || "",
    sitioWeb: perfil?.perfilEmpleador?.sitioWeb || "",
  });

  const handleSave = async () => {
    if (!formData.nombreEmpresa) {
      toast.error("El nombre de la empresa es obligatorio");
      return;
    }

    try {
      await actualizarPerfil.mutateAsync(formData);
      setIsEditing(false);
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };

  const handleCancel = () => {
    setFormData({
      nombreEmpresa: perfil?.perfilEmpleador?.nombreEmpresa || "",
      descripcionEmpresa: perfil?.perfilEmpleador?.descripcionEmpresa || "",
      emailContacto: perfil?.perfilEmpleador?.emailContacto || "",
      telefonoContacto: perfil?.perfilEmpleador?.telefonoContacto || "",
      sitioWeb: perfil?.perfilEmpleador?.sitioWeb || "",
    });
    setIsEditing(false);
  };

  if (isLoadingPerfil) {
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
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Perfil de Empresa
            </h1>
            <p className="text-muted-foreground">
              Administrá la información de tu empresa
            </p>
          </div>
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={actualizarPerfil.isPending}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                variant="hero"
                onClick={handleSave}
                disabled={actualizarPerfil.isPending}
              >
                {actualizarPerfil.isPending ? (
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
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-4">
                    <Building2 className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-1">
                    {perfil?.perfilEmpleador?.nombreEmpresa || "Empresa"}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {perfil?.email}
                  </p>

                  {perfil?.perfilEmpleador?.sitioWeb && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Globe className="w-4 h-4" />
                      Sitio web
                    </a>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  {perfil?.perfilEmpleador?.emailContacto && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">
                          Email de contacto
                        </p>
                        <p className="text-sm text-foreground">
                          {perfil.perfilEmpleador.emailContacto}
                        </p>
                      </div>
                    </div>
                  )}
                  {perfil?.perfilEmpleador?.telefonoContacto && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">
                          Teléfono
                        </p>
                        <p className="text-sm text-foreground">
                          {perfil.perfilEmpleador.telefonoContacto}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información de la Empresa */}
            <Card>
              <CardHeader>
                <CardTitle>Información de la Empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreEmpresa">
                    Nombre de la Empresa <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nombreEmpresa"
                    value={formData.nombreEmpresa}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nombreEmpresa: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className={!isEditing ? "bg-secondary" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcionEmpresa">
                    Descripción de la Empresa
                  </Label>
                  <Textarea
                    id="descripcionEmpresa"
                    value={formData.descripcionEmpresa}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descripcionEmpresa: e.target.value,
                      })
                    }
                    rows={5}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-secondary" : ""}
                    placeholder="Describí tu empresa, qué hacen, su misión y valores..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Información de Contacto */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailContacto">Email de Contacto</Label>
                  <Input
                    id="emailContacto"
                    type="email"
                    value={formData.emailContacto}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emailContacto: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className={!isEditing ? "bg-secondary" : ""}
                    placeholder="contacto@empresa.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefonoContacto">Teléfono de Contacto</Label>
                  <Input
                    id="telefonoContacto"
                    type="tel"
                    value={formData.telefonoContacto}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        telefonoContacto: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className={!isEditing ? "bg-secondary" : ""}
                    placeholder="+54 264 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sitioWeb">Sitio Web</Label>
                  <Input
                    id="sitioWeb"
                    type="url"
                    value={formData.sitioWeb}
                    onChange={(e) =>
                      setFormData({ ...formData, sitioWeb: e.target.value })
                    }
                    disabled={!isEditing}
                    className={!isEditing ? "bg-secondary" : ""}
                    placeholder="https://www.empresa.com"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PerfilEmpleador;
