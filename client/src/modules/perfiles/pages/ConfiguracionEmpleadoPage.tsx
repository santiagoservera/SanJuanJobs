import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, User, Loader2, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useCambiarContrasena } from "@/modules/perfiles/hooks/usePerfiles";

const ConfiguracionEmpleado = () => {
  const { perfil, isLoadingPerfil } = useAuth();
  const cambiarContrasena = useCambiarContrasena();

  const [contrasenaActual, setContrasenaActual] = useState("");
  const [contrasenaNueva, setContrasenaNueva] = useState("");
  const [contrasenaConfirmar, setContrasenaConfirmar] = useState("");

  const handleCambiarContrasena = async () => {
    if (!contrasenaActual || !contrasenaNueva || !contrasenaConfirmar) {
      return;
    }

    if (contrasenaNueva !== contrasenaConfirmar) {
      return;
    }

    if (contrasenaNueva.length < 6) {
      return;
    }

    try {
      await cambiarContrasena.mutateAsync({
        contrasenaActual,
        contrasenaNueva,
      });

      // Limpiar campos
      setContrasenaActual("");
      setContrasenaNueva("");
      setContrasenaConfirmar("");
    } catch (error) {
      // El error ya se maneja en el hook
    }
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

  const puedeGuardar =
    contrasenaActual &&
    contrasenaNueva &&
    contrasenaConfirmar &&
    contrasenaNueva === contrasenaConfirmar &&
    contrasenaNueva.length >= 6;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Configuración
          </h1>
          <p className="text-muted-foreground">
            Administrá la seguridad de tu cuenta
          </p>
        </div>

        <div className="space-y-6">
          {/* Información de Cuenta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Información de Cuenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre Completo</Label>
                  <Input
                    value={`${perfil?.perfilEmpleado?.nombre || ""} ${
                      perfil?.perfilEmpleado?.apellido || ""
                    }`}
                    disabled
                    className="bg-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={perfil?.email || ""}
                    disabled
                    className="bg-secondary"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>El email no puede ser modificado</span>
              </div>
            </CardContent>
          </Card>

          {/* Cambiar Contraseña */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Cambiar Contraseña
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contrasenaActual">Contraseña Actual</Label>
                <Input
                  id="contrasenaActual"
                  type="password"
                  value={contrasenaActual}
                  onChange={(e) => setContrasenaActual(e.target.value)}
                  placeholder="Tu contraseña actual"
                  disabled={cambiarContrasena.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contrasenaNueva">Nueva Contraseña</Label>
                <Input
                  id="contrasenaNueva"
                  type="password"
                  value={contrasenaNueva}
                  onChange={(e) => setContrasenaNueva(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  disabled={cambiarContrasena.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contrasenaConfirmar">
                  Confirmar Nueva Contraseña
                </Label>
                <Input
                  id="contrasenaConfirmar"
                  type="password"
                  value={contrasenaConfirmar}
                  onChange={(e) => setContrasenaConfirmar(e.target.value)}
                  placeholder="Repetí la nueva contraseña"
                  disabled={cambiarContrasena.isPending}
                />
                {contrasenaConfirmar &&
                  contrasenaNueva !== contrasenaConfirmar && (
                    <p className="text-sm text-red-600">
                      Las contraseñas no coinciden
                    </p>
                  )}
                {contrasenaNueva && contrasenaNueva.length < 6 && (
                  <p className="text-sm text-red-600">
                    La contraseña debe tener al menos 6 caracteres
                  </p>
                )}
              </div>
              <Button
                onClick={handleCambiarContrasena}
                disabled={!puedeGuardar || cambiarContrasena.isPending}
                className="w-full md:w-auto"
              >
                {cambiarContrasena.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Cambiar Contraseña"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Seguridad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg">
                <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">
                    Tu cuenta está protegida
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mantené tu contraseña segura y no la compartas con nadie. Te
                    recomendamos cambiarla periódicamente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConfiguracionEmpleado;
