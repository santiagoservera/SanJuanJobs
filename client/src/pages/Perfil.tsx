import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Building2,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Perfil = () => {
  const navigate = useNavigate();
  const { perfil, isLoadingPerfil, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const [perfilEmpleado, setPerfilEmpleado] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    domicilio: "",
    sobreMi: "",
    experiencia: "",
    educacion: "",
  });

  const [perfilEmpleador, setPerfilEmpleador] = useState({
    nombreEmpresa: "",
    descripcionEmpresa: "",
    emailContacto: "",
    telefonoContacto: "",
    sitioWeb: "",
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

    if (perfil?.perfilEmpleador) {
      setPerfilEmpleador({
        nombreEmpresa: perfil.perfilEmpleador.nombreEmpresa || "",
        descripcionEmpresa: perfil.perfilEmpleador.descripcionEmpresa || "",
        emailContacto: perfil.perfilEmpleador.emailContacto || "",
        telefonoContacto: perfil.perfilEmpleador.telefonoContacto || "",
        sitioWeb: perfil.perfilEmpleador.sitioWeb || "",
      });
    }
  }, [perfil]);

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Perfil actualizado correctamente");
  };

  if (isLoadingPerfil) {
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

  const esEmpleado = perfil?.rol === "EMPLEADO";
  const esEmpleador = perfil?.rol === "EMPLEADOR";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Mi Perfil
              </h1>
              <Button
                variant={isEditing ? "hero" : "outline"}
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              >
                {isEditing ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Guardar
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </>
                )}
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary-foreground font-display font-bold text-3xl">
                        {esEmpleado
                          ? `${
                              perfil?.perfilEmpleado?.nombre?.charAt(0) || ""
                            }${
                              perfil?.perfilEmpleado?.apellido?.charAt(0) || ""
                            }`
                          : perfil?.perfilEmpleador?.nombreEmpresa?.charAt(0) ||
                            "E"}
                      </span>
                    </div>
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      {esEmpleado
                        ? `${perfil?.perfilEmpleado?.nombre} ${perfil?.perfilEmpleado?.apellido}`
                        : perfil?.perfilEmpleador?.nombreEmpresa}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      {perfil?.perfilEmpleado?.domicilio ||
                        "San Juan, Argentina"}
                    </p>
                    <Badge variant="gold" className="mt-3">
                      {esEmpleado && "Buscando Empleo"}
                      {esEmpleador && "Empleador"}
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
                    {esEmpleado && perfil?.perfilEmpleado?.telefono && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {perfil.perfilEmpleado.telefono}
                        </span>
                      </div>
                    )}
                    {esEmpleador &&
                      perfil?.perfilEmpleador?.telefonoContacto && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {perfil.perfilEmpleador.telefonoContacto}
                          </span>
                        </div>
                      )}
                    {esEmpleado && perfil?.perfilEmpleado?.domicilio && (
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {perfil.perfilEmpleado.domicilio}
                        </span>
                      </div>
                    )}
                    {esEmpleador && perfil?.perfilEmpleador?.sitioWeb && (
                      <div className="flex items-center gap-3 text-sm">
                        <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                        <a
                          href={perfil.perfilEmpleador.sitioWeb}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          {perfil.perfilEmpleador.sitioWeb}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2 space-y-6">
                {esEmpleado && (
                  <>
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
                          />
                        ) : (
                          <p className="text-muted-foreground whitespace-pre-wrap">
                            {perfilEmpleado.educacion || "Sin educación"}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}

                {esEmpleador && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-primary" />
                          Sobre la Empresa
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isEditing ? (
                          <Textarea
                            value={perfilEmpleador.descripcionEmpresa}
                            onChange={(e) =>
                              setPerfilEmpleador({
                                ...perfilEmpleador,
                                descripcionEmpresa: e.target.value,
                              })
                            }
                            rows={6}
                            placeholder="Contanos sobre tu empresa..."
                          />
                        ) : (
                          <p className="text-muted-foreground whitespace-pre-wrap">
                            {perfilEmpleador.descripcionEmpresa ||
                              "Sin descripción"}
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    {isEditing && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Información de Contacto</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="emailContacto">Email</Label>
                            <Input
                              id="emailContacto"
                              type="email"
                              value={perfilEmpleador.emailContacto}
                              onChange={(e) =>
                                setPerfilEmpleador({
                                  ...perfilEmpleador,
                                  emailContacto: e.target.value,
                                })
                              }
                              placeholder="contacto@empresa.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="telefonoContacto">Teléfono</Label>
                            <Input
                              id="telefonoContacto"
                              type="tel"
                              value={perfilEmpleador.telefonoContacto}
                              onChange={(e) =>
                                setPerfilEmpleador({
                                  ...perfilEmpleador,
                                  telefonoContacto: e.target.value,
                                })
                              }
                              placeholder="+54 264 123-4567"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sitioWeb">Sitio Web</Label>
                            <Input
                              id="sitioWeb"
                              type="url"
                              value={perfilEmpleador.sitioWeb}
                              onChange={(e) =>
                                setPerfilEmpleador({
                                  ...perfilEmpleador,
                                  sitioWeb: e.target.value,
                                })
                              }
                              placeholder="https://empresa.com"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Perfil;
