import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Edit,
  Check,
  Loader2,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useActualizarPerfilEmpleado } from "@/modules/perfiles/hooks/usePerfiles";

const PerfilEmpleado = () => {
  const { perfil, isLoadingPerfil } = useAuth();
  const actualizarPerfil = useActualizarPerfilEmpleado();
  const [isEditing, setIsEditing] = useState(false);

  const [perfilEmpleado, setPerfilEmpleado] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    domicilio: "",
    sobreMi: "",
    experiencia: "",
    educacion: "",
  });

  useEffect(() => {
    if (perfil?.perfilEmpleado) {
      setPerfilEmpleado({
        nombre: perfil.perfilEmpleado.nombre || "",
        apellido: perfil.perfilEmpleado.apellido || "",
        telefono: perfil.perfilEmpleado.telefono || "",
        domicilio: perfil.perfilEmpleado.domicilio || "",
        sobreMi: perfil.perfilEmpleado.sobreMi || "",
        experiencia: perfil.perfilEmpleado.experiencia || "",
        educacion: perfil.perfilEmpleado.educacion || "",
      });
    }
  }, [perfil]);

  const handleSave = async () => {
    // Validaciones
    if (!perfilEmpleado.nombre || !perfilEmpleado.apellido) {
      return;
    }

    try {
      await actualizarPerfil.mutateAsync(perfilEmpleado);
      setIsEditing(false);
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };

  const handleCancel = () => {
    // Restaurar valores originales
    if (perfil?.perfilEmpleado) {
      setPerfilEmpleado({
        nombre: perfil.perfilEmpleado.nombre || "",
        apellido: perfil.perfilEmpleado.apellido || "",
        telefono: perfil.perfilEmpleado.telefono || "",
        domicilio: perfil.perfilEmpleado.domicilio || "",
        sobreMi: perfil.perfilEmpleado.sobreMi || "",
        experiencia: perfil.perfilEmpleado.experiencia || "",
        educacion: perfil.perfilEmpleado.educacion || "",
      });
    }
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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Mi Perfil
            </h1>
            <p className="text-muted-foreground">
              Administrá tu información personal y profesional
            </p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
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
                      <Check className="w-4 h-4 mr-2" />
                      Guardar
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-display font-bold text-3xl">
                    {`${perfilEmpleado.nombre?.charAt(0) || ""}${
                      perfilEmpleado.apellido?.charAt(0) || ""
                    }`}
                  </span>
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {`${perfilEmpleado.nombre} ${perfilEmpleado.apellido}`}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {perfilEmpleado.domicilio || "San Juan, Argentina"}
                </p>
                <Badge variant="gold" className="mt-3">
                  Buscando Empleo
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground truncate">
                    {perfil?.email}
                  </span>
                </div>
                {perfilEmpleado.telefono && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">
                      {perfilEmpleado.telefono}
                    </span>
                  </div>
                )}
                {perfilEmpleado.domicilio && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">
                      {perfilEmpleado.domicilio}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">
                        Nombre <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nombre"
                        value={perfilEmpleado.nombre}
                        onChange={(e) =>
                          setPerfilEmpleado({
                            ...perfilEmpleado,
                            nombre: e.target.value,
                          })
                        }
                        disabled={actualizarPerfil.isPending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido">
                        Apellido <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="apellido"
                        value={perfilEmpleado.apellido}
                        onChange={(e) =>
                          setPerfilEmpleado({
                            ...perfilEmpleado,
                            apellido: e.target.value,
                          })
                        }
                        disabled={actualizarPerfil.isPending}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      value={perfilEmpleado.telefono}
                      onChange={(e) =>
                        setPerfilEmpleado({
                          ...perfilEmpleado,
                          telefono: e.target.value,
                        })
                      }
                      placeholder="+54 264 123-4567"
                      disabled={actualizarPerfil.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domicilio">Domicilio</Label>
                    <Input
                      id="domicilio"
                      value={perfilEmpleado.domicilio}
                      onChange={(e) =>
                        setPerfilEmpleado({
                          ...perfilEmpleado,
                          domicilio: e.target.value,
                        })
                      }
                      placeholder="San Juan, Argentina"
                      disabled={actualizarPerfil.isPending}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Sobre mí
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={perfilEmpleado.sobreMi}
                    onChange={(e) =>
                      setPerfilEmpleado({
                        ...perfilEmpleado,
                        sobreMi: e.target.value,
                      })
                    }
                    rows={4}
                    placeholder="Contanos sobre vos..."
                    disabled={actualizarPerfil.isPending}
                  />
                ) : (
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {perfilEmpleado.sobreMi || "Sin descripción"}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Experiencia Laboral
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={perfilEmpleado.experiencia}
                    onChange={(e) =>
                      setPerfilEmpleado({
                        ...perfilEmpleado,
                        experiencia: e.target.value,
                      })
                    }
                    rows={6}
                    placeholder="Describí tu experiencia..."
                    disabled={actualizarPerfil.isPending}
                  />
                ) : (
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {perfilEmpleado.experiencia || "Sin experiencia"}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Educación
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={perfilEmpleado.educacion}
                    onChange={(e) =>
                      setPerfilEmpleado({
                        ...perfilEmpleado,
                        educacion: e.target.value,
                      })
                    }
                    rows={4}
                    placeholder="Describí tu educación..."
                    disabled={actualizarPerfil.isPending}
                  />
                ) : (
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {perfilEmpleado.educacion || "Sin educación"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PerfilEmpleado;
