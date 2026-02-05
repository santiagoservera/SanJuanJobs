import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import logoPng from "@/assets/logoPng.png";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, usuario } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  // Determinar la ruta del dashboard según el rol
  const getDashboardRoute = () => {
    if (usuario?.rol === "EMPLEADO") return "/dashboard/empleado";
    if (usuario?.rol === "EMPLEADOR") return "/dashboard/empleador";
    return "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-20 h-20 rounded-xl flex items-center justify-center">
              <img src={logoPng} alt="Logo" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/empleos"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive("/empleos")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Buscar Empleos
            </Link>

            {isAuthenticated && (
              <Link
                to={getDashboardRoute()}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Ir al Dashboard
              </Link>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button variant="hero" size="sm" asChild>
                <Link to={getDashboardRoute()}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Ingresar</Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/registro">Registrarse</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link
              to="/empleos"
              onClick={() => setIsOpen(false)}
              className={`block p-3 rounded-lg transition-colors ${
                isActive("/empleos")
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              Buscar Empleos
            </Link>

            {isAuthenticated ? (
              <Link
                to={getDashboardRoute()}
                onClick={() => setIsOpen(false)}
                className="block p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 inline mr-2" />
                Ir al Dashboard
              </Link>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    Ingresar
                  </Link>
                </Button>
                <Button variant="hero" className="w-full" asChild>
                  <Link to="/registro" onClick={() => setIsOpen(false)}>
                    Registrarse
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
