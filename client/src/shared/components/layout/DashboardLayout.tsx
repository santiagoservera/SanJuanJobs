import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Briefcase,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Plus,
  BarChart3,
  User,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import logoPng from "@/assets/logoPng.png";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout, perfil } = useAuth();

  const isEmpleado = usuario?.rol === "EMPLEADO";
  const isEmpleador = usuario?.rol === "EMPLEADOR";

  // Links del sidebar según el rol
  const sidebarLinks = isEmpleado
    ? [
        { href: "/dashboard/empleado", label: "Inicio", icon: Home },
        {
          href: "/dashboard/empleado/postulaciones",
          label: "Mis Postulaciones",
          icon: FileText,
        },
        { href: "/dashboard/empleado/perfil", label: "Mi Perfil", icon: User },
        {
          href: "/dashboard/empleado/configuracion",
          label: "Configuración",
          icon: Settings,
        },
      ]
    : isEmpleador
      ? [
          { href: "/dashboard/empleador", label: "Inicio", icon: Home },
          {
            href: "/dashboard/empleador/trabajos",
            label: "Mis Publicaciones",
            icon: Briefcase,
          },
          {
            href: "/dashboard/empleador/postulaciones",
            label: "Postulaciones",
            icon: Users,
          },
          // {
          //   href: "/dashboard/empleador/estadisticas",
          //   label: "Estadísticas",
          //   icon: BarChart3,
          // },
          {
            href: "/dashboard/empleador/perfil",
            label: "Perfil Empresa",
            icon: User,
          },
          {
            href: "/dashboard/empleador/configuracion",
            label: "Configuración",
            icon: Settings,
          },
        ]
      : [];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left: Menu button + Logo */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
            <Link
              to={isEmpleado ? "/dashboard/empleado" : "/dashboard/empleador"}
              className="flex items-center gap-2"
            >
              <img src={logoPng} alt="Logo" className="h-10 w-auto" />
              <span className="font-display font-bold text-lg hidden sm:block">
                Dashboard
              </span>
            </Link>
          </div>

          {/* Right: Quick actions + User menu */}
          <div className="flex items-center gap-2">
            {/* Botón para ir a la web */}
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hidden sm:flex"
            >
              <Link to="/empleos">
                <Globe className="w-4 h-4 mr-2" />
                Ver Empleos
              </Link>
            </Button>

            {/* Botón de acción rápida según rol */}
            {isEmpleador && (
              <Button
                variant="hero"
                size="sm"
                asChild
                className="hidden sm:flex"
              >
                <Link to="/dashboard/empleador/crear-trabajo">
                  <Plus className="w-4 h-4 mr-2" />
                  Publicar Trabajo
                </Link>
              </Button>
            )}

            {isEmpleado && (
              <Button
                variant="hero"
                size="sm"
                asChild
                className="hidden sm:flex"
              >
                <Link to="/empleos">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar Empleos
                </Link>
              </Button>
            )}

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-bold">
                      {isEmpleado
                        ? perfil?.perfilEmpleado?.nombre
                            ?.charAt(0)
                            .toUpperCase()
                        : perfil?.perfilEmpleador?.nombreEmpresa
                            ?.charAt(0)
                            .toUpperCase() || "U"}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {isEmpleado
                        ? `${perfil?.perfilEmpleado?.nombre} ${perfil?.perfilEmpleado?.apellido}`
                        : perfil?.perfilEmpleador?.nombreEmpresa}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {usuario?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    navigate(
                      isEmpleado
                        ? "/dashboard/empleado/perfil"
                        : "/dashboard/empleador/perfil",
                    )
                  }
                >
                  <User className="w-4 h-4 mr-2" />
                  Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigate(
                      isEmpleado
                        ? "/dashboard/empleado/configuracion"
                        : "/dashboard/empleador/configuracion",
                    )
                  }
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 z-40 w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Navigation Links */}
          <nav className="flex-1 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Botón Ir a la Web (mobile) */}
          <div className="lg:hidden pt-4 border-t border-border">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/empleos">
                <Globe className="w-4 h-4 mr-2" />
                Ver Empleos
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="pt-16 lg:pl-64">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};
