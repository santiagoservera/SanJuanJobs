import { Navbar } from "@/shared/components/layout/Navbar";
import { Footer } from "@/shared/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Building2,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import type { RegistroDTO } from "@/modules/auth/types/auth.types";

const Registro = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState<"EMPLEADO" | "EMPLEADOR">(
    "EMPLEADO"
  );

  // Campos comunes
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Campos para empleado
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

  // Campos para empleador
  const [nombreEmpresa, setNombreEmpresa] = useState("");

  const { registro, isRegistering } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let datos: RegistroDTO;

    if (tipoUsuario === "EMPLEADO") {
      datos = {
        email,
        contrasena: password,
        rol: "EMPLEADO",
        nombre,
        apellido,
      };
    } else {
      datos = {
        email,
        contrasena: password,
        rol: "EMPLEADOR",
        nombreEmpresa,
      };
    }

    registro(datos);
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />

      <main className="pt-24 pb-16 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Crear Cuenta
              </h1>
              <p className="text-muted-foreground">
                Unite a la comunidad laboral de San Juan
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Selector de tipo de usuario */}
                  <div className="space-y-3">
                    <Label>¿Qué tipo de cuenta querés crear?</Label>
                    <RadioGroup
                      value={tipoUsuario}
                      onValueChange={(value) =>
                        setTipoUsuario(value as "EMPLEADO" | "EMPLEADOR")
                      }
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <RadioGroupItem
                          value="EMPLEADO"
                          id="empleado"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="empleado"
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <User className="w-6 h-6 mb-2" />
                          <span className="font-medium">Busco Empleo</span>
                          <span className="text-xs text-muted-foreground">
                            Empleado
                          </span>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem
                          value="EMPLEADOR"
                          id="empleador"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="empleador"
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <Building2 className="w-6 h-6 mb-2" />
                          <span className="font-medium">Busco Personal</span>
                          <span className="text-xs text-muted-foreground">
                            Empleador
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12"
                        required
                        disabled={isRegistering}
                      />
                    </div>
                  </div>

                  {/* Campos según tipo de usuario */}
                  {tipoUsuario === "EMPLEADO" ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nombre">Nombre</Label>
                          <Input
                            id="nombre"
                            type="text"
                            placeholder="Juan"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            disabled={isRegistering}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apellido">Apellido</Label>
                          <Input
                            id="apellido"
                            type="text"
                            placeholder="Pérez"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            required
                            disabled={isRegistering}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="nombreEmpresa">
                        Nombre de la Empresa
                      </Label>
                      <Input
                        id="nombreEmpresa"
                        type="text"
                        placeholder="Mi Empresa SA"
                        value={nombreEmpresa}
                        onChange={(e) => setNombreEmpresa(e.target.value)}
                        required
                        disabled={isRegistering}
                      />
                    </div>
                  )}

                  {/* Contraseña */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 pr-12"
                        required
                        minLength={6}
                        disabled={isRegistering}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={isRegistering}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Mínimo 6 caracteres
                    </p>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isRegistering}
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      <>
                        Crear Cuenta
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-muted-foreground">
                    ¿Ya tenés cuenta?{" "}
                    <Link
                      to="/login"
                      className="text-primary font-medium hover:underline"
                    >
                      Iniciá sesión
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Registro;
